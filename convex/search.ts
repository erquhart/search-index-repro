import { query, mutation, QueryCtx } from "./_generated/server";

export const seed = mutation({
  handler: async (ctx) => {
    await ctx.db.insert("documents", {
      search: "search string",
      first: "a",
      second: "a",
      third: "a",
    });
    await ctx.db.insert("documents", {
      search: "search string",
      first: "a",
      second: "a",
      third: "b",
    });
    await ctx.db.insert("documents", {
      search: "search string",
      first: "a",
      second: "b",
      third: "b",
    });
    await ctx.db.insert("documents", {
      search: "search string",
      first: "b",
      second: "b",
      third: "b",
    });
  },
});

const test = async (
  ctx: QueryCtx,
  opts: { filters: string[]; expectedCount: number; comment: string },
) => {
  const result = await ctx.db
    .query("documents")
    .withSearchIndex("search", (q) => {
      return q
        .search("search", "search")
        .eq("first", opts.filters[0])
        .eq("second", opts.filters[1])
        .eq("third", opts.filters[2]);
    })
    .collect();
  console.log("--------------------------------");
  console.log(
    `filters: { first: ${opts.filters[0]}, second: ${opts.filters[1]}, third: ${opts.filters[2]} }`,
  );
  console.log(opts.comment);
  console.log(
    "result:",
    result.map((doc) => ({
      first: doc.first,
      second: doc.second,
      third: doc.third,
    })),
  );
};

export const search = query({
  handler: async (ctx) => {
    await test(ctx, {
      filters: ["a", "a", "a"],
      expectedCount: 1,
      comment: "no filters ignored because each matches at least one document",
    });
    await test(ctx, {
      filters: ["b", "b", "b"],
      expectedCount: 1,
      comment: "no filters ignored because each matches at least one document",
    });
    await test(ctx, {
      filters: ["a", "a", "c"],
      expectedCount: 0,
      comment: "third filter ignored because no document matches it",
    });
    await test(ctx, {
      filters: ["a", "c", "c"],
      expectedCount: 0,
      comment:
        "second and third filters ignored because no document matches them",
    });
  },
});
