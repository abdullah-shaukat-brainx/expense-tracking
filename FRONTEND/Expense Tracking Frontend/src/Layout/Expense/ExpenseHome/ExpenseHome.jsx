import React, { useEffect, useState } from "react";
import { getExpenses } from "../../../Services/expenseServices";
import { Spinner, Form, Button, Container, Row, Col } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import ExpenseItem from "../ExpenseItem/ExpenseItem";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useDebounce } from "../../../Utils";
import {
  fetchAllCategories,
  selectAllCategories,
} from "../../../Reducers/categories/categorySlice";
import { useSelector, useDispatch } from "react-redux";

function getFirstDateOfMonth() {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth();
  return new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0];
}

function getLastDateOfMonth() {
  const currentDate = new Date();
  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth() + 1; // Month index is zero-based
  return new Date(Date.UTC(year, month, 0)).toISOString().split("T")[0];
}

function ExpenseHome() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [spinner, setSpinner] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const categories = useSelector(selectAllCategories);
  const dispatch = useDispatch(); // Redux dispatch hook

  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState(getFirstDateOfMonth());
  const [endDate, setEndDate] = useState(getLastDateOfMonth());
  const [totalPagesCount, setTotalPagesCount] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  const updateRefresh = () => {
    setRefresh(!refresh);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      toast.error("Start date cannot be greater than end date");
      return;
    }
    setStartDate(newStartDate);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && new Date(newEndDate) < new Date(startDate)) {
      toast.error("End date cannot be less than start date");
      return;
    }
    setEndDate(newEndDate);
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
        searchQuery: debouncedSearchQuery,
      });
      setTotalPagesCount(parseInt(response?.data?.count));
      setExpenses(response?.data?.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setSpinner(false);
    }
  };

  const fetchCategories = () => {
    try {
      dispatch(fetchAllCategories());
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
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    setSearchParams({
      page: currentPage,
      limit: limit,
      startDate: startDate,
      endDate: endDate,
      selectedCategory: selectedCategory,
    });
  }, [currentPage, limit, startDate, endDate]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
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
      <div>
        <Form.Group>
          <div className="d-flex justify-content-center">
            <Button
              variant="success"
              className="mt-3"
              onClick={() => {
                navigate("/expense/create_expense");
              }}
            >
              Click me to add a new Expense
            </Button>
          </div>
          <div className="d-flex flex-row justify-content-center">
            <div className="mt-3 me-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </div>

            <div className="mt-3 me-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
            <div className="mt-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search Description here"
                onChange={handleSearchQueryChange}
              />
            </div>
          </div>
        </Form.Group>
      </div>
      {expenses.length === 0 ? (
        <h2>No expenses to show.</h2>
      ) : (
        <>
          <Row className="mt-5">
            <Container>
              <div className="container expenses-card">
                {spinner && <Spinner animation="border" />}
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Controls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <ExpenseItem
                        key={expense._id}
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

export default ExpenseHome;
