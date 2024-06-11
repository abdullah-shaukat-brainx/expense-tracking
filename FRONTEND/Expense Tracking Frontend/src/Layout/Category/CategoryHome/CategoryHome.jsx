import React, { useEffect, useState } from "react";
import { getCategories } from "../../../Services/categoryServices";
import { Spinner, Form, Button, Container, Row, Col } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import CategoryItem from "../CategoryItem/CategoryItem"; // Ensure correct path to CategoryItem

function CategoryHome() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [spinner, setSpinner] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const updateRefresh = () => {
    setRefresh(!refresh);
  };

  const useDebouncedValue = (inputValue, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(inputValue);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [inputValue, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams?.get("page")) || 1
  );
  const [limit, setLimit] = useState(parseInt(searchParams?.get("limit")) || 5);

  const fetchCategories = async (page, limit) => {
    setSpinner(true);
    try {
      const response = await getCategories({
        searchQuery: searchQuery.trim(),
        page: page,
        limit: limit,
      });
      setTotalPagesCount(parseInt(response?.data?.count));
      setCategories(response?.data?.Categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, limit);
  }, [debouncedSearchQuery, currentPage, limit, searchParams, refresh]);

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
      {categories.length === 0 ? (
        <h2>No categories to show.</h2>
      ) : (
        <>
          <Row className="mt-5">
            <Container>
              <div className="container categories-card">
                {spinner && <Spinner animation="border" />}
                <ul className="list-group">
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <CategoryItem
                        name={category.name}
                        id={category._id}
                        updateRefresh={updateRefresh}
                      />
                    </li>
                  ))}
                </ul>
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
