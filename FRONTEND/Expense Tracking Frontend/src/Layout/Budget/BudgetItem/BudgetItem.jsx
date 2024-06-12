import React from "react";
import { Button } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { deleteBudget } from "../../../Services/budgetServices"; // Assuming you have a budget service
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

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
    <Row className="border p-3 mb-3 d-flex flex-row text-align-center">
      <Col xs={12} md={5}>
        <span>{month}</span>
      </Col>
      <Col xs={12} md={5}>
        <span>{amount}</span>
      </Col>
      <Col xs={12} md={2} className="mt-3 mt-lg-0 d-flex justify-content-end">
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
      </Col>
    </Row>
  );
}

export default BudgetItem;
