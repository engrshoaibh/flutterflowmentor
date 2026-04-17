import mongoose, {
  model,
  models,
  Schema,
  type Document,
  type InferSchemaType,
  type Model,
} from "mongoose";

// ---------------------------------------------------------------------------
// Sub-schemas (all without _id — they are embedded, not referenced)
// ---------------------------------------------------------------------------

const imageSchema = new Schema(
  {
    url: { type: String, required: [true, "Image URL is required"] },
    alt: { type: String, required: [true, "Image alt text is required"] }, // SEO: alt text affects accessibility ranking
  },
  { _id: false },
);

const seoSchema = new Schema(
  {
    metaTitle:       { type: String, maxlength: 60 },
    metaDescription: { type: String, maxlength: 160 },
    keywords:        { type: [String], default: [] },
    canonicalUrl:    { type: String },
  },
  { _id: false },
);

const ogSchema = new Schema(
  {
    title:       { type: String },
    description: { type: String },
    image:       { type: String },
  },
  { _id: false },
);

// ---------------------------------------------------------------------------
// Root schema
// ---------------------------------------------------------------------------

const postSchema = new Schema(
  {
    title: {
      type:      String,
      required:  [true, "Title is required"],
      maxlength: [60, "Title must not exceed 60 characters (SEO limit)"],
      trim:      true,
    },

    // Slug generation: derived from `title` in the pre-save hook.
    // A unique index is added below — Mongoose 9 recommends declaring it
    // via schema.index() rather than the inline `unique: true` shorthand so
    // the index is created predictably at connection time.
    slug: {
      type:      String,
      required:  true,
      lowercase: true,
      trim:      true,
    },

    overview: {
      type:      String,
      required:  [true, "Overview is required"],
      maxlength: [160, "Overview must not exceed 160 characters (meta description limit)"],
      trim:      true,
    },

    content: {
      type:     String,
      required: [true, "Content is required"],
    },

    image: {
      type:     imageSchema,
      required: [true, "Image is required"],
    },

    author: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: [true, "Author is required"],
    },

    tags: {
      type:     [String],
      required: [true, "At least one tag is required"],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message:   "Tags must contain at least one entry",
      },
    },

    seo: { type: seoSchema, default: () => ({}) },
    og:  { type: ogSchema,  default: () => ({}) },

    status: {
      type:    String,
      enum:    ["draft", "published"] as const,
      default: "draft",
    },

    readingTime: { type: Number, default: 0 },
  },
  {
    timestamps: true, // auto-generates createdAt + updatedAt
  },
);

// Unique index on slug — declared here so Mongoose creates it reliably.
postSchema.index({ slug: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// Helpers (module-scoped; no `any`)
// ---------------------------------------------------------------------------

/** Converts a title into a URL-safe lowercase slug. */
function toSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function clamp(value: string, max: number): string {
  return value.slice(0, max);
}

// ---------------------------------------------------------------------------
// Pre-save hook (async — errors thrown here are forwarded automatically)
// ---------------------------------------------------------------------------

postSchema.pre("save", async function () {
  // Slug generation: only recalculate when the document is new or the title
  // has been modified, so existing URLs aren't broken by unrelated updates.
  if (this.isNew || this.isModified("title")) {
    const generated = toSlug(this.title);
    if (!generated) throw new Error("Slug could not be generated from title");
    this.slug = generated;
  }

  // SEO metadata fallback logic: if the author left metaTitle / metaDescription
  // empty, derive sensible defaults from the post's own title and overview so
  // every published page has meaningful meta tags without extra manual work.
  const seo = this.seo ?? {};

  if (!seo.metaTitle || seo.metaTitle.trim() === "") {
    seo.metaTitle = clamp(this.title.trim(), 60);
  }
  if (!seo.metaDescription || seo.metaDescription.trim() === "") {
    seo.metaDescription = clamp(this.overview.trim(), 160);
  }

  this.seo = seo;
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PostType     = InferSchemaType<typeof postSchema>;
export type PostDocument = PostType & Document;

// ---------------------------------------------------------------------------
// Model (hot-reload guard for Next.js dev server)
// ---------------------------------------------------------------------------

const Post = (models.Post as Model<PostType> | undefined) ?? model<PostType>("Post", postSchema);

export default Post;
