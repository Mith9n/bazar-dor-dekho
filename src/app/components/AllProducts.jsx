
"use client";

import Link from "next/link";
import { useProducts } from "@/lib/useProducts";
import {
    toBanglaNumber,
    getProductSlug,
    getProductName,
    getProductIcon,
    getProductPrice,
    getUnit,
} from "./productMeta";

const DISPLAY_LIMIT = 32;

export default function AllProducts() {
    const { products, loading, error, reload } = useProducts();

    const total = products.length;
    const visibleProducts = products.slice(0, DISPLAY_LIMIT);

    return (
        <section
            id="সব-পণ্য"
            className="scroll-mt-24 bg-[#F0F5F0] py-12"
        >
            <div className="page-container mx-auto max-w-7xl">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        
                        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            আজকের পণ্যের দাম
                        </h2>

                        <p className="mt-2 text-sm text-gray-600">
                            নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ দাম দেখুন।
                        </p>
                    </div>

                    {!loading && !error && total > 0 && (
                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                            মোট {toBanglaNumber(total)} টি পণ্য
                        </span>
                    )}
                </div>

                {loading && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4"
                            >
                                <div className="mb-4 h-20 w-20 rounded-xl bg-gray-200" />
                                <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                                <div className="h-5 w-1/2 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={reload}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {!loading && !error && visibleProducts.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {visibleProducts.map((product, index) => {
                            const productName = getProductName(product);
                            const icon = getProductIcon(product);
                            const price = getProductPrice(product);
                            const slug = getProductSlug(product);
                            const change = product?.change;

                            return (
                                <Link
                                    key={product?.id ?? product?.slug ?? index}
                                    href={slug ? `/product/${slug}` : "#সব-পণ্য"}
                                    className="group rounded-2xl border border-gray-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
                                >
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-green-50">
                                        <span
                                            className="text-5xl leading-none"
                                            role="img"
                                            aria-label={productName}
                                        >
                                            {icon}
                                        </span>
                                    </div>

                                    <h3 className="min-h-12 text-base font-semibold text-gray-900 group-hover:text-green-700">
                                        {productName}
                                    </h3>

                                    <p className="mt-2 text-lg font-bold text-green-700">
                                        {price !== null
                                            ? `${toBanglaNumber(price)} টাকা`
                                            : "দাম পাওয়া যায়নি"}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        প্রতি {getUnit(product?.unit)}
                                    </p>

                                    {change && (
                                        <p
                                            className={`mt-2 text-xs font-medium ${change.dir === "up"
                                                ? "text-red-600"
                                                : change.dir === "down"
                                                    ? "text-green-600"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {change.dir === "up"
                                                ? "▲"
                                                : change.dir === "down"
                                                    ? "▼"
                                                    : "—"}{" "}
                                            {toBanglaNumber(
                                                Math.abs(
                                                    Number(change.pct) || 0
                                                )
                                            )}
                                            %
                                        </p>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {!loading && !error && total === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
                        কোনো পণ্য পাওয়া যায়নি।
                    </div>
                )}
            </div>
        </section>
    );
}
