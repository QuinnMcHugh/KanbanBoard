import jwt from "jsonwebtoken"

// Seed data (src/db/seeds/01_initial_data.ts) uses fake, non-bcrypt password hashes,
// so seeded users can't log in through the real /api/auth/login flow. Most tests only
// need *a* valid token, not to exercise bcrypt/signup itself — so we sign one directly
// with the same secret the app verifies against (see vitest.config.ts). The real
// signup/login/bcrypt flow gets its own dedicated coverage in auth.test.ts.
export function makeAuthToken(userId = 1): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" })
}

export function authHeader(userId = 1): { Authorization: string } {
    return { Authorization: `Bearer ${makeAuthToken(userId)}` }
}
