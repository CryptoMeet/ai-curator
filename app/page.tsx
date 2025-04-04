import Collections from './components/Collections';
import { prisma } from '@/lib/prisma';
import { Collection } from '@/lib/types';

export default async function Home() {
  const collections = await prisma.collection.findMany({
    orderBy: {
      updatedAt: 'desc'
    }
  });

  const serializedCollections: Collection[] = collections.map(collection => ({
    ...collection,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString()
  }));

  return (
    <main className="container mx-auto px-4">
      <Collections initialCollections={serializedCollections} />
    </main>
  );
}
