"use client";

import { useCallback, useEffect, useState } from "react";

const PRODUCTS_URL = "/api/products";

const CACHE_TTL = 60 * 1000;

let cache = { data: null, at: 0 };
let inflight = null;

export function extractProductList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.products)) return payload.products;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.products)) return payload.data.products;
    return [];
}

async function loadProducts() {
    if (cache.data && Date.now() - cache.at < CACHE_TTL) {
        return cache.data;
    }

    if (inflight) return inflight;

    inflight = (async () => {
        try {
            const response = await fetch(PRODUCTS_URL, { cache: "no-store" });

            if (!response.ok) {
                throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
            }

            const list = extractProductList(await response.json());

            cache = { data: list, at: Date.now() };

            return list;
        } finally {
            inflight = null;
        }
    })();

    return inflight;
}

export function useProducts() {
    const [products, setProducts] = useState(() => cache.data ?? []);
    const [loading, setLoading] = useState(() => cache.data === null);
    const [error, setError] = useState("");
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let active = true;

        loadProducts().then(
            (list) => {
                if (active) {
                    setProducts(list);
                    setError("");
                    setLoading(false);
                }
            },
            (err) => {
                if (active) {
                    setProducts([]);
                    setError(
                        err.message || "পণ্য লোড করতে সমস্যা হয়েছে।"
                    );
                    setLoading(false);
                }
            }
        );

        return () => {
            active = false;
        };
    }, [version]);

    const reload = useCallback(() => {
        cache = { data: null, at: 0 };
        setError("");
        setLoading(true);
        setVersion((value) => value + 1);
    }, []);

    return { products, loading, error, reload };
}

export async function fetchProductBySlug(slug, signal) {
    const response = await fetch(
        `${PRODUCTS_URL}?slug=${encodeURIComponent(slug)}`,
        { cache: "no-store", signal }
    );

    if (!response.ok) {
        throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
    }

    const list = extractProductList(await response.json());
    const target = String(slug).toLowerCase();

    return (
        list.find(
            (item) => String(item?.slug).toLowerCase() === target
        ) ?? null
    );
}

export function useProduct(slug) {
    const [state, setState] = useState(() => ({
        slug,
        product: null,
        loading: Boolean(slug),
        error: slug ? "" : "পণ্যটি খুঁজে পাওয়া যায়নি।",
    }));

    useEffect(() => {
        if (!slug) return;

        const controller = new AbortController();
        let active = true;

        async function run() {
            try {
                const found = await fetchProductBySlug(
                    slug,
                    controller.signal
                );

                if (!found) {
                    throw new Error(
                        "এই পণ্যটি খুঁজে পাওয়া যায়নি।"
                    );
                }

                if (active) {
                    setState({
                        slug,
                        product: found,
                        loading: false,
                        error: "",
                    });
                }
            } catch (err) {
                if (active && err.name !== "AbortError") {
                    setState({
                        slug,
                        product: null,
                        loading: false,
                        error: err.message || "আবার চেষ্টা করো।",
                    });
                }
            }
        }

        run();

        return () => {
            active = false;
            controller.abort();
        };
    }, [slug]);

    const isStale = state.slug !== slug;

    return {
        product: isStale ? null : state.product,
        loading: isStale ? Boolean(slug) : state.loading,
        error: isStale
            ? slug
                ? ""
                : "পণ্যটি খুঁজে পাওয়া যায়নি।"
            : state.error,
    };
}
