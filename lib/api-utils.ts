import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
}

export function handleApiError(error: unknown): NextResponse<ApiResponse<never>> {
  console.error("API Error:", error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validation error", details: error.errors },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}

export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
}