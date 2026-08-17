export interface Project {
    id: number
    name: string
    created_at: string
    /** The current owner's username. */
    owner: string
    owner_email: string
}
