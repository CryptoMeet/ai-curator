"use client";

import { useState } from 'react';

interface CollectionFormData {
  name: string;
  description: string;
}

interface Props {
  onSubmit: (data: CollectionFormData) => Promise<void>;
}

export default function CollectionForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Collection Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Create Collection
      </button>
    </form>
  );
}