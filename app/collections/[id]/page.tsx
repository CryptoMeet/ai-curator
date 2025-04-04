import CollectionDetails from '@/app/components/CollectionDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { CollectionWithItems, Metadata, Item } from '@/lib/types';

interface Props {
  params: {
    id: string;
  };
}

export default async function CollectionPage({ params }: Props) {
  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: { 
      items: {
        include: {
          tags: true
        }
      }
    },
  });

  if (!collection) {
    notFound();
  }

  const serializedCollection: CollectionWithItems = {
    ...collection,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    items: collection.items.map(item => ({
      ...item,
      type: item.type as Item['type'],
      metadata: item.metadata as Metadata | null,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      tags: item.tags.map(tag => ({
        ...tag,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString()
      }))
    }))
  };

  return <CollectionDetails collection={serializedCollection} />;
}