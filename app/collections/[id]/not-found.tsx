import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        The collection you're looking for doesn't exist or has been removed.
      </p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Return to Collections
      </Link>
    </div>
  );
}