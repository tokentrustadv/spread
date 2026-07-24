import { z } from "zod";
import { SPREAD_COLORS } from "./colors";

export const handleSchema = z
  .string()
  .regex(/^[a-z0-9_]{3,20}$/, "3-20 lowercase letters, numbers, or underscores");

export const profileSchema = z.object({
  displayName: z.string().min(1, "Required").max(60),
  handle: handleSchema,
});

export const profileEditSchema = z.object({
  displayName: z.string().min(1, "Required").max(60),
  socialLink: z.string().max(200).optional().or(z.literal("")),
  availability: z.string().max(100).optional().or(z.literal("")),
  area: z.string().max(100).optional().or(z.literal("")),
  paymentNote: z.string().max(100).optional().or(z.literal("")),
  isLive: z.boolean(),
});

export const itemSchema = z.object({
  name: z.string().min(1, "Required").max(60),
  note: z.string().max(120).optional().or(z.literal("")),
});

export const restaurantSchema = z.object({
  name: z.string().min(1, "Required").max(50),
  items: z.array(itemSchema).max(3),
});

export const spreadSchema = z
  .object({
    title: z.string().min(1, "Required").max(60),
    color: z.enum(SPREAD_COLORS),
    notes: z.string().max(500).optional().or(z.literal("")),
    isPublic: z.boolean(),
    restaurants: z.array(restaurantSchema).length(2, "Exactly 2 restaurants"),
  })
  .superRefine((data, ctx) => {
    const totalItems = data.restaurants.reduce(
      (sum, r) => sum + r.items.length,
      0
    );
    if (totalItems < 1 || totalItems > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "1-3 items total across the spread",
        path: ["restaurants"],
      });
    }
  });

export type SpreadInput = z.infer<typeof spreadSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileEditInput = z.infer<typeof profileEditSchema>;
