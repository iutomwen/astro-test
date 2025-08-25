/** @jsxImportSource @builder.io/qwik */
import { component$, useSignal, $, type Signal } from "@builder.io/qwik";
import { getBaseInputClasses, type FormFieldProps, type Size } from "./types";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string | Signal<string>;
  size?: Size;
  multiple?: boolean;
  onChange$?: (value: string, event: Event) => void;
  onFocus$?: (event: FocusEvent) => void;
  onBlur$?: (event: FocusEvent) => void;
}

export const Select = component$<SelectProps>(
  ({
    options,
    label,
    error,
    helperText,
    loading = false,
    size = "md",
    placeholder,
    value,
    disabled = false,
    required = false,
    multiple = false,
    class: className = "",
    id,
    name,
    onChange$,
    onFocus$,
    onBlur$,
    ...props
  }) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;

    const internalValue = useSignal(typeof value === "string" ? value : "");
    const currentValue = typeof value === "object" ? value : internalValue;

    const handleChange = $((event: Event) => {
      const target = event.target as HTMLSelectElement;
      currentValue.value = target.value;
      onChange$?.(target.value, event);
    });

    const selectClasses = `${getBaseInputClasses(size, !!error)} ${className}`;
    const ariaDescribedBy =
      [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div class="space-y-1">
        {label && (
          <label
            for={selectId}
            class={`block text-sm font-medium ${
              error ? "text-red-700" : "text-gray-700"
            }`}
          >
            {label}
            {required && <span class="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div class="relative">
          <select
            id={selectId}
            name={name}
            class={selectClasses}
            value={currentValue.value}
            disabled={disabled || loading}
            required={required}
            multiple={multiple}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            onChange$={handleChange}
            onFocus$={onFocus$}
            onBlur$={onBlur$}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {loading && (
            <div class="absolute inset-y-0 right-8 flex items-center pr-3">
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

export default Select;
