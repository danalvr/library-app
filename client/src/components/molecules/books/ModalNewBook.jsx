import { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import BaseModal from "../../elements/BaseModal";

import { createBook } from "../../../api/books";
import { fetchAllAuthors } from "../../../api/authors";

const ModalNewBook = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const [category, setCategory] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [description, setDescription] = useState("");

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    if (open) loadAuthors();
  }, [open]);

  const loadAuthors = async () => {
    try {
      const res = await fetchAllAuthors();
      setAuthors(res);
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to load books",
        life: 2000,
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setAuthorId(null);
    setCategory("");
    setPublishingYear("");
    setDescription("");
  };

  const handleSave = async () => {
    if (!title.trim() || !authorId || !publishingYear.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Title, Author & Publishing Year required",
        life: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      await createBook({
        title,
        authorId,
        category,
        publishingYear: Number(publishingYear),
        description,
      });

      resetForm();
      onClose();
      onSuccess("Book created successfully!");
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to create book",
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <BaseModal open={open}>
      <Toast ref={toast} />
      <div className="modal-main fixed w-full h-full md:h-[500px] md:w-[690px] px-8 py-8 top-0 md:top-25 left-0 md:left-[25%] flex flex-col items-center rounded-xl bg-white overflow-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Add New Book</h1>
          <span
            className="cursor-pointer hover:bg-[#eae9e9] hover:rounded-full p-2"
            onClick={onClose}
          >
            <i className="pi pi-times" style={{ color: "black" }}></i>
          </span>
        </div>

        <div className="mt-5 w-full">
          <label className="text-base font-medium">Title</label>
          <InputText
            className="w-full mt-2"
            placeholder="type the title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mt-5 w-full">
          <label className="text-base font-medium">Author</label>
          <Dropdown
            value={authorId}
            options={authors}
            optionLabel="name"
            optionValue="id"
            placeholder="Select an author"
            className="w-full mt-2"
            onChange={(e) => setAuthorId(e.value)}
          />
        </div>

        <div className="mt-5 w-full">
          <label className="text-base font-medium">Category</label>
          <InputText
            className="w-full mt-2"
            value={category}
            placeholder="type the category..."
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="mt-5 w-full">
          <label className="text-base font-medium">Publishing Year</label>
          <InputText
            className="w-full mt-2"
            placeholder="type the publishing year..."
            value={publishingYear}
            onChange={(e) => setPublishingYear(e.target.value)}
          />
        </div>

        <div className="mt-5 w-full">
          <label className="text-base font-medium">Description</label>
          <InputTextarea
            className="w-full mt-2"
            value={description}
            placeholder="type the description..."
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="w-full flex items-center justify-end">
          <Button
            label={loading ? "Saving..." : "Add Book"}
            size="small"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalNewBook;
