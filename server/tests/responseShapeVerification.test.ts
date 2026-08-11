import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import { authHeader } from "./helpers";
import { authResponseSchema, meResponseSchema } from "../src/schemas/authSchemas";
import { projectResponseSchema, projectListResponseSchema } from "../src/schemas/projectSchemas";
import { labelResponseSchema, labelListResponseSchema } from "../src/schemas/labelSchemas";
import { taskResponseSchema, taskListResponseSchema } from "../src/schemas/taskSchemas";

describe("response schemas match reality", () => {
    it("auth: signup, login, me", async () => {
        const signupRes = await request(app).post("/api/auth/signup").send({
            username: "shape_check_user",
            email: "shape_check@example.com",
            password: "password123",
        });
        expect(() => authResponseSchema.parse(signupRes.body)).not.toThrow();

        const loginRes = await request(app).post("/api/auth/login").send({
            email: "shape_check@example.com",
            password: "password123",
        });
        expect(() => authResponseSchema.parse(loginRes.body)).not.toThrow();

        const meRes = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${loginRes.body.token}`);
        expect(() => meResponseSchema.parse(meRes.body)).not.toThrow();
    });

    it("projects: list and single", async () => {
        const listRes = await request(app).get("/api/projects").set(authHeader());
        expect(() => projectListResponseSchema.parse(listRes.body)).not.toThrow();

        const singleRes = await request(app).get("/api/projects/1").set(authHeader());
        expect(() => projectResponseSchema.parse(singleRes.body)).not.toThrow();
    });

    it("labels: list and single", async () => {
        const listRes = await request(app).get("/api/labels").set(authHeader());
        expect(() => labelListResponseSchema.parse(listRes.body)).not.toThrow();

        const singleRes = await request(app).get("/api/labels/1").set(authHeader());
        expect(() => labelResponseSchema.parse(singleRes.body)).not.toThrow();
    });

    it("tasks: list, single (with labels), and one with no labels", async () => {
        const listRes = await request(app).get("/api/projects/1/tasks").set(authHeader());
        expect(() => taskListResponseSchema.parse(listRes.body)).not.toThrow();

        const withLabels = await request(app).get("/api/projects/1/tasks/4").set(authHeader());
        expect(() => taskResponseSchema.parse(withLabels.body)).not.toThrow();

        const noLabels = await request(app).get("/api/projects/1/tasks/1").set(authHeader());
        expect(() => taskResponseSchema.parse(noLabels.body)).not.toThrow();

        // assigned_to_user_id is nullable — confirm an unassigned task's real shape parses.
        const unassigned = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ name: "Unassigned check", description: "desc", status: "to_do" });
        expect(() => taskResponseSchema.parse(unassigned.body)).not.toThrow();
    });
});
