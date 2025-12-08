var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const { ZodError } = require("zod");

var indexRouter = require("./routes/index");
var dashboardRouter = require("./modules/dashboards/dashboard.routes");
var authorRouter = require("./modules/authors/author.routes");
var bookRouter = require("./modules/books/book.routes");
var memberRouter = require("./modules/members/member.routes");
var borrowingRouter = require("./modules/borrowings/borrowing.routes");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
    "OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", indexRouter);
app.use("/dashboards", dashboardRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/members", memberRouter);
app.use("/borrowings", borrowingRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle Zod validation error
  if (err instanceof ZodError) {
    const formattedErrors = {};
    err.errors.forEach((issue) => {
      formattedErrors[issue.path[0]] = issue.message;
    });

    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  // Default error handling
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
