import { z } from "zod";
import { SPREAD_COLORS } from "./colors";

export const handleSchema = z
  .string()
  .regex(/^[a-z0-9_]{3,20}$/, "3-20 lowercase letters, numbers, or underscores");

export const profileSchema = z.object({
  displayName: z.string().min(1, "Required").max(60),
  handle: handleSchema,
  agreedToTerms: z
    .boolean()
    .refine((v) => v === true, "You need to agree to the terms to continue."),
});

const handleLikeField = z
  .string()
  .max(50)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v.replace(/^[$@]+/, "").trim() : v));

export const profileEditSchema = z.object({
  displayName: z.string().min(1, "Required").max(60),
  socialLink: z.string().max(200).optional().or(z.literal("")),
  availability: z.string().max(100).optional().or(z.literal("")),
  area: z.string().max(100).optional().or(z.literal("")),
  paymentNote: z.string().max(100).optional().or(z.literal("")),
  cashappHandle: handleLikeField,
  venmoHandle: handleLikeField,
  bio: z.string().max(200).optional().or(z.literal("")),
  isLive: z.boolean(),
});

export const itemSchema = z.object({
  name: z.string().min(1, "Required").max(60),
  note: z.string().max(120).optional().or(z.literal("")),
});

export const restaurantSchema = z.object({
  name: z.string().min(1, "Required").max(50),
  items: z.array(itemSchema).min(1, "At least 1 item").max(3),
});

export const spreadSchema = z.object({
  title: z.string().min(1, "Required").max(60),
  color: z.enum(SPREAD_COLORS),
  notes: z.string().max(500).optional().or(z.literal("")),
  isPublic: z.boolean(),
  isPaused: z.boolean(),
  foodCost: z.number().min(0).max(999.99).nullable().optional(),
  price: z.number().min(0).max(999.99).nullable().optional(),
  restaurants: z.array(restaurantSchema).length(1, "One restaurant"),
});

const datetimeLocalPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const requestSubmitSchema = z.object({
  spreadId: z.string().uuid(),
  clientSubmissionId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  customerDisplayName: z.string().trim().min(1).max(80),
  contactChannel: z.enum(["instagram", "messenger", "other"]),
  socialHandle: z.string().trim().min(1).max(80),
  requestedWindowStart: z
    .string()
    .regex(datetimeLocalPattern, "Invalid date/time")
    .optional()
    .or(z.literal("")),
  requestedWindowEnd: z
    .string()
    .regex(datetimeLocalPattern, "Invalid date/time")
    .optional()
    .or(z.literal("")),
  requestedWindowTz: z.string().max(60).optional().or(z.literal("")),
});

export const requestStatusSchema = z.object({
  expectedStatus: z.enum(["new", "accepted"]),
  newStatus: z.enum(["accepted", "completed", "declined", "cancelled"]),
});

export type SpreadInput = z.infer<typeof spreadSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileEditInput = z.infer<typeof profileEditSchema>;
export type RequestSubmitInput = z.infer<typeof requestSubmitSchema>;
export type RequestStatusInput = z.infer<typeof requestStatusSchema>;
