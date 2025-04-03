import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, type ApiResponse } from "@/lib/api-utils";

const urlSchema = z.object({
  url: z.string().url(),
});

interface Metadata {
  title: string;
  description: string;
  image: string | null;
  type: 'article' | 'video' | 'image' | 'other';
  author: string | null;
  publishedAt: string | null;
  siteName: string | null;
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const json = await request.json();
    const { url } = urlSchema.parse(json);

    const response = await fetch(url);
    const html = await response.text();

    // Basic metadata extraction with null fallbacks
    const metadata: Metadata = {
      title: extractMetaContent(html, 'title') || extractOgContent(html, 'title') || '',
      description: extractMetaContent(html, 'description') || extractOgContent(html, 'description') || '',
      image: extractOgContent(html, 'image') || null,
      type: 'article',
      author: extractMetaContent(html, 'author') || extractOgContent(html, 'article:author') || null,
      publishedAt: extractOgContent(html, 'article:published_time') || null,
      siteName: extractOgContent(html, 'site_name') || null,
    };

    // Determine content type
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      metadata.type = 'image';
    } else if (url.match(/youtube\.com|vimeo\.com|dailymotion\.com/i) || extractOgContent(html, 'type') === 'video') {
      metadata.type = 'video';
    } else if (isLikelyArticle(html)) {
      metadata.type = 'article';
    } else {
      metadata.type = 'other';
    }

    return NextResponse.json({ data: metadata });
  } catch (error) {
    return handleApiError(error);
  }
}

function extractMetaContent(html: string, name: string): string | undefined {
  const match = html.match(new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i'));
  return match ? match[1] : undefined;
}

function extractOgContent(html: string, property: string): string | undefined {
  const match = html.match(new RegExp(`<meta\\s+property=["']og:${property}["']\\s+content=["']([^"']+)["']`, 'i'));
  return match ? match[1] : undefined;
}

function isLikelyArticle(html: string): boolean {
  const articleIndicators = [
    /<article[^>]*>/i,
    /<meta\s+property=["']og:type["']\s+content=["']article["']/i,
    /<meta\s+name=["']author["']/i,
    /<meta\s+property=["']article:published_time["']/i
  ];
  
  return articleIndicators.some(pattern => pattern.test(html));
}