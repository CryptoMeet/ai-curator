import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { handleApiError, type ApiResponse } from "@/lib/api-utils";

const createItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL"),
  type: z.enum(["ARTICLE", "VIDEO", "IMAGE", "OTHER"]),
  tags: z.array(z.string()),
  metadata: z.any().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const items = await prisma.item.findMany({
      where: { collectionId: params.id },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
    });

    // Ensure data is serializable
    const serializedItems = items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return NextResponse.json({ data: serializedItems });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const json = await request.json();
    const { tags: tagNames, ...itemData } = createItemSchema.parse({
      ...json,
      type: json.type.toUpperCase(),
    });

    const item = await prisma.item.create({
      data: {
        ...itemData,
        collectionId: params.id,
        tags: {
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    // Ensure data is serializable
    const serializedItem = {
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };

    return NextResponse.json({ data: serializedItem }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}