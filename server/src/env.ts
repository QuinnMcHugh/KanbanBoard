import "dotenv/config";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set. Check your .env file.");
}
