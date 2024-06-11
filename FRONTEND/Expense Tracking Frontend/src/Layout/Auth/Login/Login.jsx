import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  isValidEmailFormat,
  isValidPasswordFormat,
} from "../../../Services/utilServices";
import { login } from "../../../Services/authServices";

function LogIn() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const onSubmit = (data) => {
    login(data.email, data.password)
      .then((data) => {
        localStorage.setItem("access_token", data?.access_token);
        localStorage.setItem("user_details", JSON.stringify(data?.data?.User));
        toast.success("Logged in Successful.");
        navigate("/expense");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
        reset();
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">Log In</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    validFormat: (value) =>
                      isValidEmailFormat(value) || "Invalid email format",
                  },
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password", {
                    required: "Password is required",
                    validate: {
                      validFormat: (value) =>
                        isValidPasswordFormat(value) ||
                        "Incorrect password format: min length 8, min 1 special, min 1 capital and min 1 small letter",
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
            <Col xs={12} md={6}>
              <Link to="/users/forget_password">Forgot Password?</Link>
            </Col>

            <Button variant="primary" type="submit" className="mt-3">
              Log In
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={6} className="text-center">
          <Link to="/users/signup">Dont have an account? Sign up!</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default LogIn;
