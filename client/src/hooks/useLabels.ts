import { useEffect, useState } from "react";
import {
    createLabel as createLabelRequest,
    deleteLabel as deleteLabelRequest,
    getLabels,
} from "../api/labels";
import type { Label } from "../types/label";

export function useLabels() {
    const [labels, setLabels] = useState<Label[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const result = await getLabels();
                setLabels(result.labels);
            } catch {
                setError("Unable to load labels.");
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, []);

    const createLabel = async (name: string, color: string) => {
        const result = await createLabelRequest(name, color);
        setLabels((prev) => [...prev, result.label]);
        return result.label;
    };

    const deleteLabel = async (id: number) => {
        await deleteLabelRequest(id);
        setLabels((prev) => prev.filter((label) => label.id !== id));
    };

    return { labels, isLoading, error, createLabel, deleteLabel };
}
