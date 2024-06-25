import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  selectFilteredCategories,
  getCategoriesStatus,
  getTotalPagesCount,
} from "../../../Reducers/categories/categorySlice";
import { Spinner, Form, Button, Container, Row, Col } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryItem from "../CategoryItem/CategoryItem";
import { Table } from "react-bootstrap";
import { useDebounce } from "../../../Utils";
import { useDispatch, useSelector } from "react-redux";

function CategoryHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [spinner, setSpinner] = useState(false);
  const categories = useSelector(selectFilteredCategories);
  const categoryStatus = useSelector(getCategoriesStatus);
  const totalPagesCount = useSelector(getTotalPagesCount);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams?.get("page")) || 1
  );
  const [limit, setLimit] = useState(parseInt(searchParams?.get("limit")) || 5);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const fetchFilteredCategories = () => {
    dispatch(
      fetchCategories({
        searchQuery: searchQuery.trim(),
        page: currentPage,
        limit,
      })
    );
  };

  useEffect(() => {
    fetchFilteredCategories();
  }, [debouncedSearchQuery, currentPage, limit, searchParams]);

  useEffect(() => {
    setSearchParams({ page: currentPage, limit: limit });
  }, [currentPage, limit]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">
            Categories for:{" "}
            {JSON.parse(localStorage.getItem("user_details"))?.name}
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={6} md={3} className="d-flex flex-row justify-content-center">
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search Category name here"
              onChange={handleChange}
            />

            <Button
              variant="success"
              className="mt-3 "
              onClick={() => {
                navigate("/category/add_category");
              }}
            >
              Click me to add a new Category
            </Button>
          </Form.Group>
        </Col>
      </Row>
      {categoryStatus === "loading" ? (
        <Spinner animation="border" />
      ) : categoryStatus === "failed" ? (
        <h2>Error fetching categories.</h2>
      ) : categories.length === 0 ? (
        <h2>No categories to show.</h2>
      ) : (
        <>
          <Row className="mt-5">
            <Container>
              <div className="container categories-card">
                {spinner && <Spinner animation="border" />}
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <CategoryItem
                        key={category._id} // Ensure to have a unique key for each item
                        name={category.name}
                        id={category._id}
                        // updateRefresh={updateRefresh}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
            </Container>
          </Row>
          <Container>
            <Row>
              <div className="pages mt-5 d-flex flex-row justify-content-center">
                <Col xs={6} md={6}>
                  <Pagination
                    color="primary"
                    defaultPage={1}
                    count={Math.ceil(totalPagesCount / limit)}
                    page={currentPage}
                    onChange={handlePageChange}
                    size="large"
                  />
                </Col>
                <Col xs={6} md={6}>
                  <div className="limit-selection">
                    Showing {limit} items per Page
                    <select
                      name="limit"
                      value={limit}
                      onChange={(e) => {
                        setLimit(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                    </select>
                  </div>
                </Col>
              </div>
            </Row>
          </Container>
        </>
      )}
    </Container>
  );
}

export default CategoryHome;
