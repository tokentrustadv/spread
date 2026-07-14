import type { SpreadColor } from "@/lib/colors";

export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  createdAt: string;
};

export type SpreadItem = {
  id: string;
  name: string;
  note: string | null;
  position: number;
};

export type SpreadRestaurant = {
  id: string;
  name: string;
  position: number;
  items: SpreadItem[];
};

export type Spread = {
  id: string;
  userId: string;
  slug: string;
  title: string;
  color: SpreadColor;
  notes: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  restaurants: SpreadRestaurant[];
};

export type SpreadWithOwner = Spread & {
  ownerHandle: string;
  ownerDisplayName: string;
};
