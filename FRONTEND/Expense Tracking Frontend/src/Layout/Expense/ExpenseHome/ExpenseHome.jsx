import React, { useEffect, useState } from "react";
import { getExpenses } from "../../../Services/expenseServices";
import { getAllCategories } from "../../../Services/categoryServices";
import { Spinner, Form, Button, Container, Row, Col } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import ExpenseItem from "../ExpenseItem/ExpenseItem"; // Ensure correct path to ExpenseItem

function ExpenseHome() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [spinner, setSpinner] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [refresh, setRefresh] = useState(false);

  const updateRefresh = () => {
    setRefresh(!refresh);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams?.get("page")) || 1
  );
  const [limit, setLimit] = useState(parseInt(searchParams?.get("limit")) || 5);

  const fetchExpenses = async (page, limit) => {
    setSpinner(true);
    try {
      const response = await getExpenses({
        category_id: selectedCategory,
        startDate,
        endDate,
        page,
        limit,
      });
      setTotalPagesCount(parseInt(response?.data?.count));
      setExpenses(response?.data?.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setSpinner(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response?.data?.Categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchExpenses(currentPage, limit);
    fetchCategories();
  }, [
    currentPage,
    limit,
    searchParams,
    refresh,
    selectedCategory,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    setSearchParams({
      page: currentPage,
      limit: limit,
      startDate: startDate,
      endDate: endDate,
      selectedCategory: selectedCategory,
    });
  }, [currentPage, limit]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">
            Expenses for:{" "}
            {JSON.parse(localStorage.getItem("user_details"))?.name}
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={6} md={3} className="d-flex flex-row justify-content-center">
          <Form.Group controlId="search">
            <Button
              variant="success"
              className="mt-3"
              onClick={() => {
                navigate("/expense/create_expense");
              }}
            >
              Click me to add a new Expense
            </Button>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="mt-3"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              className="mt-3"
            />
            <Form.Control
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              className="mt-3"
            />
          </Form.Group>
        </Col>
      </Row>
      {expenses.length === 0 ? (
        <h2>No expenses to show.</h2>
      ) : (
        <>
          <Row className="mt-5">
            <Container>
              <div className="container expenses-card">
                {spinner && <Spinner animation="border" />}
                <ul className="list-group">
                  {expenses.map((expense) => (
                    <li
                      key={expense._id}
                      className="list-group-item"
                    >
                      <ExpenseItem
                        date={expense.date}
                        amount={expense.amount}
                        description={expense.description}
                        category_name={
                          categories.find(
                            (cat) => cat._id === expense.category_id
                          )?.name || "Unknown"
                        }
                        id={expense._id}
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

export default ExpenseHome;
