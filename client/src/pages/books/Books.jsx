import { useEffect, useState, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";

import ModalNewBook from "../../components/molecules/books/ModalNewBook";
import ModalEditBook from "../../components/molecules/books/ModalEditBook";

import { fetchBooks, deleteBook } from "../../api/books";

import { wait } from "../../utils";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState({
    create: false,
    edit: false,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    total: 0,
  });

  const toast = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const isCreate = q.get("modal") === "create";

    if (isCreate) {
      setShowModal((prev) => ({ ...prev, create: true }));
      navigate("/books", { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    loadBooks();
  }, []);

  const toggleModal = (category) => {
    setShowModal((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const loadBooks = async (page = pagination.page) => {
    try {
      setLoading(true);
      const resPromise = await fetchBooks(page, pagination.limit);

      const [res] = await Promise.all([resPromise, wait(500)]);

      setBooks(res.data);
      setPagination((prev) => ({
        ...prev,
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to load authors");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this book?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
      reject: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Author deleted successfully",
        life: 2000,
      });
      loadBooks();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to delete author",
        life: 2000,
      });
    }
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.limit }).map((_, idx) => (
      <tr key={`skeleton-${idx}`} className="border-b border-default">
        <td className="px-6 py-4">
          <Skeleton width="70%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="50%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="40%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <Skeleton shape="circle" width="2rem" height="2rem" />
            <Skeleton shape="circle" width="2rem" height="2rem" />
          </div>
        </td>
      </tr>
    ));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="w-full border border-slate-200 p-4 rounded-md shadow-md">
      <Toast ref={toast} />
      <ConfirmDialog />
      <ModalNewBook
        open={showModal.create}
        onClose={() => toggleModal("create")}
        onSuccess={loadBooks}
      />
      <ModalEditBook
        open={showModal.edit}
        onClose={() => toggleModal("edit")}
        selectedId={selectedId}
        onSuccess={loadBooks}
      />
      <h1 className="text-2xl font-semibold mb-2">List Books</h1>
      <Button
        icon="pi pi-plus"
        onClick={() => toggleModal("create")}
        className="flex items-center gap-2"
        size="small"
      >
        Add New Book
      </Button>
      <div class="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="bg-slate-200 border-b border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Title
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Author
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Publishing Year
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : books.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr
                  key={b.id}
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                >
                  <td className="px-6 py-4 font-medium text-heading">
                    {b.title}
                  </td>
                  <td className="px-6 py-4">{b.author?.name}</td>
                  <td className="px-6 py-4">{b.publishingYear}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        icon="pi pi-pencil"
                        severity="warning"
                        size="small"
                        outlined
                        onClick={() => {
                          setSelectedId(b.id);
                          toggleModal("edit");
                        }}
                      />
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        outlined
                        onClick={() => onDelete(b.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-double-left"
            size="small"
            outlined
            disabled={pagination.page === 1}
            onClick={() => loadBooks(pagination.page - 1)}
            className="!px-3 !py-1"
          />

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isActive = pagination.page === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => loadBooks(pageNum)}
                className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${
              isActive
                ? "bg-cyan text-white"
                : "bg-white text-slate-700 border border-neutral-300 hover:bg-neutral-200"
            }
          `}
              >
                {pageNum}
              </button>
            );
          })}

          <Button
            icon="pi pi-angle-double-right"
            size="small"
            outlined
            disabled={pagination.page === totalPages}
            onClick={() => loadBooks(pagination.page + 1)}
            className="!px-3 !py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Books;
