import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { authHeader } from "./helpers";

describe("POST /api/auth/signup", () => {
    it("creates a user and returns a token", async () => {
        const res = await request(app).post("/api/auth/signup").send({
            username: "new_user",
            email: "new_user@example.com",
            password: "password123",
        });

        expect(res.status).toBe(201);
        expect(res.body.token).toEqual(expect.any(String));
        expect(res.body.user).toMatchObject({ username: "new_user", email: "new_user@example.com" });
        expect(res.body.user.password_hash).toBeUndefined();
    });

    it("400s when a required field is missing", async () => {
        const res = await request(app).post("/api/auth/signup").send({
            username: "incomplete_user",
            email: "incomplete@example.com",
        });

        expect(res.status).toBe(400);
    });

    it("409s on a duplicate email", async () => {
        await request(app).post("/api/auth/signup").send({
            username: "dupe_one",
            email: "dupe@example.com",
            password: "password123",
        });

        const res = await request(app).post("/api/auth/signup").send({
            username: "dupe_two",
            email: "dupe@example.com",
            password: "password123",
        });

        expect(res.status).toBe(409);
    });
});

describe("POST /api/auth/login", () => {
    async function signUpTestUser() {
        await request(app).post("/api/auth/signup").send({
            username: "login_test_user",
            email: "login_test_user@example.com",
            password: "correct_password",
        });
    }

    it("logs in with correct credentials", async () => {
        await signUpTestUser();

        const res = await request(app).post("/api/auth/login").send({
            email: "login_test_user@example.com",
            password: "correct_password",
        });

        expect(res.status).toBe(200);
        expect(res.body.token).toEqual(expect.any(String));
    });

    it("401s on wrong password", async () => {
        await signUpTestUser();

        const res = await request(app).post("/api/auth/login").send({
            email: "login_test_user@example.com",
            password: "wrong_password",
        });

        expect(res.status).toBe(401);
    });

    it("401s on an email that doesn't exist", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "nobody@example.com",
            password: "whatever",
        });

        expect(res.status).toBe(401);
    });

    it("400s when a required field is missing", async () => {
        const res = await request(app).post("/api/auth/login").send({ email: "login_test_user@example.com" });

        expect(res.status).toBe(400);
    });
});

describe("GET /api/auth/me", () => {
    it("returns the logged-in user's profile", async () => {
        const signupRes = await request(app).post("/api/auth/signup").send({
            username: "me_test_user",
            email: "me_test_user@example.com",
            password: "password123",
        });

        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${signupRes.body.token}`);

        expect(res.status).toBe(200);
        expect(res.body.user).toMatchObject({ username: "me_test_user", email: "me_test_user@example.com" });
    });

    it("401s with no token", async () => {
        const res = await request(app).get("/api/auth/me");

        expect(res.status).toBe(401);
    });

    it("403s with an invalid token", async () => {
        const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not-a-real-token");

        expect(res.status).toBe(403);
    });

    it("works with the makeAuthToken/authHeader test helper for a seeded user", async () => {
        const res = await request(app).get("/api/auth/me").set(authHeader(2));

        expect(res.status).toBe(200);
        expect(res.body.user.id).toBe(2);
    });
});
