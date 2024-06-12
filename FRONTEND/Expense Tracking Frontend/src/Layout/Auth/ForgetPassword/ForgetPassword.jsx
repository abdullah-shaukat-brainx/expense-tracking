import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { isValidEmailFormat } from "../../../Services/utilServices";
import { forgetPassword } from "../../../Services/authServices";

function ForgetPassword() {
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

  const onSubmit = (data) => {
    forgetPassword(data.email)
      .then((data) => {
        toast.success("Password Reset Link sent to your email.");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
        reset();
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">Forgot Password</h2>
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

            <Button variant="primary" type="submit" className="mt-3">
              Forgot Password
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col xs={12} md={6} className="text-center">
          <Link to="/users/login">Click here to go to Login Screen</Link>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgetPassword;
