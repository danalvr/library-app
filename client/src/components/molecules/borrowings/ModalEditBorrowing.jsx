import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import BaseModal from "../../elements/BaseModal";

import {
  getBorrowingById,
  updateBorrowing,
  returnBorrowing,
} from "../../../api/borrowings";
import { fetchAllBooks } from "../../../api/books";
import { fetchAllMembers } from "../../../api/members";

const ModalEditBorrowing = ({ open, onClose, selectedId, onSuccess }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bookId: null,
    memberId: null,
    dueDate: null,
    status: null,
  });

  const toastRef = useRef(null);

  useEffect(() => {
    if (open && selectedId) {
      loadBooks();
      loadMembers();
      loadDetail();
    }
  }, [open, selectedId]);

  const loadBooks = async () => {
    try {
      const data = await fetchAllBooks();
      setBooks(data);
    } catch {
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Failed to load books",
      });
    }
  };

  const loadMembers = async () => {
    try {
      const data = await fetchAllMembers();
      setMembers(data);
    } catch {
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Failed to load members",
      });
    }
  };

  const loadDetail = async () => {
    try {
      const data = await getBorrowingById(selectedId);
      setForm({
        bookId: data.book.id,
        memberId: data.member.id,
        dueDate: new Date(data.dueDate),
        status: data.status,
      });
    } catch {
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Unable to load borrowing detail",
      });
    }
  };

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (form.dueDate < today) {
      toastRef.current.show({
        severity: "warn",
        summary: "Invalid",
        detail: "Due date cannot be earlier than today",
      });
      return;
    }

    setLoading(true);

    const payload = {
      bookId: form.bookId,
      memberId: form.memberId,
      dueDate: form.dueDate,
    };

    try {
      await updateBorrowing(selectedId, payload);

      toastRef.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Borrowing updated",
      });

      onClose();
      if (onSuccess) onSuccess("Borrowing updated successfully!");
    } catch {
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    setLoading(true);

    const payload = {
      bookId: form.bookId,
      memberId: form.memberId,
      return: true,
    };

    try {
      await returnBorrowing(selectedId, payload);

      toastRef.current.show({
        severity: "success",
        summary: "Returned",
        detail: "Book returned successfully",
      });

      onClose();
      if (onSuccess) onSuccess("Returning successfully!");
    } catch {
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Return failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={open}>
      <Toast ref={toastRef} />
      <div className="modal-main fixed w-full h-full md:h-[500px] md:w-[690px] px-8 py-8 top-0 md:top-25 left-0 md:left-[25%] flex flex-col items-center rounded-xl bg-white overflow-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Borrowing</h1>
          <span
            className="cursor-pointer hover:bg-[#eae9e9] hover:rounded-full p-2"
            onClick={onClose}
          >
            <i className="pi pi-times" style={{ color: "black" }}></i>
          </span>
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Book
          </label>
          <Dropdown
            value={form.bookId}
            options={books}
            optionLabel="title"
            optionValue="id"
            placeholder="Select a book"
            className="w-full mt-2"
            onChange={(e) => handleChange("bookId", e.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Member
          </label>
          <Dropdown
            value={form.memberId}
            options={members}
            optionLabel="name"
            optionValue="id"
            placeholder="Select a member"
            className="w-full mt-2"
            onChange={(e) => handleChange("memberId", e.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Due Date
          </label>
          <Calendar
            showIcon
            value={form.dueDate}
            onChange={(e) => handleChange("dueDate", e.value)}
            minDate={new Date()}
            className="w-full"
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="mt-2 w-full flex gap-3 justify-end">
          {["BORROWED", "OVERDUE"].includes(form.status) && (
            <Button
              label="Return Book"
              severity="warning"
              size="small"
              onClick={handleReturn}
              loading={loading}
            />
          )}

          <Button
            label="Save Changes"
            size="small"
            onClick={handleSave}
            loading={loading}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalEditBorrowing;
