
import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { cacheLife } from "next/cache";

const API_URL =
    "https://api.abcz.workers.dev/api/bazardor/products";


async function fetchUpstreamProducts(category, slug) {
    "use cache";
    cacheLife("minutes");

    const url = new URL(API_URL);

    if (category) {
        url.searchParams.set("category", category);
    }

    if (slug) {
        url.searchParams.set("slug", slug);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(
            `Products API failed with status ${response.status}`
        );
    }

    return response.json();
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get("category") || undefined;
        const slug = searchParams.get("slug") || undefined;

        const data = await fetchUpstreamProducts(category, slug);

        return NextResponse.json(data);
    } catch (error) {
        unstable_rethrow(error);

        console.error("Products API error:", error);

        return NextResponse.json(
            { error: "Failed to load products" },
            { status: 500 }
        );
    }
}
