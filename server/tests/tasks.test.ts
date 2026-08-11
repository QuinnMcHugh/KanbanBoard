import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";
import db from "../src/db/db";
import { authHeader } from "./helpers";

describe("GET /api/projects/:projectId/tasks", () => {
    it("401s with no token", async () => {
        const res = await request(app).get("/api/projects/1/tasks");
        expect(res.status).toBe(401);
    });

    it("404s for a nonexistent project", async () => {
        const res = await request(app).get("/api/projects/9999/tasks").set(authHeader());
        expect(res.status).toBe(404);
    });

    it("400s for a non-numeric projectId", async () => {
        const res = await request(app).get("/api/projects/not-a-number/tasks").set(authHeader());
        expect(res.status).toBe(400);
    });

    it("lists tasks scoped to the project, with labels parsed as real arrays", async () => {
        const res = await request(app).get("/api/projects/1/tasks").set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.tasks).toHaveLength(4);

        const taskWithNoLabels = res.body.tasks.find((t: any) => t.id === 1);
        expect(taskWithNoLabels.labels).toEqual([]);

        const taskWithLabels = res.body.tasks.find((t: any) => t.id === 4);
        expect(taskWithLabels.labels).toHaveLength(2);
        expect(taskWithLabels.labels.map((l: any) => l.name).sort()).toEqual(["Backend", "Frontend"]);
    });
});

describe("GET /api/projects/:projectId/tasks/:id", () => {
    it("returns a single task with its labels", async () => {
        const res = await request(app).get("/api/projects/2/tasks/5").set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.task.name).toBe("Fix login crash");
        expect(res.body.task.labels.map((l: any) => l.name).sort()).toEqual(["Bug", "Urgent"]);
    });

    it("404s for a task id that doesn't exist", async () => {
        const res = await request(app).get("/api/projects/1/tasks/9999").set(authHeader());
        expect(res.status).toBe(404);
    });

    it("404s when the task exists but belongs to a different project", async () => {
        // task 7 belongs to project 3, not project 1
        const res = await request(app).get("/api/projects/1/tasks/7").set(authHeader());
        expect(res.status).toBe(404);
    });

    it("400s for a non-numeric task id", async () => {
        const res = await request(app).get("/api/projects/1/tasks/not-a-number").set(authHeader());
        expect(res.status).toBe(400);
    });
});

describe("POST /api/projects/:projectId/tasks", () => {
    const validPayload = {
        name: "New Task",
        description: "A task created by the test suite.",
        status: "to_do",
    };

    it("creates a task", async () => {
        const res = await request(app).post("/api/projects/1/tasks").set(authHeader()).send(validPayload);

        expect(res.status).toBe(201);
        expect(res.body.task).toMatchObject({ name: "New Task", status: "to_do", project_id: 1 });
        expect(res.body.task.labels).toEqual([]);
    });

    it("attaches labels when labelIds is provided", async () => {
        const res = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ ...validPayload, labelIds: [1, 3] });

        expect(res.status).toBe(201);
        expect(res.body.task.labels.map((l: any) => l.id).sort()).toEqual([1, 3]);
    });

    it("400s when name is missing", async () => {
        const res = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ description: "no name", status: "to_do" });

        expect(res.status).toBe(400);
    });

    it("400s when status is invalid", async () => {
        const res = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ ...validPayload, status: "not_a_real_status" });

        expect(res.status).toBe(400);
    });

    it("404s when assigned_to_user_id doesn't exist", async () => {
        const res = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ ...validPayload, assigned_to_user_id: 9999 });

        expect(res.status).toBe(404);
    });

    it("400s when labelIds contains a non-numeric entry", async () => {
        const res = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ ...validPayload, labelIds: ["abc"] });

        expect(res.status).toBe(400);
    });

    it("400s and names the missing ids when labelIds references nonexistent labels", async () => {
        const res = await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ ...validPayload, labelIds: [1, 9999] });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("9999");
    });

    it("rolls back the whole transaction when one labelId is invalid — no task gets created", async () => {
        const tasksBefore = await db("tasks").where({ project_id: 1 });

        await request(app)
            .post("/api/projects/1/tasks")
            .set(authHeader())
            .send({ ...validPayload, labelIds: [1, 9999] });

        const tasksAfter = await db("tasks").where({ project_id: 1 });
        expect(tasksAfter).toHaveLength(tasksBefore.length);
    });
});

