"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: "text" | "password" | "email" | "textarea";
  error?: string;
}

export const ApTextInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}: Props) => {
  const [show, setShow] = useState(false);
  const inputType = type === "password" && !show ? "password" : "text";

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>

      <div className="relative">
        {type === "textarea" ? (
          <Textarea id={name} name={name} value={value} onChange={onChange} />
        ) : (
          <Input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            type={inputType}
          />
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-2 p-1 text-gray-600"
          >
            {show ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
