import { z } from "zod";

const requiredName = z.string().trim().min(2, "Enter a name").max(120);
const requiredPhone = z.string().trim().min(7, "Enter a phone number").max(20);
const optionalText = z.string().trim().max(2000).optional().or(z.literal(""));

export const enquirySchema = z.object({
  name: requiredName,
  company: optionalText,
  email: z.string().trim().email("Enter a valid email"),
  phone: requiredPhone,
  city: optionalText,
  quantity: optionalText,
  interest: z.string().trim().max(200),
  message: optionalText,
});
export type EnquiryInput = z.infer<typeof enquirySchema>;

export const b2bSchema = z.object({
  companyName: requiredName,
  contactName: requiredName,
  email: z.string().trim().email("Enter a valid email"),
  phone: requiredPhone,
  estimatedQuantity: z.string().trim().min(1, "Enter an estimated quantity").max(120),
  useCase: z.string().trim().min(1, "Select a use case").max(200),
  timeline: z.string().trim().min(1, "Select a timeline").max(120),
  message: optionalText,
});
export type B2bInput = z.infer<typeof b2bSchema>;

export const showroomVisitSchema = z.object({
  name: requiredName,
  email: z.string().trim().email("Enter a valid email"),
  phone: requiredPhone,
  preferredDate: z.string().trim().min(1, "Choose a preferred date"),
  preferredTime: z.string().trim().min(1, "Choose a preferred time"),
  partySize: optionalText,
  notes: optionalText,
});
export type ShowroomVisitInput = z.infer<typeof showroomVisitSchema>;
