import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { updateExpense } from "../../../Services/expenseServices";
import { getAllCategories } from "../../../Services/categoryServices";
import { useNavigate, useSearchParams } from "react-router-dom";

function UpdateExpense() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const dateParam = searchParams.get("date");
  const amountParam = searchParams.get("amount");
  const descriptionParam = searchParams.get("description");
  const categoryParam = searchParams.get("category_id");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: dateParam || new Date().toISOString().split("T")[0], // Set default date to today's date
      amount: amountParam || "",
      description: descriptionParam || "",
      category_id: categoryParam || "",
    },
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategories();
        setCategories(response?.data?.Categories);
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    }

    fetchCategories();
  }, []);

  const onSubmit = (data) => {
    data.id = id; //injecting expense id into data
    updateExpense(data)
      .then((response) => {
        toast.success("Expense updated successfully.");
        navigate("/expense");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "An error occurred.");
        reset();
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">Update Expense</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <span className="text-danger">{errors.date.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="amount" className="mt-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Amount"
                {...register("amount", { required: "Amount is required" })}
              />
              {errors.amount && (
                <span className="text-danger">{errors.amount.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="description" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <span className="text-danger">
                  {errors.description.message}
                </span>
              )}
            </Form.Group>

            <Form.Group controlId="category_id" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                {...register("category_id", {
                  required: "Category is required",
                })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
              {errors.category_id && (
                <span className="text-danger">
                  {errors.category_id.message}
                </span>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default UpdateExpense;
