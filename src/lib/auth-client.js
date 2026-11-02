import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL:
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
});

export const {
    signIn,
    signUp,
    signOut,
    useSession,
} = authClient;


export function getCallbackURL(fallback = "/") {
    if (typeof window === "undefined") return fallback;

    const value = new URLSearchParams(window.location.search).get(
        "callbackURL"
    );

    if (!value || !value.startsWith("/") || value.startsWith("//")) {
        return fallback;
    }

    return value;
}