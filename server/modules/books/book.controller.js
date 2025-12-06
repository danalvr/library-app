const { bookService } = require("./book.service");
const { createBookSchema, updateBookSchema } = require("./book.validation");

exports.bookController = {
  async list(req, res, next) {
    try {
      const result = await bookService.list(req.query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async detail(req, res, next) {
    try {
      const book = await bookService.getDetail(Number(req.params.id));
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const dto = createBookSchema.parse(req.body);
      const created = await bookService.create(dto);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      if (!Object.keys(req.body).length) {
        return res.status(400).json({ message: "No data provided to update" });
      }

      const book = await bookService.getDetail(Number(req.params.id));
      if (!book) return res.status(404).json({ message: "Book not found" });

      const dto = updateBookSchema.parse(req.body);
      const updated = await bookService.update(Number(req.params.id), dto);
      res.json(updated);
    } catch (err) {
      console.log("TEST LAGI", err);
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      const book = await bookService.getDetail(Number(req.params.id));
      if (!book) return res.status(404).json({ message: "Book not found" });

      await bookService.delete(Number(req.params.id));
      res.json({ message: "Book deleted" });
    } catch (err) {
      next(err);
    }
  },
};
