/** @jsxImportSource @builder.io/qwik */
import { component$, useSignal, $, type Signal } from "@builder.io/qwik";
import { getBaseInputClasses, type FormFieldProps, type Size } from "./types";

export interface TextareaProps extends FormFieldProps {
  placeholder?: string;
  value?: string | Signal<string>;
  size?: Size;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
  autoFocus?: boolean;
  readOnly?: boolean;
  onInput$?: (value: string, event: Event) => void;
  onChange$?: (value: string, event: Event) => void;
  onFocus$?: (event: FocusEvent) => void;
  onBlur$?: (event: FocusEvent) => void;
}

export const Textarea = component$<TextareaProps>(
  ({
    label,
    error,
    helperText,
    loading = false,
    size = "md",
    placeholder,
    value,
    disabled = false,
    required = false,
    rows = 4,
    resize = "vertical",
    class: className = "",
    id,
    name,
    onInput$,
    onChange$,
    onFocus$,
    onBlur$,
    ...props
  }) => {
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    const internalValue = useSignal(typeof value === "string" ? value : "");
    const currentValue = typeof value === "object" ? value : internalValue;

    const handleInput = $((event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      currentValue.value = target.value;
      onInput$?.(target.value, event);
    });

    const handleChange = $((event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      onChange$?.(target.value, event);
    });

    const resizeClasses = {
      none: "resize-none",
      vertical: "resize-y",
      horizontal: "resize-x",
      both: "resize",
    };

    const textareaClasses = `${getBaseInputClasses(size, !!error)} ${
      resizeClasses[resize]
    } ${className}`;
    const ariaDescribedBy =
      [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div class="space-y-1">
        {label && (
          <label
            for={textareaId}
            class={`block text-sm font-medium ${
              error ? "text-red-700" : "text-gray-700"
            }`}
          >
            {label}
            {required && <span class="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div class="relative">
          <textarea
            id={textareaId}
            name={name}
            class={textareaClasses}
            placeholder={placeholder}
            value={currentValue.value}
            disabled={disabled || loading}
            required={required}
            rows={rows}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            onInput$={handleInput}
            onChange$={handleChange}
            onFocus$={onFocus$}
            onBlur$={onBlur$}
            {...props}
          />

          {loading && (
            <div class="absolute top-3 right-3">
              <svg
                class="animate-spin h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} class="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} class="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

export default Textarea;
