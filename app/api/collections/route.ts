import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { handleApiError, type ApiResponse } from "@/lib/api-utils";

const createCollectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function GET(): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
    });

    const serializedCollections = collections.map(collection => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
    }));

    return NextResponse.json({ data: serializedCollections });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const json = await request.json();
    const validatedData = createCollectionSchema.parse(json);
    
    const collection = await prisma.collection.create({
      data: validatedData,
    });

    const serializedCollection = {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
    };
    
    return NextResponse.json({ data: serializedCollection }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}