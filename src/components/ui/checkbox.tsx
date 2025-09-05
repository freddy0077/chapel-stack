"use client";

import * as React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, onCheckedChange, ...props }, ref) => {
    const id = React.useId();
    const [checked, setChecked] = React.useState(props.checked || false);

    React.useEffect(() => {
      if (props.checked !== undefined) {
        setChecked(!!props.checked);
      }
    }, [props.checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      
      // Call the standard onChange handler
      if (props.onChange) {
        props.onChange(e);
      }

      // Call the onCheckedChange handler if provided
      if (onCheckedChange) {
        onCheckedChange(isChecked);
      }

      if (props.checked === undefined) {
        setChecked(isChecked);
      }
    };

    return (
      <div className="flex items-start gap-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={props.id || id}
            ref={ref}
            className="peer absolute opacity-0 w-4 h-4 cursor-pointer"
            {...props}
            checked={checked}
            onChange={handleChange}
          />
          <div
            className={cn(
              "flex items-center justify-center w-4 h-4 border rounded-sm transition-colors",
              checked
                ? "bg-blue-600 border-blue-600"
                : "border-gray-300 bg-white",
              props.disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
          >
            {checked && <CheckIcon className="h-3 w-3 text-white" />}
          </div>
        </div>
        {(label || description) && (
          <div className="grid gap-0.5 leading-none">
            {label && (
              <label
                htmlFor={props.id || id}
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  props.disabled && "cursor-not-allowed opacity-70",
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
