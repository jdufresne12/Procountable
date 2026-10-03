import type { Roadmap } from "../types";
import { supabase } from "./supabase"
import seed from "./data.json"

export async function loadRoadmaps(): Promise<Roadmap[]> {
    const { data, error } = await supabase
        .from("roadmap_data")
        .select("data")
        .maybeSingle()

    if (error) {
        console.error(error)
    }

    return (data?.data ?? seed) as Roadmap[]
}

export async function saveRoadmaps(roadmaps: Roadmap[]): Promise<void> {
    const { error } = await supabase
        .from("roadmap_data")
        .upsert({ id: 1, data: roadmaps, updated_at: new Date().toISOString() })

    if (error) throw error
}
