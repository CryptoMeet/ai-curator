'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CollectionForm from './CollectionForm';
import { LoadingSpinner } from './LoadingSpinner';
import { ApiResponse } from '@/lib/api-utils';
import { Collection } from '@/lib/types';

async function createCollection(data: { name: string; description?: string }) {
  const response = await fetch('/api/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await response.json() as ApiResponse<Collection>;
  if (!response.ok) throw new Error(json.error || 'Failed to create collection');
  return json.data;
}

async function fetchCollections(): Promise<Collection[]> {
  const response = await fetch('/api/collections');
  const json = await response.json() as ApiResponse<Collection[]>;
  if (!response.ok) throw new Error(json.error || 'Failed to fetch collections');
  return json.data || [];
}

export default function Collections({ initialCollections = [] }: { initialCollections: Collection[] }) {
  const queryClient = useQueryClient();
  
  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
    initialData: initialCollections,
  });

  const createMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });

  const handleCreateCollection = async (data: { name: string; description: string }) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error instanceof Error ? error.message : 'Error loading collections. Please try again later.'}
      </div>
    );
  }

  return (
    <div>
      <CollectionForm onSubmit={handleCreateCollection} />
      {createMutation.isError && (
        <div className="text-red-500 mb-4 text-center">
          {createMutation.error instanceof Error 
            ? createMutation.error.message 
            : 'Failed to create collection. Please try again.'}
        </div>
      )}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {collections.map((collection: Collection) => (
          <motion.div key={collection.id} variants={item}>
            <Link
              href={`/collections/${collection.id}`}
              className="block"
            >
              <div className="p-4 border rounded-lg shadow hover:shadow-md transition-all hover:border-blue-500">
                <h2 className="text-xl font-bold">{collection.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{collection.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
        {collections.length === 0 && (
          <motion.div 
            className="col-span-full text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No collections yet. Create your first one above!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}