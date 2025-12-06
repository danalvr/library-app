const { z } = require("zod");

exports.createAuthorSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

exports.updateAuthorSchema = exports.createAuthorSchema.partial();
