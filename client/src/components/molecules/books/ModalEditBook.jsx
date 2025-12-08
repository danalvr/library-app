import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import BaseModal from "../../elements/BaseModal";

import { getBookById, updateBook } from "../../../api/books";
import { fetchAllAuthors } from "../../../api/authors";

const ModalEditBook = ({ open, onClose, selectedId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState(null);
  const [category, setCategory] = useState("");
  const [publishingYear, setPublishingYear] = useState("");
  const [description, setDescription] = useState("");

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setPublishingYear("");
    setDescription("");
    setAuthorId(null);
  };

  const loadAuthors = async () => {
    try {
      const res = await fetchAllAuthors();
      setAuthors(res);
    } catch (err) {
      console.error("Failed load authors");
    }
  };

  const loadDetail = async () => {
    if (!selectedId) return;
    try {
      const res = await getBookById(selectedId);
      const data = res;

      setTitle(data.title);
      setCategory(data.category);
      setPublishingYear(data.publishingYear);
      setDescription(data.description || "");
      setAuthorId(data.author.id);
    } catch (err) {
      alert("Failed load book data");
    }
  };

  useEffect(() => {
    if (open) {
      loadAuthors();
      loadDetail();
    } else {
      resetForm();
    }
  }, [open, selectedId]);

  const handleSave = async () => {
    if (!title.trim() || !authorId || !publishingYear) {
      alert("Title, Author & Publishing Year required");
      return;
    }

    try {
      setLoading(true);
      await updateBook(selectedId, {
        title,
        category,
        publishingYear: Number(publishingYear),
        description,
        authorId,
      });

      onClose();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <BaseModal open={open}>
      <div className="modal-main fixed w-full h-full md:h-[500px] md:w-[690px] px-8 py-8 top-0 md:top-25 left-0 md:left-[25%] flex flex-col items-center rounded-xl bg-white overflow-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Book</h1>
          <span
            className="cursor-pointer hover:bg-[#eae9e9] hover:rounded-full p-2"
            onClick={onClose}
          >
            <i className="pi pi-times" style={{ color: "black" }}></i>
          </span>
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Title
          </label>
          <InputText
            className="w-full"
            placeholder="type the title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Author
          </label>
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
          <label htmlFor="new-certificate" className="text-base font-medium">
            Category
          </label>
          <InputText
            className="w-full"
            placeholder="type the category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Publishing Year
          </label>
          <InputText
            className="w-full"
            placeholder="type the publishing year..."
            value={publishingYear}
            onChange={(e) => setPublishingYear(e.target.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Description
          </label>
          <InputTextarea
            className="w-full"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="w-full flex justify-end">
          <Button
            label={loading ? "Saving..." : "Save Changes"}
            size="small"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalEditBook;
