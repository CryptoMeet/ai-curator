'use client';

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import ItemForm from "./ItemForm";
import { TagFilter } from "./TagFilter";
import { ApiResponse } from "@/lib/api-utils";

interface Tag {
  id: string;
  name: string;
}

interface Metadata {
  author?: string;
  publishedAt?: string;
  siteName?: string;
  image?: string;
}

interface Item {
  id: string;
  title: string;
  description: string | null;
  url: string;
  type: 'ARTICLE' | 'VIDEO' | 'IMAGE' | 'OTHER';
  metadata: Metadata | null;
  collectionId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
}

interface Collection {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

type CollectionWithItems = Collection & {
  items: Item[];
};

interface ItemFormData {
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'image' | 'other';
  tags: string[];
}

export default function CollectionDetails({
  collection: initialCollection,
}: {
  collection: CollectionWithItems;
}) {
  const [collection, setCollection] = useState<CollectionWithItems>(initialCollection);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const uniqueTags = useMemo(() => {
    const tags = new Map();
    collection.items.forEach(item => {
      item.tags.forEach(tag => {
        tags.set(tag.id, tag);
      });
    });
    return Array.from(tags.values());
  }, [collection.items]);

  const filteredItems = useMemo(() => {
    if (selectedTags.length === 0) return collection.items;
    return collection.items.filter(item =>
      selectedTags.every(tag => item.tags.some(t => t.name === tag))
    );
  }, [collection.items, selectedTags]);

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleAddItem = async (data: ItemFormData) => {
    try {
      const response = await fetch(`/api/collections/${collection.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await response.json() as ApiResponse<Item>;
      
      if (!response.ok) {
        throw new Error(json.error || 'Failed to add item');
      }

      if (json.data) {
        setCollection((prev: CollectionWithItems) => ({
          ...prev,
          items: [json.data as Item, ...prev.items]
        })); 
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    }
  };

  const getItemTypeIcon = (type: Item['type']) => {
    switch (type) {
      case 'ARTICLE':
        return '📄';
      case 'VIDEO':
        return '🎥';
      case 'IMAGE':
        return '🖼️';
      default:
        return '📎';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderItemPreview = (item: Item) => {
    const metadata = item.metadata || {};
    
    return (
      <motion.div
        key={item.id}
        variants={itemVariants}
        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      >
        {metadata.image && (
          <div className="relative h-40 w-full">
            <img
              src={metadata.image}
              alt={item.title}
              className="object-cover w-full h-full"
            />
            {item.type === 'VIDEO' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold flex-1">{item.title}</h3>
            <span className="text-lg flex-shrink-0" title={item.type.toLowerCase()}>
              {getItemTypeIcon(item.type)}
            </span>
          </div>
          
          {item.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
              {item.description}
            </p>
          )}

          {(metadata.author || metadata.publishedAt || metadata.siteName) && (
            <div className="mt-2 text-sm text-gray-500 space-y-1">
              {metadata.author && (
                <p>By {metadata.author}</p>
              )}
              {metadata.publishedAt && (
                <p>Published {formatDate(metadata.publishedAt)}</p>
              )}
              {metadata.siteName && (
                <p>From {metadata.siteName}</p>
              )}
            </div>
          )}
          
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {item.tags.map(tag => (
                <span
                  key={tag.id}
                  className={`px-2 py-0.5 rounded-full text-sm ${
                    selectedTags.includes(tag.name)
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-blue-500 hover:text-blue-600 inline-flex items-center"
          >
            View {item.type.charAt(0) + item.type.slice(1).toLowerCase()} →
          </a>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
        >
          ← Back to Collections
        </Link>
        <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
        {collection.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {collection.description}
          </p>
        )}
      </motion.div>

      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
        <ItemForm onSubmit={handleAddItem} />
        {error && (
          <motion.div 
            className="text-red-500 mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {uniqueTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-2">Filter by Tags</h3>
          <TagFilter
            tags={uniqueTags}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
          />
        </motion.div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
        key={selectedTags.join(',')} // Re-run animation when filters change
      >
        {filteredItems.map(renderItemPreview)}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div 
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {collection.items.length === 0
            ? "No items in this collection yet."
            : "No items match the selected filters."}
        </motion.div>
      )}
    </div>
  );
}