const { z } = require("zod");

exports.createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authorId: z.number(),
  category: z.string({ required_error: "Category is required" }),
  publishingYear: z.number({ required_error: "Publishing year is required" }),
  description: z.string({ required_error: "Description is required" }),
});

exports.updateBookSchema = exports.createBookSchema.partial();
