import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateBudget } from "../../../Services/budgetServices";

function UpdateBudget() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  //   const monthParam = searchParams.get("month");
  //   const yearParam = searchParams.get("year");
  const amountParam = searchParams.get("amount");
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      //   month: monthParam || "",
      //   year: yearParam || "",
      amount: amountParam || "",
    },
  });

  const onSubmit = (data) => {
    const { amount } = data;
    // const monthIndex = months.findIndex((m) => m === month) + 1; // Get the index of the selected month and add 1
    updateBudget(id, amount)
      .then((response) => {
        toast.success("Budget updated successfully.");
        navigate("/budget");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error || "An error occurred.");
        reset();
      });
  };

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

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">Update Budget</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* <Form.Group controlId="month">
              <Form.Label>Month</Form.Label>
              <Form.Select
                {...register("month", {
                  required: "Month is required",
                })}
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
                {...register("year", {
                  required: "Year is required",
                })}
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
            </Form.Group> */}

            <Form.Group controlId="amount" className="mt-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Amount"
                {...register("amount", {
                  required: "Amount is required",
                })}
              />
              {errors.amount && (
                <span className="text-danger">{errors.amount.message}</span>
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

export default UpdateBudget;
