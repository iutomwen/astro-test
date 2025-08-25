import { defineAction } from "astro:actions";
import { z } from "astro:schema";

// Define the contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(1000, "Message is too long"),
  country: z.string().min(1, "Please select a country"),
  newsletter: z.boolean().optional().default(false),
});

// Define the contact form action
export const server = {
  // Contact form submission action
  submitContactForm: defineAction({
    accept: "form",
    input: contactFormSchema,
    handler: async (input, context) => {
      console.log("📨 Contact form submission received:", input);

      try {
        // Here you can:
        // 1. Save to database
        // 2. Send email
        // 3. Call external APIs
        // 4. Perform server-side validation

        // Example: Save to database (replace with your DB logic)
        // await db.contacts.create({
        //   data: {
        //     name: input.name,
        //     email: input.email,
        //     message: input.message,
        //     country: input.country,
        //     newsletter: input.newsletter,
        //     submittedAt: new Date(),
        //   }
        // });

        // Example: Send email notification (replace with your email service)
        // await sendEmail({
        //   to: 'admin@yoursite.com',
        //   subject: `New contact form submission from ${input.name}`,
        //   html: `
        //     <h2>New Contact Form Submission</h2>
        //     <p><strong>Name:</strong> ${input.name}</p>
        //     <p><strong>Email:</strong> ${input.email}</p>
        //     <p><strong>Country:</strong> ${input.country}</p>
        //     <p><strong>Newsletter:</strong> ${input.newsletter ? 'Yes' : 'No'}</p>
        //     <p><strong>Message:</strong></p>
        //     <p>${input.message}</p>
        //   `
        // });

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Return success response
        return {
          success: true,
          message: "Thank you for your message! We'll get back to you soon.",
          data: {
            submittedAt: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9), // Generate a simple ID
          },
        };
      } catch (error) {
        console.error("❌ Error processing contact form:", error);

        // Return error response
        throw new Error("Failed to submit form. Please try again later.");
      }
    },
  }),
};
