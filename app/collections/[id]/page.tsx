import CollectionDetails from '@/app/components/CollectionDetails';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

interface ItemMetadata {
  author?: string | null;
  publishedAt?: string | null;
  siteName?: string | null;
  image?: string | null;
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

  // Serialize dates and ensure metadata is a plain object
  const serializedCollection = {
    ...collection,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
    items: collection.items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      metadata: item.metadata ? {
        author: (item.metadata as ItemMetadata).author || null,
        publishedAt: (item.metadata as ItemMetadata).publishedAt || null,
        siteName: (item.metadata as ItemMetadata).siteName || null,
        image: (item.metadata as ItemMetadata).image || null
      } : null,
      tags: item.tags.map(tag => ({
        id: tag.id,
        name: tag.name
      }))
    }))
  };

  return <CollectionDetails collection={serializedCollection} />;
}