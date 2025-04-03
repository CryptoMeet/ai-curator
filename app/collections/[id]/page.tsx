import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CollectionDetails from "@/app/components/CollectionDetails";

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
        author: item.metadata.author || null,
        publishedAt: item.metadata.publishedAt || null,
        siteName: item.metadata.siteName || null,
        image: item.metadata.image || null
      } : null
    }))
  };

  return <CollectionDetails collection={serializedCollection} />;
}