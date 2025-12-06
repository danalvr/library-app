const { z } = require("zod");

exports.createMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Email is invalid"),
  phone: z.string().min(1, "Phone is required"),
});

exports.updateMemberSchema = exports.createMemberSchema.partial();
