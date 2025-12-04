import { useState } from "react";
import { Button } from "primereact/button";

import ModalNewBook from "../../components/molecules/books/ModalNewBook";
import ModalEditBook from "../../components/molecules/books/ModalEditBook";

const Books = () => {
  const [showModal, setShowModal] = useState({
    create: false,
    edit: false,
  });

  const toggleModal = (category) => {
    setShowModal((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="w-full border border-slate-200 p-4 rounded-md shadow-md">
      <ModalNewBook
        open={showModal.create}
        onClose={() => toggleModal("create")}
      />
      <ModalEditBook
        open={showModal.edit}
        onClose={() => toggleModal("edit")}
      />
      <h1 className="text-2xl font-semibold mb-2">List Books</h1>
      <Button
        icon="pi pi-plus"
        onClick={() => toggleModal("create")}
        className="flex items-center gap-2"
        size="small"
      >
        Add New Book
      </Button>
      <div class="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="bg-neutral-secondary-soft border-b border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Title
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Author
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Publishing Year
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-heading whitespace-nowrap"
              >
                Apple MacBook Pro 17"
              </th>
              <td class="px-6 py-4">Silver</td>
              <td class="px-6 py-4">Laptop</td>
              <td class="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    size="small"
                    severity="warning"
                    icon="pi pi-pencil"
                    onClick={() => toggleModal("edit")}
                  ></Button>
                  <Button
                    size="small"
                    severity="danger"
                    icon="pi pi-trash"
                  ></Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-2 p-2 flex items-center justify-between">
        <div>
          <p>1-4 of 4</p>
        </div>
        <div className="flex items-center gap-2">
          <p>Previous</p>
          <p>1</p>
          <p>Next</p>
        </div>
      </div>
    </div>
  );
};

export default Books;
