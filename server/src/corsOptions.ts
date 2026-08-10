import type { CorsOptions } from "cors";

// Default Vite port
const DEFAULT_DEV_ORIGIN = "http://localhost:5173";

function resolveAllowedOrigins(): string[] {
    const configured = process.env.CORS_ALLOWED_ORIGINS;

    if (configured) {
        return configured.split(",").map((origin) => origin.trim()).filter(Boolean);
    }

    return [DEFAULT_DEV_ORIGIN];
}

export const corsOptions: CorsOptions = {
    origin: resolveAllowedOrigins(),
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 3600,
};
