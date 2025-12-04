import React from "react";

const BaseModal = ({ open, children }) => {
  return (
    <div
      className={`${"fixed top-0 left-0 z-222 w-full h-full bg-black/75 font-dm-sans"} ${
        open ? "block" : "hidden"
      }`}
    >
      {children}
    </div>
  );
};

export default BaseModal;
