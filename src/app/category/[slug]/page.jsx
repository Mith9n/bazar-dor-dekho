
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    toBanglaNumber,
    getProductSlug,
    getProductName,
    getProductIcon,
    getProductPrice,
} from "../../components/productMeta";

const API_BASE = "/api/products";

const SLUG_ALIASES = {
    dim: "dim-dui",
};

const FALLBACK_CATEGORIES = {
    chal: { nameBn: "চাল", icon: "🍚" },
    dal: { nameBn: "ডাল", icon: "🌾" },
    tel: { nameBn: "তেল", icon: "🧴" },
    sobji: { nameBn: "সবজি", icon: "🥬" },
    mach: { nameBn: "মাছ", icon: "🐟" },
    mangsho: { nameBn: "মাংস", icon: "🍗" },
    "dim-dui": { nameBn: "ডিম-দুধ", icon: "🥚" },
    dim: { nameBn: "ডিম-দুধ", icon: "🥚" },
    mosla: { nameBn: "মসলা", icon: "🌶️" },
};

function CategoryContent() {
    const params = useParams();
    const slug = params?.slug;

    const resolvedSlug = SLUG_ALIASES[slug] || slug;

    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState("default");
    const [error, setError] = useState(false);

    useEffect(() => {
        let active = true;

        async function loadCategories() {
            try {
                const response = await fetch("/api/categories", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Categories fetch failed");
                }

                const data = await response.json();

                if (active && Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (err) {
                console.error("Category info error:", err);
            }
        }

        loadCategories();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!resolvedSlug) return;

        let active = true;

        async function loadProducts() {
            setLoading(true);
            setError(false);

            try {
                const response = await fetch(
                    `${API_BASE}?category=${encodeURIComponent(resolvedSlug)}`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error("Products fetch failed");
                }

                const data = await response.json();

                const list = Array.isArray(data)
                    ? data
                    : data.products || data.data || [];

                if (active) {
                    setProducts(list);
                }
            } catch (err) {
                console.error("Category error:", err);

                if (active) {
                    setError(true);
                    setProducts([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            active = false;
        };
    }, [resolvedSlug]);

    const apiCategory = Array.isArray(categories)
        ? categories.find((item) => item.slug === resolvedSlug)
        : null;

    const category = apiCategory
        ? {
            name: apiCategory.nameBn || apiCategory.name,
            icon: apiCategory.icon || "🛒",
        }
        : FALLBACK_CATEGORIES[resolvedSlug] ||
        FALLBACK_CATEGORIES[slug] ||
        null;

    const sortedProducts = [...products].sort((a, b) => {
        const priceA = Number(a.today) || 0;
        const priceB = Number(b.today) || 0;

        if (sort === "low") return priceA - priceB;
        if (sort === "high") return priceB - priceA;

        return 0;
    });

    if (loading) {
        return (
            <main className="page-container min-h-screen bg-[#F0F5F0] py-10">
                <div className="mx-auto max-w-6xl animate-pulse">
                    <div className="mb-6 h-8 w-56 rounded bg-gray-200" />

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl bg-white p-5"
                            >
                                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                                <div className="mt-4 h-5 w-2/3 rounded bg-gray-200" />
                                <div className="mt-3 h-7 w-1/3 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!category) {
        return (
            <main className="page-container flex min-h-[60vh] items-center justify-center bg-[#F0F5F0]">
                <div className="text-center">
                    <p className="text-5xl">😕</p>
                    <h1 className="mt-4 text-2xl font-bold text-gray-800">
                        ক্যাটাগরি পাওয়া যায়নি
                    </h1>
                    <Link
                        href="/"
                        className="mt-5 inline-block rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        ← হোমে ফিরে যাও
                    </Link>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page-container flex min-h-[60vh] items-center justify-center bg-[#F0F5F0]">
                <div className="text-center">
                    <p className="text-5xl">⚠️</p>
                    <h1 className="mt-4 text-2xl font-bold text-gray-800">
                        পণ্য লোড করা যায়নি
                    </h1>
                    <p className="mt-2 text-gray-500">
                        ইন্টারনেট বা API ঠিক আছে কি না পরীক্ষা করে আবার চেষ্টা করো।
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        আবার চেষ্টা করো
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container min-h-screen bg-[#F0F5F0] py-8">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/"
                    className="text-sm font-semibold text-green-700 hover:text-green-800"
                >
                    ← হোমে ফিরে যাও
                </Link>

                <section className="mt-5 flex flex-col justify-between gap-4 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-4xl">
                            {category.icon}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                {category.name}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                মোট {toBanglaNumber(products.length)}টি পণ্য
                            </p>
                        </div>
                    </div>

                    <label className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-600">
                        দাম অনুযায়ী সাজাও

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-green-500"
                        >
                            <option value="default">ডিফল্ট</option>
                            <option value="low">কম দাম থেকে বেশি</option>
                            <option value="high">বেশি দাম থেকে কম</option>
                        </select>
                    </label>
                </section>

                {products.length === 0 ? (
                    <div className="mt-8 rounded-2xl bg-white px-5 py-12 text-center shadow-sm">
                        <p className="text-5xl">{category.icon}</p>
                        <h2 className="mt-4 text-xl font-bold text-gray-800">
                            এই ক্যাটাগরিতে পণ্য পাওয়া যায়নি
                        </h2>
                        <p className="mt-2 text-gray-500">
                            পরে আবার চেষ্টা করো।
                        </p>
                    </div>
                ) : (
                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedProducts.map((product, index) => {
                            const direction = product.change?.dir;
                            const productSlug = getProductSlug(product);
                            const price = getProductPrice(product);
                            const unitName =
                                product.unit === "kg"
                                    ? "কেজি"
                                    : ["liter", "litre"].includes(product.unit)
                                        ? "লিটার"
                                        : product.unit === "dozen"
                                            ? "ডজন"
                                            : product.unit === "piece"
                                                ? "টি"
                                                : product.unit || "একক";

                            return (
                                <Link
                                    key={product.id || product.slug || index}
                                    href={productSlug ? `/product/${productSlug}` : "#"}
                                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
                                            {getProductIcon(product)}
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${direction === "up"
                                                ? "bg-red-50 text-red-600"
                                                : direction === "down"
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {direction === "up"
                                                ? `▲ ${toBanglaNumber(product.change?.pct)}%`
                                                : direction === "down"
                                                    ? `▼ ${toBanglaNumber(product.change?.pct)}%`
                                                    : "—"}
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-green-700">
                                        {getProductName(product)}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        প্রতি {unitName}
                                    </p>

                                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                আজকের দাম
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                                {price === null
                                                    ? "দাম নেই"
                                                    : `${toBanglaNumber(price)} টাকা`}
                                            </p>
                                        </div>

                                        <span className="text-sm font-semibold text-green-700">
                                            বিস্তারিত →
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

function CategoryLoading() {
    return (
        <main className="page-container min-h-screen bg-[#F0F5F0] py-10">
            <div className="mx-auto max-w-6xl animate-pulse">
                <div className="h-8 w-56 rounded bg-gray-200" />
                <div className="mt-6 h-48 rounded-2xl bg-white" />
            </div>
        </main>
    );
}

export default function CategoryPage() {
    return (
        <Suspense fallback={<CategoryLoading />}>
            <CategoryContent />
        </Suspense>
    );
}
