
import { NextResponse } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { cacheLife } from "next/cache";

const API_URL = "https://api.abcz.workers.dev/api/bazardor/categories";


async function fetchUpstreamCategories() {
    "use cache";
    cacheLife("minutes");

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(
            `Categories API failed with status ${response.status}`
        );
    }

    return response.json();
}

export async function GET() {
    try {
        const data = await fetchUpstreamCategories();

        if (!Array.isArray(data)) {
            throw new Error("Categories API returned invalid data");
        }

        return NextResponse.json(data);
    } catch (error) {
        unstable_rethrow(error);

        console.error("Categories API error:", error);

        return NextResponse.json(
            { error: "Failed to load categories" },
            { status: 500 }
        );
    }
}
