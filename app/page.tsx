import Collections from './components/Collections';
import { prisma } from '@/lib/prisma';
import ErrorBoundary from './components/ErrorBoundary';

export default async function Home() {
  const collections = await prisma.collection.findMany();
  
  // Create plain objects with only the needed properties
  const serializedCollections = collections.map(collection => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  }));

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">AI Curator</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize and manage your AI-curated content</p>
        </header>
        
        <main>
          <Collections initialCollections={serializedCollections} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
