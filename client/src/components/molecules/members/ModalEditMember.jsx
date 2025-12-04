import React, { useState } from "react";
import BaseModal from "../../elements/BaseModal";
import Input from "../../elements/Input";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const ModalEditMember = ({ open, onClose }) => {
  const [event, setEvent] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (href) => {
    navigate(href);
  };

  const handleChange = (e) => {
    setEvent(e.target.value);
  };

  const handleSave = () => {
    // onClose();
    // handleNavigate("/generate/1");
    // dispatch(setEventName(event));
  };
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
            <i className="pi pi-times" style={{ color: "green" }}></i>
          </span>
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Name
          </label>
          <InputText className="w-full" placeholder="type the name..." />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Email
          </label>
          <InputText className="w-full" placeholder="type the email..." />
        </div>
        <div className="mt-5 w-full">
          <label htmlFor="new-certificate" className="text-base font-medium">
            Phone
          </label>
          <InputText className="w-full" placeholder="type the phone..." />
        </div>
        <hr className="mt-3 mb-5 w-full border-none bg-[#D8DCDF] h-[1px]" />
        <div className="mt-2 w-full flex items-center justify-end">
          <Button label="Edit Member" size="small" />
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalEditMember;
