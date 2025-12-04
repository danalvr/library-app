import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/templates/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Books from "./pages/books/Books";
import Members from "./pages/members/Members";
import Borrowings from "./pages/borrowings/Borrowings";

export const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
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
