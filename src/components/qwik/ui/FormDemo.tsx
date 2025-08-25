/** @jsxImportSource @builder.io/qwik */
import { component$, useSignal, $ } from "@builder.io/qwik";
import { Button, Input, Select, Textarea } from "./index";
import type { SelectOption } from "./Select";

export const FormDemo = component$(() => {
  // Form state
  const formData = useSignal({
    name: "",
    email: "",
    message: "",
    country: "",
    newsletter: false,
  });

  // Loading and error states
  const isLoading = useSignal(false);
  const errors = useSignal<Record<string, string>>({});

  // Sample select options
  const countryOptions: SelectOption[] = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
  ];

  // Validation function
  const validateForm = $(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.value.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.value.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.value.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.value.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    if (!formData.value.country) {
      newErrors.country = "Please select a country";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  });

  // Form submission handler using Astro Actions
  const handleSubmit = $(async (event?: Event) => {
    // Prevent default form submission
    if (event) {
      event.preventDefault();
    }

    // Client-side validation first
    if (!validateForm()) {
      console.log("Client-side validation failed:", errors.value);
      return;
    }

    console.log("Client-side validation passed, submitting to server...");
    isLoading.value = true;

    try {
      // Prepare form data for Astro Action
      const formDataForSubmission = new FormData();
      formDataForSubmission.append("name", formData.value.name.trim());
      formDataForSubmission.append(
        "email",
        formData.value.email.trim().toLowerCase()
      );
      formDataForSubmission.append("message", formData.value.message.trim());
      formDataForSubmission.append("country", formData.value.country);
      formDataForSubmission.append(
        "newsletter",
        formData.value.newsletter.toString()
      );

      // Call Astro Action via API route
      const response = await fetch("/api/actions/submitContactForm", {
        method: "POST",
        body: formDataForSubmission,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success - reset form
        formData.value = {
          name: "",
          email: "",
          message: "",
          country: "",
          newsletter: false,
        };
        errors.value = {};

        alert(`✅ ${result.message}\n📝 Submission ID: ${result.data.id}`);
      } else {
        // Handle validation errors from server
        if (result.fields) {
          const serverErrors: Record<string, string> = {};
          Object.keys(result.fields).forEach((field) => {
            if (result.fields[field] && result.fields[field].length > 0) {
              serverErrors[field] = result.fields[field][0];
            }
          });
          errors.value = serverErrors;
        } else {
          errors.value = { submit: result.error || "Submission failed" };
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      errors.value = { submit: "Failed to submit form. Please try again." };
    } finally {
      isLoading.value = false;
    }
  });

  // Field update handlers
  const updateName = $((value: string) => {
    formData.value = { ...formData.value, name: value };
    if (errors.value.name) {
      errors.value = { ...errors.value, name: "" };
    }
  });

  const updateEmail = $((value: string) => {
    formData.value = { ...formData.value, email: value };
    if (errors.value.email) {
      errors.value = { ...errors.value, email: "" };
    }
  });

  const updateMessage = $((value: string) => {
    formData.value = { ...formData.value, message: value };
    if (errors.value.message) {
      errors.value = { ...errors.value, message: "" };
    }
  });

  const updateCountry = $((value: string) => {
    formData.value = { ...formData.value, country: value };
    if (errors.value.country) {
      errors.value = { ...errors.value, country: "" };
    }
  });

  return (
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">
        Qwik Form UI Components Demo
      </h1>

      <form preventdefault:submit onSubmit$={handleSubmit} class="space-y-6">
        {/* Name Input */}
        <Input
          label="Full Name"
          name="name"
          value={formData.value.name}
          placeholder="Enter your full name"
          error={errors.value.name}
          onInput$={updateName}
          helperText="Please enter your first and last name"
        />

        {/* Email Input */}
        <Input
          type="email"
          label="Email Address"
          name="email"
          value={formData.value.email}
          placeholder="you@example.com"
          error={errors.value.email}
          onInput$={updateEmail}
          helperText="We'll never share your email address"
        />

        {/* Country Select */}
        <Select
          label="Country"
          name="country"
          options={countryOptions}
          placeholder="Select your country"
          value={formData.value.country}
          error={errors.value.country}
          onChange$={updateCountry}
        />

        {/* Message Textarea */}
        <Textarea
          label="Message"
          name="message"
          value={formData.value.message}
          placeholder="Tell us about your inquiry..."
          error={errors.value.message}
          onInput$={updateMessage}
          rows={5}
          helperText="Please provide as much detail as possible"
        />

        {/* Submit Error */}
        {errors.value.submit && (
          <div class="text-red-600 text-sm">{errors.value.submit}</div>
        )}

        {/* Form Actions */}
        <div class="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            loading={isLoading.value}
            disabled={isLoading.value}
          >
            {isLoading.value ? "Submitting..." : "Submit Form"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={isLoading.value}
            onClick$={() => {
              formData.value = {
                name: "",
                email: "",
                message: "",
                country: "",
                newsletter: false,
              };
              errors.value = {};
            }}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* Component Showcase */}
      <div class="mt-12 pt-8 border-t border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Component Variants
        </h2>

        <div class="space-y-8">
          {/* Button Variants */}
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Buttons</h3>
            <div class="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="error">Error</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="primary" loading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Input Sizes */}
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Input Sizes</h3>
            <div class="space-y-4">
              <Input size="sm" placeholder="Small input" />
              <Input size="md" placeholder="Medium input (default)" />
              <Input size="lg" placeholder="Large input" />
            </div>
          </div>

          {/* Error States */}
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">Error States</h3>
            <div class="space-y-4">
              <Input
                label="Input with Error"
                error="This field is required"
                placeholder="Enter something..."
              />
              <Select
                label="Select with Error"
                options={[{ value: "test", label: "Test Option" }]}
                error="Please select an option"
                placeholder="Choose an option"
              />
              <Textarea
                label="Textarea with Error"
                error="Message is too short"
                placeholder="Enter your message..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FormDemo;
