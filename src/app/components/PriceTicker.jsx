
"use client";

import { useProducts } from "@/lib/useProducts";
import {
    toBanglaNumber,
    getProductName,
    getProductIcon,
    getProductPrice,
    getUnit,
} from "./productMeta";

const TICKER_LIMIT = 12;

function buildTickerItems(products) {
    return products.slice(0, TICKER_LIMIT).map((product) => {
        const price = getProductPrice(product);
        const pct = Number(product?.change?.pct) || 0;
        const isUp = product?.change?.dir !== "down";

        return {
            key: product?.slug ?? product?.id,
            name: getProductName(product),
            icon: getProductIcon(product),
            price:
                price === null
                    ? "দাম পাওয়া যায়নি"
                    : `${toBanglaNumber(price)} টাকা/${getUnit(product?.unit)}`,
            change: `${toBanglaNumber(Math.abs(pct).toFixed(1))}%`,
            direction: isUp ? "up" : "down",
        };
    });
}

export default function PriceTicker() {
    const { products, loading, error } = useProducts();

    const items = buildTickerItems(products);

    if (error) {
        return null;
    }

    return (
        <div
            className="price-ticker-wrapper"
            aria-label="বাজারদরের আপডেট"
            aria-busy={loading ? "true" : undefined}
        >
            <div className="price-ticker-track">
                {[0, 1].map((group) => (
                    <div
                        className="price-ticker-group"
                        key={group}
                        aria-hidden={group === 1 ? "true" : undefined}
                    >
                        {loading || items.length === 0
                            ? Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    className="price-item"
                                    key={`skeleton-${index}`}
                                >
                                    <span className="price-icon">🛒</span>

                                    <span className="price-name price-skeleton">
                                        &nbsp;
                                    </span>

                                    <span className="price-value price-skeleton">
                                        &nbsp;
                                    </span>
                                </div>
                            ))
                            : items.map((item) => (
                                <div
                                    className="price-item"
                                    key={`${group}-${item.key}`}
                                >
                                    <span className="price-icon">
                                        {item.icon}
                                    </span>

                                    <span className="price-name">
                                        {item.name}
                                    </span>

                                    <span className="price-value">
                                        {item.price}
                                    </span>

                                    <span
                                        className={
                                            item.direction === "up"
                                                ? "price-up"
                                                : "price-down"
                                        }
                                    >
                                        {item.direction === "up"
                                            ? "▲"
                                            : "▼"}{" "}
                                        {item.change}
                                    </span>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
