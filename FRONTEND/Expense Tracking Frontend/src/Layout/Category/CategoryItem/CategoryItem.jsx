import React from "react";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { deleteCategory } from "../../../Services/categoryServices";
import "./CategoryItem.css";
import { useNavigate } from "react-router-dom";

function CategoryItem({ name, id, updateRefresh }) {
  const options = {
    title: "Delete Category",
    message: "Are you sure you want to delete this category?",
    buttons: [
      {
        label: "Yes",
        onClick: async () => {
          try {
            await deleteCategory(id);
            toast.success("Category Deleted.");
            updateRefresh();
          } catch (error) {
            toast.error("Failed to delete category.");
          }
        },
      },
      {
        label: "No",
        onClick: () => {
          return;
        },
      },
    ],
    closeOnEscape: true,
    closeOnClickOutside: true,
    keyCodeForClose: [8, 32],
    overlayClassName: "overlay-custom-class-name",
  };

  const handleDelete = () => {
    confirmAlert(options);
  };
  const navigate = useNavigate();
  const handleUpdate = () => {
    navigate(`/category/update_category?id=${id}&name=${name}`);
  };

  return (
    <>
      <span>{name}</span>
      <div className="controls ms-auto">
        <Button variant="danger" className="btn-sm me-2" onClick={handleDelete}>
          <i className="bi bi-trash"></i>
        </Button>

        <Button variant="warning" className="btn-sm" onClick={handleUpdate}>
          <i className="bi bi-pencil"></i>
        </Button>
      </div>
    </>
  );
}

export default CategoryItem;
