import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { addBudget } from "../../../Services/budgetServices";
import { useNavigate } from "react-router-dom";

function CreateBudget() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      month: "",
      year: "",
      amount: "",
    },
  });

  const navigate = useNavigate();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i <= currentYear + 10; i++) {
    years.push(i);
  }

  const onSubmit = (data) => {
    // Convert month name to month number
    const monthIndex = months.indexOf(data.month) + 1;

    addBudget({ month: monthIndex, year: data.year, amount: data.amount })
      .then((response) => {
        toast.success("Budget added successfully.");
        navigate("/budget"); // Assuming you have a budget list page
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
          <h2 className="text-center">Create Budget</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="month">
              <Form.Label>Month</Form.Label>
              <Form.Select
                {...register("month", { required: "Month is required" })}
              >
                <option value="">Select Month</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </Form.Select>
              {errors.month && (
                <span className="text-danger">{errors.month.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="year" className="mt-3">
              <Form.Label>Year</Form.Label>
              <Form.Select
                {...register("year", { required: "Year is required" })}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
              {errors.year && (
                <span className="text-danger">{errors.year.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="amount" className="mt-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Amount"
                {...register("amount", {
                  required: "Amount is required",
                  validate: (value) =>
                    value > 0 || "Amount must be greater than zero",
                })}
              />
              {errors.amount && (
                <span className="text-danger">{errors.amount.message}</span>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Create
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateBudget;
