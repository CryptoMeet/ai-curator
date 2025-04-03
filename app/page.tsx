import Collections from './components/Collections';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const collections = await prisma.collection.findMany();

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">AI Curator</h1>
        <p className="text-gray-600 dark:text-gray-400">Organize and manage your AI-curated content</p>
      </header>
      
      <main>
        <Collections initialCollections={collections} />
      </main>
    </div>
  );
}
