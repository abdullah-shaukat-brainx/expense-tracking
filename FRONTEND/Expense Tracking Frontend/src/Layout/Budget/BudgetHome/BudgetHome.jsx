import { useEffect, useState } from "react";
import { getBudgets } from "../../../Services/budgetServices"; // Assuming you have a budget service
import { Spinner, Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import BudgetItem from "../BudgetItem/BudgetItem"; // Ensure correct path to BudgetItem

function BudgetHome() {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [budgets, setBudgets] = useState([]); // Initialize as an empty array
  const [refresh, setRefresh] = useState(false);
  const updateRefresh = () => {
    setRefresh(!refresh);
  };

  const fetchBudgets = async () => {
    setSpinner(true);
    try {
      const response = await getBudgets();
      if (response?.data?.budgets) {
        setBudgets(response.data.budgets); // Make sure budgets is an array
      } else {
        setBudgets([]); // Fallback in case response doesn't contain budgets
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      setBudgets([]); // Fallback on error
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refresh]);

  return (
    <Container fluid className="mt-5">
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <h2 className="text-center">
            Budgets for:{" "}
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
                navigate("/budget/create_budget");
              }}
            >
              Click me to add a new Budget
            </Button>
          </Form.Group>
        </Col>
      </Row>
      {budgets.length === 0 ? (
        <h2>No budgets to show.</h2>
      ) : (
        <>
          <Row className="mt-5">
            <Container>
              <div className="container budgets-card">
                {spinner && <Spinner animation="border" />}
                <ul className="list-group">
                  {budgets.map((budget) => (
                    <li key={budget._id} className="list-group-item">
                      <BudgetItem
                        month={budget.month}
                        year={budget.year}
                        amount={budget.amount}
                        id={budget._id}
                        updateRefresh={updateRefresh}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </Row>
        </>
      )}
    </Container>
  );
}

export default BudgetHome;
