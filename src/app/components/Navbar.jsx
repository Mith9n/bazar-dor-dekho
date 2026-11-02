
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

const DEFAULT_CATEGORIES = [
    { name: "চাল", icon: "🍚", slug: "chal" },
    { name: "ডাল", icon: "🌾", slug: "dal" },
    { name: "তেল", icon: "🧴", slug: "tel" },
    { name: "সবজি", icon: "🥬", slug: "sobji" },
    { name: "মাছ", icon: "🐟", slug: "mach" },
    { name: "মাংস", icon: "🍗", slug: "mangsho" },
    { name: "ডিম-দুধ", icon: "🥚", slug: "dim-dui" },
    { name: "মসলা", icon: "🌶️", slug: "mosla" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const todayDate = new Intl.DateTimeFormat("bn-BD", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    }).format(new Date());

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const [githubProfile, setGithubProfile] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const response = await fetch("/api/categories", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Categories fetch failed");
                }

                const data = await response.json();

                if (
                    !Array.isArray(data) ||
                    data.some(
                        (category) =>
                            typeof category.slug !== "string" ||
                            typeof category.nameBn !== "string"
                    )
                ) {
                    throw new Error("Categories API returned invalid data");
                }

                if (!cancelled) {
                    setCategories(
                        data.map((category) => ({
                            name: category.nameBn,
                            icon:
                                category.slug === "tel"
                                    ? "🧴"
                                    : category.slug === "dal"
                                        ? "🌾"
                                        : category.icon || "🛒",
                            slug: category.slug,
                        }))
                    );
                }
            } catch (error) {
                console.error("Navbar categories error:", error);

                if (!cancelled) {
                    toast.error(
                        "ক্যাটাগরি লোড করা যায়নি। আগের তালিকা দেখানো হচ্ছে।"
                    );
                }
            }
        }

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const userId = session?.user?.id;

        if (!userId) return;

        let cancelled = false;

        async function loadGitHubProfile() {
            try {
                const response = await fetch(
                    "/api/profile/github-avatar",
                    { cache: "no-store" }
                );

                if (!response.ok) return;

                const data = await response.json();

                if (!cancelled) {
                    setGithubProfile({
                        userId,
                        image: data.image || null,
                        login: data.login || "",
                    });
                }
            } catch (error) {
                console.error(
                    "Navbar GitHub avatar error:",
                    error
                );
            }
        }

        loadGitHubProfile();

        return () => {
            cancelled = true;
        };
    }, [session?.user?.id]);

    const currentGitHubProfile =
        githubProfile?.userId === session?.user?.id ? githubProfile : null;

    const profileImage =
        currentGitHubProfile?.image || session?.user?.image || null;
    const githubLogin = currentGitHubProfile?.login || "";

    async function handleSignOut() {
        try {
            const { error } = await signOut();

            if (error) {
                toast.error(error.message || "সাইন আউট করা যায়নি।");
                return;
            }

            setIsDropdownOpen(false);
            toast.success("সাইন আউট সফল হয়েছে।");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign out failed:", error);
            toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        }
    }

    return (
        <header className="relative z-50 w-full bg-white">
            <div className="border-b border-gray-200 bg-white">
                <div className="page-container mx-auto max-w-7xl">
                    <div className="flex min-h-[82px] items-center justify-between gap-3">
                        <Link
                            href="/"
                            className="flex min-w-0 items-center gap-3"
                        >
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden sm:h-16 sm:w-16">
                                <Image
                                    src="/nav-logo.png"
                                    alt="বাজার দর"
                                    fill
                                    priority
                                    sizes="64px"
                                    className="scale-[1.35] object-contain"
                                />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg font-bold text-gray-800 sm:text-xl">
                                    বাজার দর
                                </h1>
                                <p className="text-[10px] text-gray-500 sm:text-xs">
                                    {todayDate}
                                </p>
                            </div>
                        </Link>

                        {isPending ? (
                            <div className="text-sm text-gray-500">
                                লোড হচ্ছে...
                            </div>
                        ) : session?.user ? (
                            <div className="relative shrink-0">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsDropdownOpen((prev) => !prev)
                                    }
                                    aria-expanded={isDropdownOpen}
                                    aria-label="User menu"
                                    className="flex items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-green-50 sm:gap-3 sm:px-3"
                                >
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt={session.user.name || "User"}
                                            width={36}
                                            height={36}
                                            referrerPolicy="no-referrer"
                                            unoptimized
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22"
                                                height="22"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M5 21a7 7 0 0 1 14 0" />
                                            </svg>
                                        </div>
                                    )}

                                    <span className="hidden max-w-32 truncate text-sm font-semibold text-gray-700 sm:block">
                                        {session.user.name ||
                                            session.user.email}
                                    </span>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                                            }`}
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                                        <div className="border-b border-gray-100 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-gray-800">
                                                {session.user.name || "User"}
                                            </p>

                                            <p className="truncate text-xs text-gray-500">
                                                {session.user.email}
                                            </p>

                                            {githubLogin && (
                                                <p className="mt-1 truncate text-xs text-gray-500">
                                                    GitHub: @{githubLogin}
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            href="/profile"
                                            onClick={() =>
                                                setIsDropdownOpen(false)
                                            }
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="8" r="4" />
                                                <path d="M5 21a7 7 0 0 1 14 0" />
                                            </svg>
                                            আমার প্রোফাইল
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <path d="M16 17l5-5-5-5" />
                                                <path d="M21 12H9" />
                                            </svg>
                                            সাইন আউট
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                                <Link
                                    href="/signin"
                                    className="px-2 py-2 text-xs font-medium text-gray-700 transition hover:text-green-600 sm:px-3 sm:text-sm"
                                >
                                    সাইন ইন
                                </Link>

                                <Link
                                    href="/signup"
                                    className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 sm:px-5 sm:py-2.5 sm:text-sm"
                                >
                                    সাইন আপ
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-200 bg-white">
                <div className="page-container mx-auto max-w-7xl">
                    <nav className="overflow-x-auto" aria-label="পণ্যের ক্যাটাগরি">
                        <div className="mx-auto flex w-max items-center justify-center gap-1 px-2 sm:gap-4 sm:px-4">
                            {categories.map((category) => {
                                const isActive =
                                    pathname === `/category/${category.slug}` ||
                                    pathname.startsWith(
                                        `/category/${category.slug}/`
                                    );

                                return (
                                    <Link
                                        key={category.slug}
                                        href={`/category/${category.slug}`}
                                        className={
                                            isActive
                                                ? "flex shrink-0 items-center justify-center gap-2 border-b-2 border-green-600 bg-green-50 px-3 py-3 text-xs font-medium text-green-600 transition-all sm:px-5 sm:py-4 sm:text-sm"
                                                : "flex shrink-0 items-center justify-center gap-2 border-b-2 border-transparent px-3 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-green-50 hover:text-green-600 sm:px-5 sm:py-4 sm:text-sm"
                                        }
                                    >
                                        <span className="shrink-0 text-base sm:text-lg">
                                            {category.icon}
                                        </span>
                                        <span>{category.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
