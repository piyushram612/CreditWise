import React, { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/app/utils/supabase';
import type { User, UserOwnedCard, Card } from '@/app/types';
import { XMarkIcon, TrashIcon, PlusIcon } from '@/app/components/shared/Icons';
import { getDetailedCardInfo } from '@/app/utils/cardKnowledgeBase';

interface CardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onCardSaved: () => void;
  existingCard?: UserOwnedCard | null;
}

export function CardFormModal({ isOpen, onClose, user, onCardSaved, existingCard }: CardFormModalProps) {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [cardName, setCardName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [cardType, setCardType] = useState('Points');
  const [network, setNetwork] = useState('');
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);
  const [creditLimit, setCreditLimit] = useState('');
  const [usedAmount, setUsedAmount] = useState('');
  const [benefits, setBenefits] = useState([{ key: '', value: '' }]);
  const [fees, setFees] = useState([{ key: '', value: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllCards = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('card_name', { ascending: true });
      if (!error) setAllCards(data || []);
    };
    fetchAllCards();
  }, []);

  useEffect(() => {
    if (isOpen && existingCard) {
      setCardName(existingCard.card_name || '');
      setIssuer(existingCard.issuer || '');
      setCardType(existingCard.card_type || 'Points');
      setNetwork(existingCard.network || '');
      setCreditLimit(existingCard.credit_limit?.toString() || '');
      setUsedAmount(existingCard.used_amount?.toString() || '0');
      setBenefits(
        existingCard.benefits && Object.keys(existingCard.benefits).length > 0
          ? Object.entries(existingCard.benefits).map(([key, value]) => ({ key, value: String(value) }))
          : [{ key: '', value: '' }]
      );
      setFees(
        existingCard.fees && Object.keys(existingCard.fees).length > 0
          ? Object.entries(existingCard.fees).map(([key, value]) => ({ key, value: String(value) }))
          : [{ key: '', value: '' }]
      );
    } else if (isOpen) {
      setCardName('');
      setIssuer('');
      setCardType('Points');
      setNetwork('');
      setAvailableNetworks([]);
      setCreditLimit('');
      setUsedAmount('');
      setBenefits([{ key: '', value: '' }]);
      setFees([{ key: '', value: '' }]);
      setError(null);
    }
  }, [existingCard, isOpen]);

  const handleTemplateSelect = (cardId: string) => {
    const template = allCards.find(c => c.id === cardId);
    if (template) {
      setCardName(template.card_name || '');
      setIssuer(template.issuer || '');

      // Get detailed card info from knowledge base
      const detailedInfo = getDetailedCardInfo(template.card_name || '', template.issuer || '');
      
      // Set available networks and default network
      let networkString = '';
      if (detailedInfo?.network) {
        networkString = detailedInfo.network;
      } else if (template.benefits && typeof template.benefits === 'object') {
        const benefitsObj = template.benefits as Record<string, unknown>;
        networkString = String(benefitsObj.network || '');
      }
      
      if (networkString) {
        const networks = networkString.split('/').map(n => n.trim());
        setAvailableNetworks(networks);
        setNetwork(networks[0]); // Set first network as default
      } else {
        setAvailableNetworks(['Visa', 'Mastercard', 'RuPay', 'American Express']);
        setNetwork('');
      }

      const newBenefits = [];
      
      // First try to get benefits from knowledge base (more detailed)
      if (detailedInfo) {
        // Add reward rates from knowledge base
        Object.entries(detailedInfo.reward_rates).forEach(([category, info]) => {
          const formattedCategory = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const rateDisplay = `${info.rate}${info.type.includes('%') ? '%' : 'x'}`;
          const notes = info.notes ? ` - ${info.notes}` : '';
          newBenefits.push({ 
            key: formattedCategory, 
            value: `${rateDisplay}${notes}` 
          });
        });

        // Add partnership benefits
        Object.entries(detailedInfo.partnerships).forEach(([partner, info]) => {
          newBenefits.push({ 
            key: `${partner} Partnership`, 
            value: `${info.reward_rate}% rewards - ${info.benefits.join(', ')}` 
          });
        });
      }

      // Fallback to template benefits if knowledge base doesn't have info
      if (newBenefits.length === 0 && template.benefits && typeof template.benefits === 'object') {
        const benefitsObj = template.benefits as Record<string, unknown>;
        
        // Extract reward rates if they exist
        if (benefitsObj.reward_rates) {
          for (const [key, value] of Object.entries(benefitsObj.reward_rates)) {
            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            const valueObj = value as Record<string, unknown>;
            const rate = valueObj?.rate ?? 'N/A';
            const type = valueObj?.type ?? '';
            const rateDisplay = `${rate}${typeof type === 'string' && type.includes('%') ? '%' : 'x'}`;
            const notes = valueObj?.notes ? ` (${valueObj.notes})` : '';
            newBenefits.push({ key: formattedKey, value: String(`${rateDisplay}${notes}`) });
          }
        }

        // Extract welcome benefits if they exist
        if (benefitsObj.welcome_benefits && benefitsObj.welcome_benefits !== "None.") {
          newBenefits.push({ key: 'Welcome Benefit', value: String(benefitsObj.welcome_benefits) });
        }

        // Extract lounge access if it exists
        const loungeAccess = benefitsObj.lounge_access as Record<string, unknown> | undefined;
        if (loungeAccess?.domestic && loungeAccess.domestic !== "None.") {
          newBenefits.push({ key: 'Domestic Lounge Access', value: String(loungeAccess.domestic) });
        }

        if (loungeAccess?.international && loungeAccess.international !== "None.") {
          newBenefits.push({ key: 'International Lounge Access', value: String(loungeAccess.international) });
        }

        // Extract other benefits if they exist
        if (benefitsObj.other_benefits && Array.isArray(benefitsObj.other_benefits)) {
          benefitsObj.other_benefits.forEach((benefit, index) => {
            newBenefits.push({ key: `Other Benefit ${index + 1}`, value: String(benefit) });
          });
        }

        // Extract milestone benefits if they exist
        if (benefitsObj.milestone_benefits && Array.isArray(benefitsObj.milestone_benefits)) {
          benefitsObj.milestone_benefits.forEach((milestone: Record<string, unknown>, index: number) => {
            if (milestone.condition && milestone.reward) {
              newBenefits.push({ 
                key: `Milestone ${index + 1}`, 
                value: `${milestone.condition} - ${milestone.reward}` 
              });
            }
          });
        }

        // Extract suitability as a benefit
        if (benefitsObj.suitability) {
          newBenefits.push({ key: 'Best For', value: String(benefitsObj.suitability) });
        }
      }

      setBenefits(newBenefits.length > 0 ? newBenefits : [{ key: '', value: '' }]);

      const newFees = [];
      
      // First try to get fees from knowledge base
      if (detailedInfo) {
        newFees.push({ key: 'Joining Fee', value: `₹${detailedInfo.joining_fee}` });
        newFees.push({ key: 'Annual Fee', value: `₹${detailedInfo.annual_fee}` });
        if (detailedInfo.fee_waiver && detailedInfo.fee_waiver !== "None.") {
          newFees.push({ key: 'Fee Waiver', value: detailedInfo.fee_waiver });
        }
      }
      // Fallback to template fees (now inside benefits object)
      else if (template.benefits && typeof template.benefits === 'object') {
        const benefitsObj = template.benefits as Record<string, unknown>;
        
        if (benefitsObj.joining_fee !== undefined) {
          newFees.push({ key: 'Joining Fee', value: `₹${String(benefitsObj.joining_fee)}` });
        }
        if (benefitsObj.annual_fee !== undefined) {
          newFees.push({ key: 'Annual Fee', value: `₹${String(benefitsObj.annual_fee)}` });
        }
        if (benefitsObj.fee_waiver && benefitsObj.fee_waiver !== "None.") {
          newFees.push({ key: 'Fee Waiver', value: String(benefitsObj.fee_waiver) });
        }
      }
      // Legacy support for old template structure
      else if (template.fees && typeof template.fees === 'object') {
        const feesObj = template.fees as Record<string, unknown>;
        
        if (feesObj.joining_fee) {
          newFees.push({ key: 'Joining Fee', value: `₹${String(feesObj.joining_fee)}` });
        }
        if (feesObj.annual_fee) {
          newFees.push({ key: 'Annual Fee', value: `₹${String(feesObj.annual_fee)}` });
        }
        if (feesObj.fee_waiver && feesObj.fee_waiver !== "None.") {
          newFees.push({ key: 'Fee Waiver', value: String(feesObj.fee_waiver) });
        }
      }

      setFees(newFees.length > 0 ? newFees : [{ key: '', value: '' }]);
    }
  };

  const handleDynamicFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    fieldType: 'benefits' | 'fees'
  ) => {
    const list = fieldType === 'benefits' ? [...benefits] : [...fees];
    const updatedItem = { ...list[index], [event.target.name]: event.target.value };
    list[index] = updatedItem as { key: string; value: string; };

    if (fieldType === 'benefits') setBenefits(list);
    else setFees(list);
  };

  const addDynamicField = (fieldType: 'benefits' | 'fees') => {
    if (fieldType === 'benefits') setBenefits([...benefits, { key: '', value: '' }]);
    else setFees([...fees, { key: '', value: '' }]);
  };

  const removeDynamicField = (index: number, fieldType: 'benefits' | 'fees') => {
    const list = fieldType === 'benefits' ? [...benefits] : [...fees];
    list.splice(index, 1);
    if (fieldType === 'benefits') setBenefits(list);
    else setFees(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !issuer || !creditLimit) {
      setError("Card Name, Issuer, and Credit Limit are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const benefitsAsObject = benefits.reduce((obj, item) =>
      item.key ? ({ ...obj, [item.key]: item.value }) : obj, {}
    );
    const feesAsObject = fees.reduce((obj, item) =>
      item.key ? ({ ...obj, [item.key]: item.value }) : obj, {}
    );

    const cardData = {
      user_id: user.id,
      card_name: cardName,
      issuer: issuer,
      card_type: cardType,
      network: network || null,
      credit_limit: parseInt(creditLimit, 10),
      used_amount: parseInt(usedAmount, 10) || 0,
      benefits: benefitsAsObject,
      fees: feesAsObject,
    };

    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Unable to connect to database');
      setIsLoading(false);
      return;
    }
    
    const { error: upsertError } = existingCard
      ? await supabase.from('user_owned_cards').update(cardData).eq('id', existingCard.id)
      : await supabase.from('user_owned_cards').insert(cardData);

    setIsLoading(false);

    if (upsertError) {
      setError(upsertError.message);
    } else {
      onCardSaved();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 max-w-lg w-full relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <XMarkIcon />
        </button>

        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {existingCard ? 'Edit Credit Card' : 'Add a New Credit Card'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select a card from the list to autofill details, or enter them manually.
        </p>

        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-4 pr-2">
          <select
            onChange={(e) => handleTemplateSelect(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-4"
          >
            <option value="">Or select a template to start...</option>
            {allCards.map(card => (
              <option key={card.id} value={card.id}>{card.card_name}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Name</label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issuer</label>
              <input
                type="text"
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Type</label>
              <select
                value={cardType}
                onChange={e => setCardType(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              >
                <option>Points</option>
                <option>Cashback</option>
                <option>Miles</option>
                <option>Travel</option>
                <option>Lifestyle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Network
                <span className="text-xs text-gray-500 ml-1">(Important for UPI compatibility)</span>
              </label>
              <select
                value={network}
                onChange={e => setNetwork(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              >
                <option value="">Select Network</option>
                {availableNetworks.length > 0 ? (
                  availableNetworks.map(net => (
                    <option key={net} value={net}>
                      {net} {net === 'RuPay' ? '(UPI Compatible)' : '(No UPI)'}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Visa">Visa (No UPI)</option>
                    <option value="Mastercard">Mastercard (No UPI)</option>
                    <option value="RuPay">RuPay (UPI Compatible)</option>
                    <option value="American Express">American Express (No UPI)</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Credit Limit</label>
              <input
                type="number"
                value={creditLimit}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={e => setCreditLimit(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Used Amount (Current Statement)</label>
              <input
                type="number"
                value={usedAmount}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={e => setUsedAmount(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
              />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-4">Benefits</h4>
            {benefits.map((b, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  name="key"
                  placeholder="Benefit"
                  value={b.key}
                  onChange={e => handleDynamicFieldChange(index, e, 'benefits')}
                  className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                />
                <input
                  name="value"
                  placeholder="Value"
                  value={b.value}
                  onChange={e => handleDynamicFieldChange(index, e, 'benefits')}
                  className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeDynamicField(index, 'benefits')}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addDynamicField('benefits')}
              className="mt-2 text-sm text-blue-500 font-semibold flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" /> Add Benefit
            </button>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-4">Fees</h4>
            {fees.map((f, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  name="key"
                  placeholder="Fee Type"
                  value={f.key}
                  onChange={e => handleDynamicFieldChange(index, e, 'fees')}
                  className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                />
                <input
                  name="value"
                  placeholder="Value"
                  value={f.value}
                  onChange={e => handleDynamicFieldChange(index, e, 'fees')}
                  className="w-1/2 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeDynamicField(index, 'fees')}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addDynamicField('fees')}
              className="mt-2 text-sm text-blue-500 font-semibold flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" /> Add Fee
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 flex justify-center items-center bg-blue-500 text-white font-semibold px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 disabled:bg-blue-300"
          >
            {isLoading ? 'Saving...' : 'Save Card'}
          </button>
        </form>
      </div>
    </div>
  );
}