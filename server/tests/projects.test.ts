import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app"
import db from "../src/db/db"
import { authHeader } from "./helpers"

describe("GET /api/projects", () => {
    it("401s with no token", async () => {
        const res = await request(app).get("/api/projects")
        expect(res.status).toBe(401)
    })

    it("lists all projects with joined owner info", async () => {
        const res = await request(app).get("/api/projects").set(authHeader())

        expect(res.status).toBe(200)
        expect(res.body.projects).toHaveLength(3)
        const websiteRedesign = res.body.projects.find(
            (p: any) => p.name === "Website Redesign",
        )
        expect(websiteRedesign).toMatchObject({
            owner: "alice_admin",
            owner_email: "alice@example.com",
        })
    })
})

describe("GET /api/projects/:id", () => {
    it("returns a single project", async () => {
        const res = await request(app).get("/api/projects/1").set(authHeader())

        expect(res.status).toBe(200)
        expect(res.body.project).toMatchObject({
            id: 1,
            name: "Website Redesign",
            owner: "alice_admin",
        })
    })

    it("404s for a nonexistent id", async () => {
        const res = await request(app)
            .get("/api/projects/9999")
            .set(authHeader())
        expect(res.status).toBe(404)
    })

    it("400s for a non-numeric id", async () => {
        const res = await request(app)
            .get("/api/projects/not-a-number")
            .set(authHeader())
        expect(res.status).toBe(400)
    })
})

describe("POST /api/projects", () => {
    it("creates a project scoped to an explicit owner_id", async () => {
        const res = await request(app)
            .post("/api/projects")
            .set(authHeader())
            .send({ name: "New Project", owner_id: 2 })

        expect(res.status).toBe(201)
        expect(res.body.project).toMatchObject({
            name: "New Project",
            owner: "bob_builder",
        })
    })

    it("400s when name is missing", async () => {
        const res = await request(app)
            .post("/api/projects")
            .set(authHeader())
            .send({ owner_id: 1 })
        expect(res.status).toBe(400)
    })

    it("400s when owner_id is missing", async () => {
        const res = await request(app)
            .post("/api/projects")
            .set(authHeader())
            .send({ name: "No Owner" })
        expect(res.status).toBe(400)
    })

    it("400s when owner_id references a nonexistent user", async () => {
        const res = await request(app)
            .post("/api/projects")
            .set(authHeader())
            .send({ name: "Bad Owner", owner_id: 9999 })

        expect(res.status).toBe(400)
    })
})

describe("PATCH /api/projects/:id", () => {
    it("updates only the provided field, leaving the rest untouched", async () => {
        const res = await request(app)
            .patch("/api/projects/1")
            .set(authHeader())
            .send({ name: "Renamed Project" })

        expect(res.status).toBe(200)
        expect(res.body.project).toMatchObject({
            id: 1,
            name: "Renamed Project",
            owner: "alice_admin",
        })
    })

    it("reassigns the owner", async () => {
        const res = await request(app)
            .patch("/api/projects/1")
            .set(authHeader())
            .send({ owner_id: 2 })

        expect(res.status).toBe(200)
        expect(res.body.project.owner).toBe("bob_builder")
    })

    it("400s when no fields are provided", async () => {
        const res = await request(app)
            .patch("/api/projects/1")
            .set(authHeader())
            .send({})
        expect(res.status).toBe(400)
    })

    it("404s for a nonexistent id", async () => {
        const res = await request(app)
            .patch("/api/projects/9999")
            .set(authHeader())
            .send({ name: "Ghost" })
        expect(res.status).toBe(404)
    })

    it("400s when reassigned to a nonexistent owner", async () => {
        const res = await request(app)
            .patch("/api/projects/1")
            .set(authHeader())
            .send({ owner_id: 9999 })
        expect(res.status).toBe(400)
    })
})

describe("DELETE /api/projects/:id", () => {
    it("deletes a project and returns its joined data", async () => {
        const res = await request(app)
            .delete("/api/projects/3")
            .set(authHeader())

        expect(res.status).toBe(200)
        expect(res.body.project).toMatchObject({
            id: 3,
            name: "Internal Tools",
        })
    })

    it("404s for a nonexistent id", async () => {
        const res = await request(app)
            .delete("/api/projects/9999")
            .set(authHeader())
        expect(res.status).toBe(404)
    })

    it("cascades: deleting a project also deletes its tasks", async () => {
        const tasksBefore = await db("tasks").where({ project_id: 3 })
        expect(tasksBefore.length).toBeGreaterThan(0)

        await request(app).delete("/api/projects/3").set(authHeader())

        const tasksAfter = await db("tasks").where({ project_id: 3 })
        expect(tasksAfter).toHaveLength(0)
    })
})
