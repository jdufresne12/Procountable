import { Select } from "radix-ui"
import { Check, ChevronDown } from "lucide-react"

type Option = {
    value: string
    label: string
}

type DropdownProps = {
    options: Option[]
    value?: string
    placeholder?: string
    onChange?: (value: string) => void
    /** Accessible name when there is no visible <label> */
    ariaLabel?: string
    id?: string
    /** Larger, bolder trigger used for the roadmap switcher */
    prominent?: boolean
}

export default function Dropdown({
    options,
    value,
    placeholder = "Select an option",
    onChange,
    ariaLabel,
    id,
    prominent = false,
}: DropdownProps) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                id={id}
                aria-label={ariaLabel}
                className={`flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-left text-slate-900 outline-none transition hover:border-slate-400 focus-visible:border-blue-700 focus-visible:ring-2 focus-visible:ring-blue-200 ${prominent ? "h-12 text-base font-semibold" : "h-11 text-[15px]"
                    }`}
            >
                <span className="truncate">
                    <Select.Value placeholder={placeholder} />
                </span>
                <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    position="popper"
                    sideOffset={5}
                    className="z-50 min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-slate-200 bg-white p-1 font-sans shadow-lg"
                >
                    <Select.Viewport>
                        {options.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-md px-3 py-2.5 text-[15px] text-slate-700 outline-none data-highlighted:bg-slate-100 data-highlighted:text-slate-900 data-[state=checked]:font-medium data-[state=checked]:text-slate-900"
                            >
                                <Select.ItemText>{option.label}</Select.ItemText>
                                <Select.ItemIndicator>
                                    <Check className="h-4 w-4 text-blue-700" />
                                </Select.ItemIndicator>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}
