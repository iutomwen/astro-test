import type { APIRoute } from "astro";
import { server } from "../../../actions/index.ts";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the form data from the request
    const requestFormData = await request.formData();

    // Call the Astro Action with FormData directly
    const result = await server.submitContactForm(requestFormData);

    if (result.data) {
      return new Response(JSON.stringify(result.data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (result.error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error.message || "Validation failed",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("API route error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Ensure a Response is always returned
  return new Response(
    JSON.stringify({
      success: false,
      error: "Unknown error",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
