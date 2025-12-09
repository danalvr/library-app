import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/templates/Layout";

import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import Books from "./pages/books/Books";
import Members from "./pages/members/Members";
import Borrowings from "./pages/borrowings/Borrowings";
import Authors from "./pages/authors/Authors";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    id: "root",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "authors",
        children: [{ index: true, element: <Authors /> }],
      },
      {
        path: "books",
        children: [{ index: true, element: <Books /> }],
      },
      {
        path: "members",
        children: [{ index: true, element: <Members /> }],
      },
      {
        path: "borrowings",
        children: [{ index: true, element: <Borrowings /> }],
      },
    ],
  },
]);
