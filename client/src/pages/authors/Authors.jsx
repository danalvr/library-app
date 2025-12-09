import { useEffect, useRef, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import ModalNewAuthor from "../../components/molecules/authors/ModalNewAuthor";
import ModalEditAuthor from "../../components/molecules/authors/ModalEditAuthor";

import { fetchAuthors, deleteAuthor } from "../../api/authors";

import { wait } from "../../utils";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
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
      navigate("/authors", { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    loadAuthors(1);
  }, []);

  const toggleModal = (category) => {
    setShowModal((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const loadAuthors = async (page = pagination.page) => {
    try {
      setLoading(true);
      const resPromise = await fetchAuthors(page, pagination.limit);

      const [res] = await Promise.all([resPromise, wait(300)]);

      setAuthors(res.data);
      setPagination((prev) => ({
        ...prev,
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
      }));
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load authors",
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this author?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
      reject: () => {},
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteAuthor(id);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Author deleted successfully",
        life: 2000,
      });
      loadAuthors();
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
          <Skeleton width="60%" height="1rem" />
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
      <ModalNewAuthor
        open={showModal.create}
        onClose={() => toggleModal("create")}
        onSuccess={(msg) => {
          loadAuthors();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: msg,
            life: 2000,
          });
        }}
      />
      <ModalEditAuthor
        open={showModal.edit}
        onClose={() => toggleModal("edit")}
        selectedId={selectedId}
        onSuccess={(msg) => {
          loadAuthors();
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: msg,
            life: 2000,
          });
        }}
      />
      <h1 className="text-2xl font-semibold mb-2">List Authors</h1>
      <Button
        icon="pi pi-plus"
        onClick={() => toggleModal("create")}
        className="flex items-center gap-2"
        size="small"
      >
        Add New Authors
      </Button>
      <div class="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="bg-slate-200 border-b border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Name
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : authors.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4">
                  No authors found.
                </td>
              </tr>
            ) : (
              authors.map((author) => (
                <tr
                  key={author.id}
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                >
                  <td className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    {author.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="small"
                        severity="warning"
                        icon="pi pi-pencil"
                        outlined
                        onClick={() => {
                          setSelectedId(author.id);
                          toggleModal("edit");
                        }}
                      ></Button>
                      <Button
                        size="small"
                        severity="danger"
                        icon="pi pi-trash"
                        outlined
                        onClick={() => onDelete(author.id)}
                      ></Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col-reverse gap-2 items-center justify-between md:flex-row md:gap-0">
        <p className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-double-left"
            size="small"
            outlined
            disabled={pagination.page === 1}
            onClick={() => loadAuthors(pagination.page - 1)}
            className="!px-3 !py-1"
          />

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isActive = pagination.page === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => loadAuthors(pageNum)}
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
            onClick={() => loadAuthors(pagination.page + 1)}
            className="!px-3 !py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Authors;
