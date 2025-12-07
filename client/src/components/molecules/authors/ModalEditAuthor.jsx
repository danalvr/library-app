import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import BaseModal from "../../elements/BaseModal";

import { getAuthorById, updateAuthor } from "../../../api/authors";

const ModalEditAuthor = ({ open, onClose, selectedId, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDetail = async () => {
    if (!selectedId) return;
    try {
      const res = await getAuthorById(selectedId);
      setName(res.name);
    } catch (err) {
      alert("Failed to load author data");
    }
  };

  useEffect(() => {
    if (open) loadDetail();
  }, [open, selectedId]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      await updateAuthor(selectedId, { name });
      onClose();
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update author");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <BaseModal open={open}>
      <div className="modal-main fixed w-full h-full md:h-[500px] md:w-[690px] px-8 py-8 top-0 md:top-25 left-0 md:left-[25%] flex flex-col items-center rounded-xl bg-white overflow-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Author</h1>
          <span
            className="cursor-pointer hover:bg-[#eae9e9] hover:rounded-full p-2"
            onClick={onClose}
          >
            {/* <img src={icons.close} width={28} alt="icon close" /> */}
            <i className="pi pi-times" style={{ color: "black" }}></i>
          </span>
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Name
          </label>
          <InputText
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="type the title..."
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="w-full flex items-center justify-end">
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

export default ModalEditAuthor;
