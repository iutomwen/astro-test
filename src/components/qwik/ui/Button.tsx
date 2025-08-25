/** @jsxImportSource @builder.io/qwik */
import { component$, Slot } from "@builder.io/qwik";
import { getButtonClasses, type Variant, type Size } from "./types";

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  class?: string;
  onClick$?: () => void;
  "aria-label"?: string;
}

export const Button = component$<ButtonProps>(
  ({
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    loading = false,
    class: className = "",
    onClick$,
    ...props
  }) => {
    const buttonClasses = `${getButtonClasses(
      variant,
      size,
      loading
    )} ${className}`;

    return (
      <button
        type={type}
        class={buttonClasses}
        disabled={disabled || loading}
        onClick$={onClick$}
        {...props}
      >
        {loading && (
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4"
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
        )}
        <Slot />
      </button>
    );
  }
);

export default Button;
