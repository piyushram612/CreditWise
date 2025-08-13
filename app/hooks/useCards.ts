import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/app/utils/supabase';
import type { UserOwnedCard, User } from '@/app/types';

export function useCards(user: User | null, refreshKey: number) {
  const [userCards, setUserCards] = useState<UserOwnedCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserCards([]);
      setIsLoading(false);
      return;
    }

    const fetchUserCards = async () => {
      setIsLoading(true);
      const supabase = getSupabaseClient();
      if (!supabase) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_owned_cards')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error("Error fetching user cards:", error);
      } else {
        setUserCards(data as UserOwnedCard[]);
      }
      setIsLoading(false);
    };

    fetchUserCards();
  }, [user, refreshKey]);

  return { userCards, isLoading };
}