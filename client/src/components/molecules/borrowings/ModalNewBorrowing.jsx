import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

import BaseModal from "../../elements/BaseModal";

import { fetchAllBooks } from "../../../api/books";
import { fetchAllMembers } from "../../../api/members";
import { createBorrowing } from "../../../api/borrowings";

const ModalNewBorrowing = ({ open, onClose, onSuccess }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    bookId: null,
    memberId: null,
    dueDate: null,
  });

  const toastRef = useRef(null);

  useEffect(() => {
    if (open) {
      loadBooks();
      loadMembers();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setForm({
      bookId: null,
      memberId: null,
      dueDate: null,
    });
  };

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

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    if (!form.bookId || !form.memberId || !form.dueDate) {
      toastRef.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "All fields are required",
      });
      return;
    }

    setLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (form.dueDate < today) {
      toastRef.current.show({
        severity: "warn",
        summary: "Invalid Date",
        detail: "Due date cannot be earlier than today",
      });
      return;
    }

    const payload = {
      bookId: form.bookId,
      memberId: form.memberId,
      dueDate: form.dueDate,
    };

    try {
      await createBorrowing(payload);
      toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Borrowing saved",
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toastRef.current.show({
        severity: "error",
        summary: "Failed",
        detail: err?.response?.data?.message || "Error saving borrowing",
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
          <h1 className="text-xl font-semibold">Add New Borrowing</h1>
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
            placeholder="pick a due date"
            className="w-full"
            minDate={new Date()}
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="mt-2 w-full flex items-center justify-end">
          <Button
            label="Add Borrowing"
            size="small"
            onClick={handleSave}
            loading={loading}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalNewBorrowing;
