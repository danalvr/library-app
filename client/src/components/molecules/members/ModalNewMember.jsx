import { useRef, useState } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import BaseModal from "../../elements/BaseModal";

import { createMember } from "../../../api/members";

const ModalNewMember = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "Name and Email are required",
        life: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      await createMember({ name, email, phone });

      setName("");
      setEmail("");
      setPhone("");

      onClose();
      onSuccess("Member created successfully!");
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to create member",
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
          <h1 className="text-xl font-semibold">Add New Member</h1>
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
            placeholder="type the name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Email
          </label>
          <InputText
            className="w-full"
            placeholder="type the email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Phone
          </label>
          <InputText
            className="w-full"
            placeholder="type the phone..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />

        <div className="w-full flex items-center justify-end">
          <Button
            label={loading ? "Saving..." : "Add Member"}
            size="small"
            onClick={handleSave}
            disabled={loading}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalNewMember;
