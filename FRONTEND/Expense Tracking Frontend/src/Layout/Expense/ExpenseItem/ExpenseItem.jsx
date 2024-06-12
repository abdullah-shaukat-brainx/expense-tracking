import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { deleteExpense } from "../../../Services/expenseServices";
import "./ExpenseItem.css";
import { useNavigate } from "react-router-dom";

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
    navigate(
      `/expense/update_expense?id=${id}&date=${date}&amount=${amount}&description=${description}&category_name=${category_name}`
    );
  };

  return (
    <Row className="border p-3 mb-3">
      <Col xs={12} md={3}>
        <span>{date}</span>
      </Col>
      <Col xs={12} md={2}>
        <span>{amount}</span>
      </Col>
      <Col xs={12} md={2}>
        <span>{description}</span>
      </Col>
      <Col xs={12} md={3}>
        <span>{category_name}</span>
      </Col>
      <Col xs={12} md={2} className="mt-3 mt-lg-0">
        <div className="controls d-flex justify-content-end">
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
        </div>
      </Col>
    </Row>
  );
}

export default ExpenseItem;
