'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiResponse } from '@/lib/api-utils';

interface UrlMetadata {
  title: string;
  description: string;
  image: string | null;
  type: 'article' | 'video' | 'image' | 'other';
  author: string | null;
  publishedAt: string | null;
  siteName: string | null;
}

interface ItemFormData {
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'image' | 'other';
  tags: string[];
}

interface Props {
  onSubmit: (data: ItemFormData) => Promise<void>;
}

export default function ItemForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    url: '',
    type: 'article',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMetadata = useCallback(
    async (url: string) => {
      try {
        setIsLoadingMetadata(true);
        const response = await fetch('/api/metadata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const json = await response.json() as ApiResponse<UrlMetadata>;

        if (json.data) {
          setFormData(prev => ({
            ...prev,
            title: prev.title || json.data.title || '',
            description: prev.description || json.data.description || '',
            type: json.data.type || 'article'
          }));
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    },
    [] // No dependencies needed as we're using setFormData and setIsLoadingMetadata from useState
  );

  const debouncedFetchMetadata = useMemo(
    () => debounce(fetchMetadata, 500),
    [fetchMetadata]
  );

  useEffect(() => {
    if (formData.url && formData.url.startsWith('http')) {
      debouncedFetchMetadata(formData.url);
    }
    return () => {
      debouncedFetchMetadata.cancel();
    };
  }, [formData.url, debouncedFetchMetadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '', url: '', type: 'article', tags: [] });
      setTagInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1">
          URL
        </label>
        <div className="relative">
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
            disabled={isSubmitting}
          />
          <AnimatePresence>
            {isLoadingMetadata && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {isLoadingMetadata && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-gray-500 mt-1"
            >
              Fetching metadata...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          required
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Type
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as ItemFormData['type'] }))}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          disabled={isSubmitting}
        >
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1">
          Tags (press Enter or comma to add)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map(tag => (
            <motion.span 
              key={tag}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                disabled={isSubmitting}
              >
                ×
              </button>
            </motion.span>
          ))}
        </div>
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          placeholder="Add tags..."
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-md transition-colors ${
          isSubmitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2" />
            Adding Item...
          </>
        ) : (
          'Add Item'
        )}
      </button>
    </form>
  );
}