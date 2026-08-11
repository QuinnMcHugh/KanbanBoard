import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("malformed request bodies", () => {
    it("400s on malformed JSON, using the parser's own message", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .set("Content-Type", "application/json")
            .send("{not valid json");

        expect(res.status).toBe(400);
        expect(res.body.error).toEqual(expect.any(String));
    });
});

describe("CORS", () => {
    // No CORS_ALLOWED_ORIGINS is set for the test environment, so corsOptions
    // falls back to its default dev origin (Vite's default port).
    const ALLOWED_ORIGIN = "http://localhost:5173";

    it("echoes back Access-Control-Allow-Origin for an allowed origin", async () => {
        const res = await request(app).get("/api/health/check").set("Origin", ALLOWED_ORIGIN);

        expect(res.headers["access-control-allow-origin"]).toBe(ALLOWED_ORIGIN);
    });

    it("omits Access-Control-Allow-Origin for a disallowed origin", async () => {
        const res = await request(app).get("/api/health/check").set("Origin", "https://evil.com");

        expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });
});

describe("request correlation", () => {
    it("returns an X-Request-Id header on every response", async () => {
        const res = await request(app).get("/api/health/check");

        expect(res.headers["x-request-id"]).toBeTruthy();
    });
});
