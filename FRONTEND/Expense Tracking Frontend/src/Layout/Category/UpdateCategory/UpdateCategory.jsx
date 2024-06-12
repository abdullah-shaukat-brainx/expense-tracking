import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateCategory } from "../../../Services/categoryServices";

function UpdateCategory() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const nameParam = searchParams.get("name");
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: nameParam || "",
    },
  });

  const onSubmit = (data) => {
    updateCategory(id, data.name)
      .then((response) => {
        toast.success("Category updated successfully.");
        navigate("/category");
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
          <h2 className="text-center">Update Category</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="name">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category name"
                {...register("name", {
                  required: "Category name is required",
                })}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
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

export default UpdateCategory;
