import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { OptimizationResult as OptimizationResultType } from '@/app/types';
import { CreditCardIcon } from '@/app/components/shared/Icons';

interface OptimizationResultProps {
  result: OptimizationResultType;
}

export function OptimizationResult({ result }: OptimizationResultProps) {
  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Recommendation</h3>
      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-r-lg">
        <div className="flex items-center">
          <div className="bg-green-500 p-2 rounded-full">
            <CreditCardIcon className="w-6 h-6 text-white"/>
          </div>
          <div className="ml-4">
            <p className="text-sm text-green-700 dark:text-green-300">Best Option</p>
            <p className="font-bold text-lg text-green-900 dark:text-green-100">{result.bestCard.name}</p>
          </div>
        </div>
        <div className="mt-4 text-gray-700 dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-700 dark:prose-headings:text-gray-300 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-800 dark:prose-strong:text-gray-200 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300">
          <ReactMarkdown 
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-3 last:mb-0 ml-4">{children}</ul>,
              ol: ({ children }) => <ol className="mb-3 last:mb-0 ml-4">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold text-gray-800 dark:text-gray-200">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{children}</h2>,
              h3: ({ children }) => <h3 className="text-md font-medium mb-2 text-gray-800 dark:text-gray-200">{children}</h3>,
            }}
          >
            {result.reason}
          </ReactMarkdown>
        </div>
      </div>
      
      {result.alternatives.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Other Good Options:</h4>
          <ul className="space-y-3">
            {result.alternatives.map((alt, index) => (
              <li key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="font-bold text-gray-800 dark:text-gray-100">{alt.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alt.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}