import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardName: string;
}

// TODO: This is a placeholder component. 
// Move the ConfirmDeleteModal logic from the original page.tsx here
export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, cardName }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to remove the <span className="font-semibold">{cardName}</span> from your wallet?
        </p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}