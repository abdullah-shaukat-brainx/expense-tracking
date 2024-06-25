import React from "react";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { deleteExpense } from "../../../Services/expenseServices";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function ExpenseItem({
  date,
  amount,
  description,
  category_name,
  id,
  updateRefresh,
}) {
  const options = {
    title: "Delete Expense",
    message: "Are you sure you want to delete this expense?",
    buttons: [
      {
        label: "Yes",
        onClick: async () => {
          try {
            await deleteExpense(id);
            toast.success("Expense Deleted.");
            updateRefresh();
          } catch (error) {
            toast.error("Failed to delete expense.");
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
    navigate(`/expense/update_expense?id=${id}`);
  };
  return (
    <>
      <tr>
        <td>
          <span>{moment(date).format("D MMMM YYYY")}</span>
        </td>
        <td>
          <span>{amount}</span>
        </td>
        <td>
          <span>{description}</span>
        </td>
        <td>
          <span>{category_name}</span>
        </td>
        <td>
          <Button
            variant="danger"
            size="sm"
            className="me-2"
            onClick={handleDelete}
          >
            <i className="bi bi-trash"></i>
          </Button>
          <Button variant="warning" size="sm" onClick={handleUpdate}>
            <i className="bi bi-pencil"></i>
          </Button>
        </td>
      </tr>
    </>
  );
}

export default ExpenseItem;
