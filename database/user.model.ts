import {
  model,
  models,
  Schema,
  type Document,
  type InferSchemaType,
  type Model,
} from "mongoose";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const userSchema = new Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },

    email: {
      type:     String,
      required: [true, "Email is required"],
      unique:   true, // enforced at the DB level via a unique index
      trim:     true,
      lowercase: true,
      // Format validation: a lightweight regex that catches the most common
      // malformed addresses without pulling in a third-party library.
      // Uniqueness is already enforced by the DB unique index above, so this
      // validator covers only the format check.
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message:   "Please provide a valid email address",
      },
    },

    password: {
      type:     String,
      required: [true, "Password is required"],
      // Raw passwords must never reach the DB — hashing is the responsibility
      // of the service/action layer before calling .save().
    },

    role: {
      type:    String,
      enum:    ["admin"] as const, // only admin users exist in this system
      default: "admin",
    },
  },
  {
    timestamps: true, // auto-generates createdAt + updatedAt
  },
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserType     = InferSchemaType<typeof userSchema>;
export type UserDocument = UserType & Document;

// ---------------------------------------------------------------------------
// Model (hot-reload guard for Next.js dev server)
// ---------------------------------------------------------------------------

const User = (models.User as Model<UserType> | undefined) ?? model<UserType>("User", userSchema);

export default User;
