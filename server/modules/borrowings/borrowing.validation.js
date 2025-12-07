const { z } = require("zod");

exports.borrowingCreateSchema = z.object({
  bookId: z.coerce.number(),
  memberId: z.coerce.number(),
  borrowDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  returnDate: z.coerce.date().optional(),
});

exports.borrowingUpdateSchema = z.object({
  bookId: z.coerce.number(),
  memberId: z.coerce.number(),
  borrowDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional(),
  status: z.string().optional(),
  return: z.boolean().optional(),
});
