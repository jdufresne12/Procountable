import Image from "next/image"
import { cn } from "../lib/utils"

interface InfoBubbleProps {
    icon?: string
    text: string
    color: string
    textColor: string
    classNames?: string
}

const InfoBubble = ({ text, color, textColor, classNames }: InfoBubbleProps) => {
    return (
        <div className={cn(`flex rounded-full ${color}`, classNames)}>
            {/* IMAGE CODE HERE */}
            <p className={`${textColor}`}>{text}</p>
        </div>
    )
}

export default InfoBubble