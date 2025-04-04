import Collections from './components/Collections';
import { prisma } from '@/lib/prisma';
import { Collection } from '@/lib/types';
import { serialize } from '@/lib/api-utils';

export default async function Home() {
  const collections = await prisma.collection.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const serializedCollections: Collection[] = collections.map(collection => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString()
  }));

  // Use the serialize utility instead of JSON.parse(JSON.stringify())
  return (
    <main className="container mx-auto px-4">
      <Collections initialCollections={serialize(serializedCollections)} />
    </main>
  );
}
