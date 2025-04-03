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
    include: { items: true },
  });

  if (!collection) {
    notFound();
  }

  return <CollectionDetails collection={collection} />;
}