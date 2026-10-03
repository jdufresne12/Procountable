import { Select } from "radix-ui"
import { ChevronDown } from "lucide-react"

type Option = {
    value: string
    label: string
}

type DropdownProps = {
    options: Option[]
    value?: string
    placeholder?: string
    onChange?: (value: string) => void
}

export default function Dropdown({
    options,
    value,
    placeholder = "Select an option",
    onChange,
}: DropdownProps) {
    return (
        <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger
                className="
          flex
          h-11
          w-full
          items-center
          justify-between
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          text-sm
          font-medium
          text-gray-900
          shadow-sm
          outline-none
          transition
          hover:border-gray-400
          focus:border-gray-400
          focus:ring-2
          focus:ring-gray-200
        "
            >
                <Select.Value placeholder={placeholder} />

                <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    position="popper"
                    sideOffset={5}
                    className="
            z-50
            min-w-[var(--radix-select-trigger-width)]
            overflow-hidden
            rounded-lg
            border
            border-gray-200
            bg-white
            p-1
            shadow-lg
          "
                >
                    <Select.Viewport>
                        {options.map((option) => (
                            <Select.Item
                                key={option.value}
                                value={option.value}
                                className="
                  cursor-pointer
                  select-none
                  rounded-md
                  px-3
                  py-2
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  data-[highlighted]:bg-gray-100
                  data-[highlighted]:text-gray-900
                  data-[state=checked]:font-medium
                "
                            >
                                <Select.ItemText>{option.label}</Select.ItemText>
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    )
}