import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
}

interface Props {
  actions: Action[];
  triggerClassName?: string;
}

export function ApActionDropdown({ actions, triggerClassName }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={`p-2 hover:bg-gray-100 rounded ${triggerClassName}`}
          aria-label="Actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-white border rounded shadow-md p-1 min-w-[120px] z-50"
        sideOffset={5}
      >
        {actions.map((action, idx) => (
          <DropdownMenu.Item
            key={idx}
            onClick={action.onClick}
            className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm ${
              action.className || ""
            }`}
          >
            {action.icon && <span className="w-4 h-4">{action.icon}</span>}
            {action.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
