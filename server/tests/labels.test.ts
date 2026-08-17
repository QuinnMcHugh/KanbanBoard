import { describe, it, expect } from "vitest"
import request from "supertest"
import app from "../src/app"
import db from "../src/db/db"
import { authHeader } from "./helpers"

describe("GET /api/labels", () => {
    it("401s with no token", async () => {
        const res = await request(app).get("/api/labels")
        expect(res.status).toBe(401)
    })

    it("lists all labels", async () => {
        const res = await request(app).get("/api/labels").set(authHeader())

        expect(res.status).toBe(200)
        expect(res.body.labels).toHaveLength(5)
    })
})

describe("GET /api/labels/:id", () => {
    it("returns a single label", async () => {
        const res = await request(app).get("/api/labels/1").set(authHeader())

        expect(res.status).toBe(200)
        expect(res.body.label).toMatchObject({
            id: 1,
            name: "Frontend",
            color: "#3b82f6",
        })
    })

    it("404s for a nonexistent id", async () => {
        const res = await request(app).get("/api/labels/9999").set(authHeader())
        expect(res.status).toBe(404)
    })

    it("400s for a non-numeric id", async () => {
        const res = await request(app)
            .get("/api/labels/not-a-number")
            .set(authHeader())
        expect(res.status).toBe(400)
    })
})

describe("POST /api/labels", () => {
    it("creates a label and returns the full row from a single query", async () => {
        const res = await request(app)
            .post("/api/labels")
            .set(authHeader())
            .send({ name: "Documentation", color: "#00ffff" })

        expect(res.status).toBe(201)
        expect(res.body.label).toMatchObject({
            name: "Documentation",
            color: "#00ffff",
        })
        expect(res.body.label.id).toEqual(expect.any(Number))
    })

    it("400s when name is missing", async () => {
        const res = await request(app)
            .post("/api/labels")
            .set(authHeader())
            .send({ color: "#000000" })
        expect(res.status).toBe(400)
    })

    it("400s when color is missing", async () => {
        const res = await request(app)
            .post("/api/labels")
            .set(authHeader())
            .send({ name: "No Color" })
        expect(res.status).toBe(400)
    })

    it("409s on a duplicate name", async () => {
        const res = await request(app)
            .post("/api/labels")
            .set(authHeader())
            .send({ name: "Frontend", color: "#123456" })

        expect(res.status).toBe(409)
    })

    it("400s when color isn't a valid hex code", async () => {
        const res = await request(app)
            .post("/api/labels")
            .set(authHeader())
            .send({ name: "Bad Color", color: "notahex" })

        expect(res.status).toBe(400)
    })
})

describe("PATCH /api/labels/:id", () => {
    it("updates only the provided field", async () => {
        const res = await request(app)
            .patch("/api/labels/1")
            .set(authHeader())
            .send({ color: "#ffffff" })

        expect(res.status).toBe(200)
        expect(res.body.label).toMatchObject({
            id: 1,
            name: "Frontend",
            color: "#ffffff",
        })
    })

    it("400s when no fields are provided", async () => {
        const res = await request(app)
            .patch("/api/labels/1")
            .set(authHeader())
            .send({})
        expect(res.status).toBe(400)
    })

    it("404s for a nonexistent id", async () => {
        const res = await request(app)
            .patch("/api/labels/9999")
            .set(authHeader())
            .send({ color: "#ffffff" })
        expect(res.status).toBe(404)
    })

    it("409s when renamed to a name that's already taken", async () => {
        const res = await request(app)
            .patch("/api/labels/1")
            .set(authHeader())
            .send({ name: "Backend" })
        expect(res.status).toBe(409)
    })

    it("400s when color isn't a valid hex code", async () => {
        const res = await request(app)
            .patch("/api/labels/1")
            .set(authHeader())
            .send({ color: "notahex" })
        expect(res.status).toBe(400)
    })
})

describe("DELETE /api/labels/:id", () => {
    it("deletes a label and returns its data", async () => {
        const res = await request(app).delete("/api/labels/4").set(authHeader())

        expect(res.status).toBe(200)
        expect(res.body.label).toMatchObject({ id: 4, name: "Design" })
    })

    it("404s for a nonexistent id", async () => {
        const res = await request(app)
            .delete("/api/labels/9999")
            .set(authHeader())
        expect(res.status).toBe(404)
    })

    it("cascades: deleting a label removes its task_labels associations", async () => {
        const linksBefore = await db("task_labels").where({ label_id: 1 })
        expect(linksBefore.length).toBeGreaterThan(0)

        await request(app).delete("/api/labels/1").set(authHeader())

        const linksAfter = await db("task_labels").where({ label_id: 1 })
        expect(linksAfter).toHaveLength(0)
    })
})
