import { notFound, redirect } from "next/navigation"
import { z } from "zod"
import { createDraft, getDraft } from "@/lib/server/drafts"
import { primaryButton } from "@/components/plans/bits"
import DevChat from "@/components/dev/DevChat"
import { IntakeUIMessage } from "@/lib/ai/intake-tools"

async function startDraft() {
    "use server"
    const id = await createDraft()
    redirect(`/dev/chat?draft=${id}`)
}

export default async function DevChatPage(props: PageProps<"/dev/chat">) {
    const { draft: draftParam } = await props.searchParams

    // No draft in the URL: offer to start one
    if (typeof draftParam !== "string") {
        return (
            <form action={startDraft} className="p-8">
                <button type="submit" className={primaryButton}>Start a new draft</button>
            </form>
        )
    }

    const draftId = z.uuid().safeParse(draftParam)
    if (!draftId.success) notFound()

    const draft = await getDraft(draftId.data)
    if (!draft) notFound()

    return (
        <DevChat
            key={draft.id}
            id={draft.id}
            initialMessages={draft.messages as IntakeUIMessage[]}
            initialIntake={draft.intake}
        />
    )
}