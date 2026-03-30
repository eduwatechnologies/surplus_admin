import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  type?: "submit" | "button";
  icon?: React.ReactNode;
  loadingText?: string;
  defaultText?: string;
  disabled?: boolean;
}

export const ApButton = ({
  loading = false,
  children,
  className = "",
  type = "submit",
  icon = <Save className="w-4 h-4 mr-2" />,
  loadingText = "Processing...",
  defaultText = "Submit",
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      className={cn("bg-blue-600 text-white hover:bg-blue-700", className)}
      disabled={loading || disabled}
    >
      {loading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-4 w-4 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        <span className="flex items-center">
          {icon}
          {children || defaultText}
        </span>
      )}
    </Button>
  );
};
