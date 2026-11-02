import {
    toBanglaNumber,
    getProductSlug,
} from "./priceUtils";

export { toBanglaNumber, getProductSlug };

export const CATEGORY_ICONS = {
    chal: "🍚",
    dal: "🌾",
    tel: "🧴",
    sobji: "🥬",
    mach: "🐟",
    mangsho: "🍗",
    "dim-dui": "🥚",
    mosla: "🌶️",
};

export const PRODUCT_ICONS = {
    peyaj: "🧅",
    begun: "🍆",
    ada: "🌿",
    roshun: "🧄",
    alu: "🥔",
    "kaccha-moric": "🌶️",

    "rui-mach": "🐟",
    "ilish-mach": "🐠",
    "katla-mach": "🐟",
    "chingri-mach": "🦐",

    "goru-r-mangsho": "🥩",
    "khasir-mangsho": "🍖",
    "hanser-mangsho": "🦆",
    "murgi-r-mangsho": "🍗",

    dim: "🥚",
    "dui-dudh": "🥛",
    doi: "🥣",
    mokhhan: "🧈",

    "sorno-machi-chal": "🍚",
    "miniket-chal": "🍚",
    "nazir-chal": "🍚",
    "batam-size-chal": "🍚",

    "mosur-dal": "🌾",
    "mug-dal": "🌾",
    "chola-dal": "🌾",
    "aman-dal-khosasila": "🌾",

    "sorishar-tel": "🧴",
    "pam-tel": "🧴",
    "ghani-banga-sorishar-tel": "🧴",

    "morich-gunda": "🌶️",
    "dhanepata-gunda": "🌿",
};

const NAME_ICONS = [
    ["আদা", "🫚"],
    ["পেঁয়াজ", "🧅"],
    ["পিয়াজ", "🧅"],
    ["আলু", "🥔"],
    ["রসুন", "🧄"],
    ["টমেটো", "🍅"],
    ["বেগুন", "🍆"],
    ["মরিচ", "🌶️"],
    ["লেবু", "🍋"],
    ["কলা", "🍌"],
    ["মাছ", "🐟"],
    ["ডিম", "🥚"],
    ["মুরগি", "🍗"],
    ["গরুর মাংস", "🥩"],
];

export function getProductName(product) {
    return (
        product?.nameBn ||
        product?.name ||
        product?.title ||
        "পণ্য"
    );
}

export function getProductIcon(product) {
    const slug = String(product?.slug || "")
        .trim()
        .toLowerCase();

    if (PRODUCT_ICONS[slug]) {
        return PRODUCT_ICONS[slug];
    }

    const image = product?.image;

    if (
        typeof image === "string" &&
        image.trim() &&
        !/^https?:\/\//i.test(image)
    ) {
        return image.trim();
    }

    const name = getProductName(product);

    const matchedName = NAME_ICONS.find(([keyword]) =>
        name.includes(keyword)
    );

    if (matchedName) {
        return matchedName[1];
    }

    const category = String(product?.category || "")
        .trim()
        .toLowerCase();

    return (
        CATEGORY_ICONS[category] ||
        product?.categoryIcon ||
        "🛒"
    );
}

export function getProductPrice(product) {
    const value =
        product?.today ??
        product?.price ??
        product?.todayPrice ??
        product?.today_price ??
        product?.currentPrice ??
        product?.current_price;

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        !Number.isFinite(Number(value))
    ) {
        return null;
    }

    return Number(value);
}

const UNIT_LABELS = {
    kg: "কেজি",
    litre: "লিটার",
    liter: "লিটার",
    l: "লিটার",
    gram: "গ্রাম",
    g: "গ্রাম",
    dozen: "ডজন",
    piece: "টি",
    pcs: "টি",
};

export function getUnit(unit) {
    const normalized = String(unit || "")
        .trim()
        .toLowerCase();

    return UNIT_LABELS[normalized] || unit || "একক";
}

export function formatPrice(value) {
    if (value === null || value === undefined) {
        return "দাম পাওয়া যায়নি";
    }

    const formatted = Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    return `${toBanglaNumber(formatted)} টাকা`;
}
