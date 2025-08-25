/** @jsxImportSource @builder.io/qwik */

// Base form component types and utilities
export interface BaseFormProps {
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  class?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export interface FormFieldProps extends BaseFormProps {
  label?: string;
  error?: string;
  helperText?: string;
  loading?: boolean;
}

export interface ValidationState {
  isValid: boolean;
  error?: string;
}

// Size variants
export type Size = "sm" | "md" | "lg";

// Variant types
export type Variant = "primary" | "secondary" | "success" | "error" | "warning";

// Common class utilities
export const getBaseInputClasses = (
  size: Size = "md",
  hasError: boolean = false
) => {
  const baseClasses = [
    "block w-full rounded-md border transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-3 py-2 text-base",
    lg: "px-4 py-3 text-lg",
  };

  const stateClasses = hasError
    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

  return `${baseClasses.join(" ")} ${sizeClasses[size]} ${stateClasses}`;
};

export const getButtonClasses = (
  variant: Variant = "primary",
  size: Size = "md",
  loading: boolean = false
) => {
  const baseClasses = [
    "inline-flex items-center justify-center font-medium rounded-md",
    "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    error: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    warning:
      "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
  };

  const loadingClasses = loading ? "cursor-wait" : "";

  return `${baseClasses.join(" ")} ${sizeClasses[size]} ${
    variantClasses[variant]
  } ${loadingClasses}`;
};
