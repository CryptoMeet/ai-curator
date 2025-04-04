import { prisma } from '@/lib/prisma';
import CollectionDetails from '@/app/components/CollectionDetails';
import { Collection } from '@/lib/types';
import { serialize } from '@/lib/api-utils';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function CollectionPage({ params }: Props) {
  const collection = await prisma.collection.findUnique({
    where: {
      id: params.id,
    },
    include: {
      items: {
        include: {
          tags: true
        }
      }
    }
  });

  if (!collection) {
    notFound();
  }

  const serializedCollection: Collection = {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    items: collection.items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      description: item.description,
      collectionId: item.collectionId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      tags: item.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        itemId: tag.itemId,
        createdAt: tag.createdAt.toISOString(),
        updatedAt: tag.updatedAt.toISOString()
      }))
    }))
  };

  // Use the serialize utility instead of JSON.parse(JSON.stringify())
  return <CollectionDetails collection={serialize(serializedCollection)} />;
}