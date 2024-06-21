import React, { useEffect, useState } from "react";
import { Spinner, Container, Row, Col, Table, Form } from "react-bootstrap";
import { getDashboardAnalytics } from "../../Services/dashboardServices";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [analytics, setAnalytics] = useState([]);
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
      console.log("E_A:", response?.data?.expenseAnalytics); //Expense Analytics
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [month, year]);

  const data = {
    labels: analytics.map((item) => item.categoryName),
    datasets: [
      {
        label: "Amount",
        data: analytics.map((item) => item.totalAmount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: ["rgba(0, 0, 0, 1)"],
        borderWidth: 1,
      },
    ],
  };

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
                  {/* <option value="">Select Month</option> */}
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
                  {/* <option value="">Select Year</option> */}
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
              {/* condition ? true : false */}
              {remainingAmount > 0
                ? `Remaining Amount for Monthly Budget: ${remainingAmount}`
                : `Monthly Budget exceeding by Amount: ${Math.abs(
                    remainingAmount
                  )}`}
            </p>
            <Pie data={data} />
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
        </Row>
      )}
    </Container>
  );
}

export default Dashboard;
