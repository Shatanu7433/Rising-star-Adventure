import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20)
  .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number");

export const checkoutSchema = z.object({
  tourId: z.string().min(1),
  travelers: z.coerce.number().int().min(1).max(30),
  travelDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a travel date"),
  name: z.string().trim().min(2, "Enter your name").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255),
});

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  destination: z.string().trim().min(2, "Tell us where you want to go").max(200),
  travelers: z.coerce.number().int().min(1).max(100),
  startDate: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  source: z.string().trim().max(60).optional(),
  website: z.string().optional(), // honeypot: must stay empty
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
