import type { LucideIcon } from "lucide-react"

type InfoBubbleProps = {
    text: string
    textColor?: string
    color?: string
    classNames?: string
    icon?: LucideIcon
}

const InfoBubble = ({ text, textColor, color, classNames, icon: BubbleIcon }: InfoBubbleProps) => {
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full text-sm font-semibold ${color} ${textColor} ${classNames}`}>
            {BubbleIcon && <BubbleIcon className="size-4 shrink-0" aria-hidden="true" />}
            {text}
        </span>
    )
}

export default InfoBubble