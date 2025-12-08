import { useEffect, useState, useRef } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import ModalNewMember from "../../components/molecules/members/ModalNewMember";
import ModalEditMember from "../../components/molecules/members/ModalEditMember";

import { fetchMembers, deleteMember } from "../../api/members";

import { wait } from "../../utils";

const Members = () => {
  const [showModal, setShowModal] = useState({
    create: false,
    edit: false,
  });

  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    total: 0,
  });
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(false);

  const toast = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const isCreate = q.get("modal") === "create";

    if (isCreate) {
      setShowModal((prev) => ({ ...prev, create: true }));
      navigate("/members", { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    loadMembers(1);
  }, []);

  const toggleModal = (category) => {
    setShowModal((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const loadMembers = async (page = pagination.page) => {
    try {
      setLoading(true);
      const resPromise = await fetchMembers(page, pagination.limit);

      const [res] = await Promise.all([resPromise, wait(300)]);

      setMembers(res.data);
      setPagination({
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load members",
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (id) => {
    confirmDialog({
      message: "Are you sure want to delete this member?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMember(id);
      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Member deleted successfully",
      });
      loadMembers();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to delete member",
      });
    }
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.limit }).map((_, idx) => (
      <tr key={`skeleton-${idx}`} className="border-b border-default">
        <td className="px-6 py-4">
          <Skeleton width="70%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="90%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <Skeleton width="50%" height="1rem" />
        </td>
        <td className="px-6 py-4">
          <div className="flex gap-2">
            <Skeleton shape="circle" width="2rem" height="2rem" />
            <Skeleton shape="circle" width="2rem" height="2rem" />
          </div>
        </td>
      </tr>
    ));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="w-full border border-slate-200 p-4 rounded-md shadow-md">
      <Toast ref={toast} />
      <ConfirmDialog />

      <ModalNewMember
        open={showModal.create}
        onClose={() => toggleModal("create")}
        onSuccess={loadMembers}
      />

      <ModalEditMember
        open={showModal.edit}
        onClose={() => toggleModal("edit")}
        selectedId={selectedId}
        onSuccess={loadMembers}
      />

      <h1 className="text-2xl font-semibold mb-2">List Members</h1>
      <Button
        icon="pi pi-plus"
        onClick={() => toggleModal("create")}
        className="flex items-center gap-2"
        size="small"
      >
        Add New Member
      </Button>
      <div class="mt-5 relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
        <table class="w-full text-sm text-left rtl:text-right text-body">
          <thead class="bg-slate-200 border-b border-default">
            <tr>
              <th scope="col" class="px-6 py-3 font-medium">
                Name
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Email
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Phone
              </th>
              <th scope="col" class="px-6 py-3 font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeletonRows()
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4">
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m.id}
                  className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default"
                >
                  <td className="px-6 py-4 font-medium text-heading">
                    {m.name}
                  </td>
                  <td className="px-6 py-4">{m.email}</td>
                  <td className="px-6 py-4">{m.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="small"
                        severity="warning"
                        icon="pi pi-pencil"
                        outlined
                        onClick={() => {
                          setSelectedId(m.id);
                          toggleModal("edit");
                        }}
                      />
                      <Button
                        size="small"
                        severity="danger"
                        icon="pi pi-trash"
                        outlined
                        onClick={() => onDelete(m.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {pagination.page} of {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-angle-double-left"
            size="small"
            outlined
            disabled={pagination.page === 1}
            onClick={() => loadMembers(pagination.page - 1)}
            className="!px-3 !py-1"
          />

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isActive = pagination.page === pageNum;

            return (
              <button
                key={pageNum}
                onClick={() => loadMembers(pageNum)}
                className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${
              isActive
                ? "bg-cyan text-white"
                : "bg-white text-slate-700 border border-neutral-300 hover:bg-neutral-200"
            }
          `}
              >
                {pageNum}
              </button>
            );
          })}

          <Button
            icon="pi pi-angle-double-right"
            size="small"
            outlined
            disabled={pagination.page === totalPages}
            onClick={() => loadMembers(pagination.page + 1)}
            className="!px-3 !py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Members;
