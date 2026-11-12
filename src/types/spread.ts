import type { SpreadStyle } from "@/lib/spreadStyle";

export type Profile = {
  id: string;
  handle: string;
  displayName: string;
  socialLink: string | null;
  availability: string | null;
  area: string | null;
  paymentNote: string | null;
  cashappHandle: string | null;
  venmoHandle: string | null;
  bio: string | null;
  isLive: boolean;
  agreedTermsAt: string | null;
  termsVersion: string | null;
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
  color: SpreadStyle;
  notes: string | null;
  isPublic: boolean;
  isPaused: boolean;
  foodCost: number | null;
  price: number | null;
  createdAt: string;
  updatedAt: string;
  restaurants: SpreadRestaurant[];
};

export type SpreadWithOwner = Spread & {
  ownerHandle: string;
  ownerDisplayName: string;
  ownerSocialLink: string | null;
  ownerAvailability: string | null;
  ownerArea: string | null;
  ownerPaymentNote: string | null;
  ownerCashappHandle: string | null;
  ownerVenmoHandle: string | null;
  ownerBio: string | null;
  ownerIsLive: boolean;
  ownerMembershipActive: boolean;
};

export type MembershipStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired";

export type Membership = {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  status: MembershipStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  introOfferUsedAt: string | null;
};

export type RequestItemSnapshot = {
  restaurant: string;
  item: string;
  note: string | null;
};

export type ContactChannel = "instagram" | "messenger" | "other";

export type RequestStatus =
  | "new"
  | "accepted"
  | "completed"
  | "declined"
  | "cancelled"
  | "archived";

export type SpreadRequest = {
  id: string;
  creatorId: string;
  spreadId: string;
  spreadTitle: string;
  items: RequestItemSnapshot[];
  currency: string;
  listedPriceCents: number | null;
  quantity: number;
  customerDisplayName: string;
  contactChannel: ContactChannel;
  socialHandle: string;
  requestedWindowStart: string | null;
  requestedWindowEnd: string | null;
  requestedWindowTz: string | null;
  status: RequestStatus;
  requestedAt: string;
  acceptedAt: string | null;
  closedAt: string | null;
  expiresAt: string;
};

export type RequestCounts = {
  newCount: number;
  activeCount: number;
};
