import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  primaryKey,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Auth.js required tables ─────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─── Enums ────────────────────────────────────────────────────────────────────

export const ministryEnum = pgEnum("ministry", [
  "none",
  "choir",
  "ushers",
  "prayer_team",
  "media",
  "kids",
  "youth",
  "adults",
  "other",
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected",
]);

export const roleEnum = pgEnum("role", [
  "member",
  "group_leader",
  "admin",
  "pastor",
]);

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  username: text("username").unique().notNull(),
  fullName: text("full_name").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  ministry: ministryEnum("ministry").default("none").notNull(),
  phone: text("phone"),
  whatsappNumber: text("whatsapp_number"),
  approvalStatus: approvalStatusEnum("approval_status")
    .default("pending")
    .notNull(),
  role: roleEnum("role").default("member").notNull(),
  rejectionReason: text("rejection_reason"),
  approvedBy: text("approved_by").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedAt: timestamp("approved_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Password reset tokens ────────────────────────────────────────────────────

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  used: boolean("used").default(false).notNull(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type NewProfile = typeof profiles.$inferInsert;

// ─── Blog enums ───────────────────────────────────────────────────────────────

export const blogCategoryEnum = pgEnum("blog_category", [
  "sermon",
  "devotional",
  "announcement",
  "testimony",
  "teaching",
]);

export const reactionTypeEnum = pgEnum("reaction_type", [
  "like",
  "amen",
  "praying",
]);

// ─── Post views ───────────────────────────────────────────────────────────────

export const postViews = pgTable(
  "post_views",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    postSlug: text("post_slug").notNull(),
    sessionId: text("session_id").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    viewedAt: timestamp("viewed_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("post_views_slug_session_idx").on(t.postSlug, t.sessionId),
    index("post_views_slug_idx").on(t.postSlug),
  ]
);

// ─── Post reactions ───────────────────────────────────────────────────────────

export const postReactions = pgTable(
  "post_reactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    postSlug: text("post_slug").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reactionType: reactionTypeEnum("reaction_type").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("post_reactions_slug_user_type_idx").on(
      t.postSlug,
      t.userId,
      t.reactionType
    ),
    index("post_reactions_slug_idx").on(t.postSlug),
  ]
);

// ─── Post comments ────────────────────────────────────────────────────────────

export const postComments = pgTable(
  "post_comments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    postSlug: text("post_slug").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: text("parent_id").references(
      (): AnyPgColumn => postComments.id,
      { onDelete: "cascade" }
    ),
    content: text("content").notNull(),
    isHidden: boolean("is_hidden").default(false).notNull(),
    isEdited: boolean("is_edited").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("post_comments_slug_idx").on(t.postSlug),
    index("post_comments_parent_idx").on(t.parentId),
  ]
);

// ─── Blog posts (admin-managed) ───────────────────────────────────────────────

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    author: text("author").notNull().default("Franchise Church"),
    coverImage: text("cover_image").notNull().default(""),
    category: blogCategoryEnum("category").notNull(),
    tags: text("tags").notNull().default(""), // comma-separated
    content: text("content").notNull().default(""),
    featured: boolean("featured").default(false).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("blog_posts_slug_idx").on(t.slug),
    index("blog_posts_category_idx").on(t.category),
    index("blog_posts_published_idx").on(t.isPublished),
  ]
);

export type BlogPostRow = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type PostView = typeof postViews.$inferSelect;
export type PostReaction = typeof postReactions.$inferSelect;
export type PostComment = typeof postComments.$inferSelect;
