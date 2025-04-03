import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoadingSpinner />
    </div>
  );
}