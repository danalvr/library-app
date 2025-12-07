import { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import BaseModal from "../../elements/BaseModal";
import { getMemberById, updateMember } from "../../../api/members";

const ModalEditMember = ({ open, onClose, selectedId, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const loadDetail = async () => {
    if (!selectedId) return;
    try {
      const res = await getMemberById(selectedId);
      const data = res;

      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone || "");
    } catch (err) {
      console.error(err);
      alert("Failed to load member data");
    }
  };

  useEffect(() => {
    if (open) loadDetail();
  }, [open, selectedId]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert("Name & Email are required");
      return;
    }

    try {
      setLoading(true);
      await updateMember(selectedId, { name, email, phone });

      onClose();
      onSuccess(); // Refresh members list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <BaseModal open={open}>
      <div className="modal-main fixed w-full h-full md:h-[500px] md:w-[690px] px-8 py-8 top-0 md:top-25 left-0 md:left-[25%] flex flex-col items-center rounded-xl bg-white overflow-auto">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Edit Member</h1>
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

export default ModalEditMember;
