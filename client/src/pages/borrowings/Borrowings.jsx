import { useEffect, useState, useRef } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import ModalNewBorrowing from "../../components/molecules/borrowings/ModalNewBorrowing";
import ModalEditBorrowing from "../../components/molecules/borrowings/ModalEditBorrowing";

import { fetchBorrowings, deleteBorrowing } from "../../api/borrowings";

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [searchBy, setSearchBy] = useState("book");
  const [keyword, setKeyword] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

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

  useEffect(() => {
    loadBorrowings();
  }, []);

  const filterOptions = [
    { label: "Book Title", value: "book" },
    { label: "Member Name", value: "member" },
    { label: "Borrow Date", value: "date" },
  ];

  const toggleModal = (category, id = null) => {
    if (id) setSelectedId(id);
    setShowModal((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const loadBorrowings = async (page = pagination.page) => {
    try {
      setLoading(true);

      const kw =
        searchBy === "date" && searchDate
          ? searchDate.toISOString().split("T")[0]
          : keyword;

      const res = await fetchBorrowings(page, pagination.limit, searchBy, kw);

      setBorrowings(res.data);
      setPagination((prev) => ({
        ...prev,
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to load borrowings");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    BORROWED: "bg-blue-500 text-white",
    OVERDUE: "bg-red-500 text-white",
    RETURNED: "bg-green-500 text-white",
    RETURNED_LATE: "bg-orange-500 text-white",
  };

  const onDelete = (id) => {
    confirmDialog({
      message: "Are you sure to delete this borrowing record?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteBorrowing(id);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Borrowing removed successfully",
        life: 2000,
      });
      loadBorrowings();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to delete borrowing",
        life: 2000,
      });
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="w-full border border-slate-200 p-4 rounded-md shadow-md">
      <Toast ref={toast} />
      <ConfirmDialog />
      <ModalNewBorrowing
        open={showModal.create}
        onClose={() => toggleModal("create")}
        onSuccess={loadBorrowings}
      />
      <ModalEditBorrowing
        open={showModal.edit}
        onClose={() => toggleModal("edit")}
        onSuccess={loadBorrowings}
        selectedId={selectedId}
      />
      <h1 className="text-2xl font-semibold mb-2">List Borrow Management</h1>
      <div className="w-full flex items-center justify-between">
        <Button
          icon="pi pi-plus"
          onClick={() => toggleModal("create")}
          className="flex items-center gap-2"
          size="small"
        >
          New Borrowing
        </Button>
        <div className="flex items-center gap-1">
          <Dropdown
            key={`dropdown-${searchBy}`}
            options={filterOptions}
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.value);
              setKeyword("");
              setSearchDate(null);
            }}
            className="w-40"
          />
          {searchBy === "date" ? (
            <Calendar
              key="date-picker"
              value={searchDate}
              onChange={(e) => setSearchDate(e.value)}
              dateFormat="yy-mm-dd"
              placeholder="Select date"
              className="w-full"
            />
          ) : (
            <InputText
              key="text-search"
              type="text"
              placeholder="Search..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadBorrowings(1)}
            />
          )}

          <Button
            size="small"
            severity="secondary"
            icon="pi pi-search"
            onClick={() => loadBorrowings(1)}
          />
        </div>
      </div>
      <div class="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="bg-neutral-secondary-soft border-b border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Member
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Book
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Borrow Date
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Due Date
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Status
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : borrowings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No borrowings
                </td>
              </tr>
            ) : (
              borrowings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-default odd:bg-neutral-primary even:bg-neutral-secondary-soft"
                >
                  <td className="px-6 py-4">{b.member.name}</td>
                  <td className="px-6 py-4">{b.book.title}</td>
                  <td className="px-6 py-4">
                    {new Date(b.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(b.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        statusColor[b.status]
                      }`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      size="small"
                      severity="warning"
                      icon="pi pi-pencil"
                      onClick={() => {
                        setSelectedId(b.id);
                        toggleModal("edit");
                      }}
                    ></Button>
                    <Button
                      size="small"
                      severity="danger"
                      icon="pi pi-trash"
                      onClick={() => onDelete(b.id)}
                    ></Button>
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
            label="Previous"
            size="small"
            disabled={pagination.page === 1}
            onClick={() => loadBorrowings(pagination.page - 1)}
            className="!px-3 !py-1"
          />

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isActive = pagination.page === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => loadBorrowings(pageNum)}
                className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${
              isActive
                ? "bg-neutral-700 text-white"
                : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-200"
            }
          `}
              >
                {pageNum}
              </button>
            );
          })}

          <Button
            label="Next"
            size="small"
            disabled={pagination.page === totalPages}
            onClick={() => loadBorrowings(pagination.page + 1)}
            className="!px-3 !py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Borrowings;
