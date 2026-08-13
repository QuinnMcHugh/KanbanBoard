import { rateLimit } from "express-rate-limit";

// Shared across signup + login. Keyed by IP (the library's default) — a known,
// documented gap: this doesn't stop credential stuffing spread across many IPs,
// and per-account limiting could close that later if needed.
export const authRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    standardHeaders: true, // adds RateLimit-* headers + Retry-After
    legacyHeaders: false,
    // Tests hit these routes many times in quick succession across auth.test.ts —
    // this is a security feature we don't want our own test suite tripping.
    skip: () => !!process.env.NODE_ENV && ["test", "development"].includes(process.env.NODE_ENV),
    message: { error: "Too many requests. Please try again later." },
});
