import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, type ApiResponse } from "@/lib/api-utils";

const urlSchema = z.object({
  url: z.string().url(),
});

interface Metadata {
  title: string;
  description: string;
  image?: string;
  type?: 'article' | 'video' | 'image' | 'other';
  author?: string;
  publishedAt?: string;
  siteName?: string;
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const json = await request.json();
    const { url } = urlSchema.parse(json);

    const response = await fetch(url);
    const html = await response.text();

    // Basic metadata extraction
    const metadata: Metadata = {
      title: extractMetaContent(html, 'title') || extractOgContent(html, 'title') || '',
      description: extractMetaContent(html, 'description') || extractOgContent(html, 'description') || '',
      image: extractOgContent(html, 'image'),
      author: extractMetaContent(html, 'author') || extractOgContent(html, 'article:author'),
      publishedAt: extractOgContent(html, 'article:published_time'),
      siteName: extractOgContent(html, 'site_name'),
    };

    // Determine content type
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      metadata.type = 'image';
    } else if (url.match(/youtube\.com|vimeo\.com|dailymotion\.com/i)) {
      metadata.type = 'video';
    } else if (extractOgContent(html, 'type') === 'article' || isLikelyArticle(html)) {
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
  const match = html.match(new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')) ||
                html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i'));
  return match?.[1];
}

function extractOgContent(html: string, property: string): string | undefined {
  const match = html.match(new RegExp(`<meta[^>]*property=["']og:${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')) ||
                html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${property}["'][^>]*>`, 'i'));
  return match?.[1];
}

function isLikelyArticle(html: string): boolean {
  // Check for common article indicators
  const hasArticleTag = /<article[^>]*>/i.test(html);
  const hasLongParagraphs = (html.match(/<p[^>]*>[^<]{200,}/g) || []).length > 0;
  const hasMultipleParagraphs = (html.match(/<p[^>]*>/g) || []).length > 3;
  
  return hasArticleTag || (hasLongParagraphs && hasMultipleParagraphs);
}