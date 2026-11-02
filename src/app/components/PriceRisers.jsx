
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
    formatPrice,
} from "./productMeta";

const RISING_LIMIT = 6;

export default function PriceRisers() {
    const { products, loading, error, reload } = useProducts();

    const risingProducts = products
        .filter(
            (product) =>
                product?.change?.dir === "up" &&
                Number.isFinite(Number(product?.change?.pct)) &&
                Number(product.change.pct) > 0
        )
        .sort(
            (a, b) =>
                Number(b.change.pct) - Number(a.change.pct)
        )
        .slice(0, RISING_LIMIT);

    return (
        <section
            id="price-risers"
            className="w-full bg-[#F0F5F0] py-8 sm:py-10"
        >
            <div className="page-container mx-auto max-w-7xl">

                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-2xl">
                        📈
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            আজ দাম বেড়েছে ▲
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="flex h-32 animate-pulse items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                            >
                                <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />

                                <div className="flex-1">
                                    <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
                        {error}

                        <button
                            type="button"
                            onClick={reload}
                            className="ml-3 font-semibold underline"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    risingProducts.length === 0 && (
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center text-gray-500">
                            আজ দাম বেড়েছে এমন কোনো পণ্য পাওয়া যায়নি।
                        </div>
                    )}

                {!loading &&
                    !error &&
                    risingProducts.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {risingProducts.map((product, index) => {
                                const name = getProductName(product);
                                const icon = getProductIcon(product);
                                const price = getProductPrice(product);
                                const slug = getProductSlug(product);
                                const percentage = Math.abs(
                                    Number(product.change.pct)
                                );

                                const cardContent = (
                                    <>
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-3xl">
                                            <span
                                                role="img"
                                                aria-label={name}
                                            >
                                                {icon}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate font-semibold text-gray-800 group-hover:text-green-700">
                                                {name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                প্রতি {getUnit(product.unit)}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-500">
                                                আজকের দাম
                                            </p>

                                            <p className="font-bold text-gray-900">
                                                {formatPrice(price)}
                                            </p>
                                        </div>

                                        <div className="shrink-0 self-center rounded-lg bg-green-50 px-2.5 py-2 text-right">
                                            <p className="text-sm font-bold text-green-700">
                                                ▲ {toBanglaNumber(
                                                    percentage.toFixed(1)
                                                )}%
                                            </p>

                                            <p className="mt-0.5 text-xs text-green-700">
                                                দাম বেড়েছে
                                            </p>
                                        </div>
                                    </>
                                );

                                return slug ? (
                                    <Link
                                        key={product.id ?? slug ?? index}
                                        href={`/product/${slug}`}
                                        className="group flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md sm:gap-4 sm:p-4"
                                    >
                                        {cardContent}
                                    </Link>
                                ) : (
                                    <div
                                        key={product.id ?? index}
                                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:gap-4 sm:p-4"
                                    >
                                        {cardContent}
                                    </div>
                                );
                            })}
                        </div>
                    )}
            </div>
        </section>
    );
}
