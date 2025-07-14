import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    search: v.optional(v.string()),
    text: v.optional(v.string()),
    test: v.optional(v.string()),
    value: v.number(),
  }).searchIndex("search", {
    searchField: "search",
    filterFields: ["text", "test", "value"],
  }),
});
