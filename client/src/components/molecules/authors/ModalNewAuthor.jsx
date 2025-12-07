import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import BaseModal from "../../elements/BaseModal";

import { createAuthor } from "../../../api/authors";

const ModalNewAuthor = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      await createAuthor({ name });
      setName("");
      onClose();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create author");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <BaseModal open={open}>
      <div className="modal-main fixed w-full h-full md:h-[500px] md:w-[690px] px-8 py-8 top-0 md:top-25 left-0 md:left-[25%] flex flex-col items-center rounded-xl bg-white overflow-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Add New Author</h1>
          <span
            className="cursor-pointer hover:bg-[#eae9e9] hover:rounded-full p-2"
            onClick={onClose}
          >
            <i className="pi pi-times" style={{ color: "black" }}></i>
          </span>
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Name
          </label>
          <InputText
            className="w-full"
            placeholder="type the title..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="mt-2 w-full flex items-center justify-end">
          <Button
            label={loading ? "Saving..." : "Add Author"}
            size="small"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalNewAuthor;
