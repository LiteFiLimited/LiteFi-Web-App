import React from 'react';

interface EmptyTableStateProps {
  title: string;
  message: string;
}

export function EmptyTableState({ title, message }: EmptyTableStateProps) {
  return (
    <div className="w-full py-12 text-center">
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">{message}</p>
    </div>
  );
}
