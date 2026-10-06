import { AlertDialog } from "radix-ui"

type ConfirmDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel: string
    onConfirm: () => void
}

export default function ConfirmDeleteDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    onConfirm,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-40 bg-slate-950/40" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-xl bg-white p-6 font-sans text-[15px] text-slate-900 shadow-xl">
                    <AlertDialog.Title className="text-lg font-semibold">{title}</AlertDialog.Title>
                    <AlertDialog.Description className="text-slate-600">{description}</AlertDialog.Description>
                    <div className="mt-3 flex justify-end gap-2">
                        <AlertDialog.Cancel className="h-11 rounded-lg border border-slate-300 bg-white px-4 hover:border-slate-400 hover:bg-slate-50">
                            Cancel
                        </AlertDialog.Cancel>
                        <AlertDialog.Action
                            onClick={onConfirm}
                            className="h-11 rounded-lg bg-red-700 px-4 font-medium text-white hover:bg-red-800"
                        >
                            {confirmLabel}
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}