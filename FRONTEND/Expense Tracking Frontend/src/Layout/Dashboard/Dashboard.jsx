// Dashboard.js
import React, { useEffect, useState } from "react";
import { Spinner, Container, Row, Col, Table, Form } from "react-bootstrap";
import { getDashboardAnalytics } from "../../Services/dashboardServices";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

function Dashboard() {
  const [analytics, setAnalytics] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [monthlyBudgetAmount, setMonthlyBudgetAmount] = useState(0);
  const [spinner, setSpinner] = useState(true);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const fetchAnalytics = async () => {
    setSpinner(true);
    try {
      const response = await getDashboardAnalytics(month, year);
      setAnalytics(response?.data?.analytics || []);
      setRemainingAmount(response?.data?.remainingAmount || 0);
      setMonthlyBudgetAmount(response?.data?.monthlyBudgetAmount || 0);
      setLineChartData(response?.data?.expenseAnalytics);
      console.log("E_A:", response?.data?.expenseAnalytics); // Expense Analytics
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [month, year]);

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">
            Dashboard for:{" "}
            {JSON.parse(localStorage.getItem("user_details"))?.name}
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <Form>
            <Form.Group className="d-flex justify-content-center">
              <div className="me-2">
                <Form.Label>Month</Form.Label>
                <Form.Control
                  as="select"
                  value={month}
                  onChange={handleMonthChange}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i + 1, 0).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </Form.Control>
              </div>
              <div className="me-2">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  as="select"
                  value={year}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() - i}>
                      {new Date().getFullYear() - i}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      {spinner ? (
        <Row className="justify-content-center mt-5">
          <Spinner animation="border" />
        </Row>
      ) : analytics.length === 0 ? (
        <h2>Nothing to show.</h2>
      ) : (
        <Row className="mt-5 justify-content-center">
          <Col xs={12} sm={5} lg={3}>
            <h3 className="text-center mb-4">Analytics</h3>
            <p className="text-center mt-4">
              Total Budget Amount: {monthlyBudgetAmount}
            </p>
            <p
              className={`text-center mt-4 ${
                remainingAmount > 0 ? "text-success" : "text-danger"
              }`}
            >
              {remainingAmount > 0
                ? `Remaining Amount for Monthly Budget: ${remainingAmount}`
                : `Monthly Budget exceeding by Amount: ${Math.abs(
                    remainingAmount
                  )}`}
            </p>
            <PieChart data={analytics} />
          </Col>
          <Col xs={12} sm={7} lg={5}>
            <h3 className="text-center mb-4">Category-wise Amount</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((item, index) => (
                  <tr key={index}>
                    <td>{item.categoryName}</td>
                    <td>{item.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col xs={12} sm={12} lg={4}>
          <h3 className="text-center mb-4">Line Chart</h3>
            <LineChart data={lineChartData} />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Dashboard;
