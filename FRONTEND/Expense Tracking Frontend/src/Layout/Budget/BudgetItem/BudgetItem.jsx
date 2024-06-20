import React from "react";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { deleteBudget } from "../../../Services/budgetServices"; // Assuming you have a budget service
import { useNavigate } from "react-router-dom";
import moment from "moment";
function BudgetItem({ month, year, amount, id, updateRefresh }) {
  const options = {
    title: "Delete Budget",
    message: "Are you sure you want to delete this budget?",
    buttons: [
      {
        label: "Yes",
        onClick: async () => {
          try {
            await deleteBudget(id);
            toast.success("Budget Deleted.");
            updateRefresh();
          } catch (error) {
            toast.error("Failed to delete budget.");
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
    navigate(
      `/budget/update_budget?id=${id}&month=${month}&year=${year}&amount=${amount}`
    );
  };

  return (
    <tr>
      <td>{moment(month).format("MMMM YYYY")}</td>
      <td>{amount}</td>
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
  );
}

export default BudgetItem;
