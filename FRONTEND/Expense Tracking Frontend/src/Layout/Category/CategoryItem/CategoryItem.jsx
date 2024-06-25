import React from "react";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { deleteCategory } from "../../../Reducers/categories/categorySlice";
import "./CategoryItem.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function CategoryItem({ name, id }) {
  const dispatch = useDispatch();
  const options = {
    title: "Delete Category",
    message: "Are you sure you want to delete this category?",
    buttons: [
      {
        label: "Yes",
        onClick: async () => {
          try {
            const response = dispatch(deleteCategory({ id }));
            if (response.error) toast.error("An error occoured!");
            else {
              toast.success("Category deleted successfully!");
            }
          } catch (error) {
            toast.error("Unexpected error occoured.");
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
      <tr>
        <td>
          <span>{name}</span>
        </td>
        <td>
          <Button
            variant="danger"
            className="btn-sm me-2"
            onClick={handleDelete}
          >
            <i className="bi bi-trash"></i>
          </Button>

          <Button variant="warning" className="btn-sm" onClick={handleUpdate}>
            <i className="bi bi-pencil"></i>
          </Button>
        </td>
      </tr>
    </>
  );
}

export default CategoryItem;