describe("PATCH /api/projects/:projectId/tasks/:id", () => {
    it("updates only the provided field", async () => {
        const res = await request(app)
            .patch("/api/projects/1/tasks/1")
            .set(authHeader())
            .send({ status: "in_progress" });

        expect(res.status).toBe(200);
        expect(res.body.task).toMatchObject({ id: 1, name: "Create wireframes", status: "in_progress" });
    });

    it("leaves existing labels untouched when labelIds is omitted", async () => {
        // task 4 has labels [1, 2] (Frontend, Backend) from the seed
        const res = await request(app)
            .patch("/api/projects/1/tasks/4")
            .set(authHeader())
            .send({ status: "done" });

        expect(res.status).toBe(200);
        expect(res.body.task.labels.map((l: any) => l.id).sort()).toEqual([1, 2]);
    });

    it("replaces labels when labelIds is provided", async () => {
        // task 4 starts with labels [1, 2]
        const res = await request(app)
            .patch("/api/projects/1/tasks/4")
            .set(authHeader())
            .send({ labelIds: [3] });

        expect(res.status).toBe(200);
        expect(res.body.task.labels.map((l: any) => l.id)).toEqual([3]);
    });

    it("clears all labels when labelIds is an empty array", async () => {
        const res = await request(app).patch("/api/projects/1/tasks/4").set(authHeader()).send({ labelIds: [] });

        expect(res.status).toBe(200);
        expect(res.body.task.labels).toEqual([]);
    });

    it("bumps updated_at without touching created_at", async () => {
        const before = await request(app).get("/api/projects/1/tasks/1").set(authHeader());

        // SQLite's CURRENT_TIMESTAMP has 1-second resolution — wait past that boundary
        // so updated_at is guaranteed to differ, not just coincidentally equal.
        await new Promise((resolve) => setTimeout(resolve, 1100));

        const after = await request(app)
            .patch("/api/projects/1/tasks/1")
            .set(authHeader())
            .send({ status: "blocked" });

        expect(after.body.task.created_at).toBe(before.body.task.created_at);
        expect(after.body.task.updated_at).not.toBe(before.body.task.updated_at);
    });

    it("moves a task to a different project only when project_id is explicitly provided in the body", async () => {
        const res = await request(app)
            .patch("/api/projects/1/tasks/1")
            .set(authHeader())
            .send({ project_id: 2 });

        expect(res.status).toBe(200);
        expect(res.body.task.project_id).toBe(2);

        const noLongerInProjectOne = await request(app).get("/api/projects/1/tasks/1").set(authHeader());
        expect(noLongerInProjectOne.status).toBe(404);

        const nowInProjectTwo = await request(app).get("/api/projects/2/tasks/1").set(authHeader());
        expect(nowInProjectTwo.status).toBe(200);
    });

    it("404s when the task exists but belongs to a different project than the URL", async () => {
        // task 7 belongs to project 3, not project 1
        const res = await request(app)
            .patch("/api/projects/1/tasks/7")
            .set(authHeader())
            .send({ status: "done" });

        expect(res.status).toBe(404);
    });

    it("400s when the body has no valid properties", async () => {
        const res = await request(app).patch("/api/projects/1/tasks/1").set(authHeader()).send({});
        expect(res.status).toBe(400);
    });

    it("400s when status is invalid", async () => {
        const res = await request(app)
            .patch("/api/projects/1/tasks/1")
            .set(authHeader())
            .send({ status: "not_a_real_status" });

        expect(res.status).toBe(400);
    });

    it("404s for a nonexistent task id", async () => {
        const res = await request(app)
            .patch("/api/projects/1/tasks/9999")
            .set(authHeader())
            .send({ status: "done" });

        expect(res.status).toBe(404);
    });
});

describe("DELETE /api/projects/:projectId/tasks/:id", () => {
    it("deletes a task and returns its data including labels", async () => {
        const res = await request(app).delete("/api/projects/1/tasks/4").set(authHeader());

        expect(res.status).toBe(200);
        expect(res.body.task.id).toBe(4);
        expect(res.body.task.labels.map((l: any) => l.id).sort()).toEqual([1, 2]);
    });

    it("404s for a nonexistent task id", async () => {
        const res = await request(app).delete("/api/projects/1/tasks/9999").set(authHeader());
        expect(res.status).toBe(404);
    });

    it("404s when the task exists but belongs to a different project", async () => {
        const res = await request(app).delete("/api/projects/1/tasks/7").set(authHeader());
        expect(res.status).toBe(404);
    });

    it("cascades: deleting a task also deletes its task_labels rows", async () => {
        const linksBefore = await db("task_labels").where({ task_id: 4 });
        expect(linksBefore.length).toBeGreaterThan(0);

        await request(app).delete("/api/projects/1/tasks/4").set(authHeader());

        const linksAfter = await db("task_labels").where({ task_id: 4 });
        expect(linksAfter).toHaveLength(0);
    });
});
