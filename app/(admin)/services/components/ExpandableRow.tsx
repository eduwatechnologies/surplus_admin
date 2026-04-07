import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface ExpandableRowProps {
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function ExpandToggleButton({ expanded, onToggle }: ExpandableRowProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle}>
      {expanded ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
}
