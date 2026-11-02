
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

const FALLING_LIMIT = 6;

export default function PriceFallers() {
    const { products, loading, error, reload } = useProducts();

    const fallingProducts = products
        .filter((product) => {
            const pct = Number(product?.change?.pct);

            return (
                product?.change?.dir === "down" &&
                Number.isFinite(pct) &&
                pct !== 0
            );
        })
        .sort(
            (a, b) =>
                Math.abs(Number(b.change.pct)) -
                Math.abs(Number(a.change.pct))
        )
        .slice(0, FALLING_LIMIT);

    return (
        <section className="bg-[#F0F5F0] py-10">
            <div className="page-container mx-auto max-w-7xl">

                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-2xl">
                        📉
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            আজ দাম কমেছে ▼
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে
                        </p>
                    </div>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5"
                                >
                                    <div className="h-14 w-14 shrink-0 rounded-xl bg-gray-200" />

                                    <div className="flex-1">
                                        <div className="mb-3 h-4 w-3/4 rounded bg-gray-200" />
                                        <div className="mb-3 h-3 w-1/2 rounded bg-gray-200" />
                                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center text-red-600">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={reload}
                            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        >
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {!loading && !error && fallingProducts.length === 0 && (
                    <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-gray-500">
                        কোনো পণ্যের দাম কমেনি।
                    </div>
                )}

                {!loading && !error && fallingProducts.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {fallingProducts.map((product, index) => {
                            const slug = getProductSlug(product);
                            const name = getProductName(product);
                            const icon = getProductIcon(product);
                            const price = getProductPrice(product);

                            const percentage = Math.abs(
                                Number(product?.change?.pct) || 0
                            );

                            const cardContent = (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-3xl">
                                            <span
                                                role="img"
                                                aria-label={name}
                                            >
                                                {icon}
                                            </span>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-semibold text-gray-900 group-hover:text-green-700">
                                                {name}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                প্রতি{" "}
                                                {getUnit(product?.unit)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-500">
                                                আজকের দাম
                                            </p>

                                            <p className="mt-1 break-words text-lg font-bold text-gray-900">
                                                {formatPrice(price)}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                                            ▼{" "}
                                            {toBanglaNumber(
                                                percentage.toFixed(1)
                                            )}
                                            %
                                        </span>
                                    </div>
                                </>
                            );

                            return slug ? (
                                <Link
                                    key={product?.id ?? slug}
                                    href={`/product/${slug}`}
                                    className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
                                >
                                    {cardContent}
                                </Link>
                            ) : (
                                <div
                                    key={product?.id ?? index}
                                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
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
