import { useEffect, useState } from "react"
import {
    createProject as createProjectRequest,
    deleteProject as deleteProjectRequest,
    getProjects,
} from "../api/projects"
import type { Project } from "../types/project"

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const load = async () => {
            try {
                const result = await getProjects()
                setProjects(result.projects)
            } catch {
                setError("Unable to load projects.")
            } finally {
                setIsLoading(false)
            }
        }

        void load()
    }, [])

    const createProject = async (name: string, ownerId: number) => {
        const result = await createProjectRequest(name, ownerId)
        setProjects((prev) => [...prev, result.project])
        return result.project
    }

    const deleteProject = async (id: number) => {
        await deleteProjectRequest(id)
        setProjects((prev) => prev.filter((project) => project.id !== id))
    }

    return { projects, isLoading, error, createProject, deleteProject }
}
