import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { isValidPasswordFormat } from "../../../Services/utilServices";
import { updateProfile } from "../../../Services/authServices";
function UpdateProfile() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const navigate = useNavigate();
  const onSubmit = (data) => {
    updateProfile(data)
      .then((data) => {
        localStorage.setItem("user_details", JSON.stringify(data?.data?.user));
        toast.success("Profile Updated Successfully.");
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error?.response?.error || "Unable to Update Profile");
        reset();
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">Update Profile</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                {...register("name", {
                  required: "Name is required",
                  maxLength: 20,
                })}
              />
              {errors.name && (
                <span className="text-danger">{errors.name.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="currentPassword">
              <Form.Label>Current Password</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("currentPassword", {
                    required: "Current Password is required",
                    validate: {
                      validFormat: (value) =>
                        isValidPasswordFormat(value) ||
                        "Invalid password format",
                    },
                  })}
                />
                <Button
                  variant="outline-secondary"
                  onClick={toggleCurrentPasswordVisibility}
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </Button>
              </div>
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new Password"
                  {...register("password", {
                    required: "Password is required",
                    validate: {
                      validFormat: (value) =>
                        isValidPasswordFormat(value) ||
                        "Invalid password format",
                    },
                  })}
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Update Profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default UpdateProfile;
