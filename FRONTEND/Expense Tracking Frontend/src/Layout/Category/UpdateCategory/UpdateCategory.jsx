import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateCategory } from "../../../Reducers/categories/categorySlice";
import { useDispatch } from "react-redux";

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

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch(updateCategory({ id, name: data.name }))
      .then((response) => {
        if (response.categoriesError) toast.error("An error occoured!");
        else toast.success("Category successfully updated.");
        navigate("/category");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Unexpected error occoured.");
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
