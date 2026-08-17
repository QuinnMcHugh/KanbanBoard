import "dotenv/config"

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set. Check your .env file.")
}

const environment = process.env.NODE_ENV || "development"

if (environment === "production" && !process.env.CORS_ALLOWED_ORIGINS) {
    throw new Error(
        "CORS_ALLOWED_ORIGINS is not set. A production deployment must explicitly list its allowed frontend origin(s).",
    )
}
