import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SignUp from "./Layout/Auth/Signup/signup";
import LogIn from "./Layout/Auth/Login/Login";
import ForgetPassword from "./Layout/Auth/ForgetPassword/ForgetPassword";
import ResetPassword from "./Layout/Auth/ResetPassword/ResetPassword";
import UpdateProfile from "./Layout/Auth/UpdateProfile/UpdateProfile";
import CreateCategory from "./Layout/Category/CreateCategory/CreateCategory";
import CategoryHome from "./Layout/Category/CategoryHome/CategoryHome";
import UpdateCategory from "./Layout/Category/UpdateCategory/UpdateCategory";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { isAuthenticated } from "./Utils";
import ProtectedLayout from "./Layout/ProtectedLayout/ProtectedLayout";
import CreateExpense from "./Layout/Expense/CreateExpense/CreateExpense";
import ExpenseHome from "./Layout/Expense/ExpenseHome/ExpenseHome";
import UpdateExpense from "./Layout/Expense/UpdateExpense/UpdateExpense";
import CreateBudget from "./Layout/Budget/CreateBudget/CreateBudget";
import BudgetHome from "./Layout/Budget/BudgetHome/BudgetHome";
import UpdateBudget from "./Layout/Budget/UpdateBudget/UpdateBudget";
import Dashboard from "./Layout/Dashboard/Dashboard";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/users/login" />;
};

const router = createBrowserRouter([
  // User Routes
  {
    path: "/users/signup",
    element: <SignUp />,
  },
  {
    path: "/users/login",
    element: <LogIn />,
  },
  {
    path: "/users/reset_password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/users/forget_password",
    element: <ForgetPassword />,
  },

  // Protected Routes
  {
    path: "/",
    element: (
      <PrivateRoute>
        <ProtectedLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/users/update_profile",

        element: (
          <PrivateRoute>
            <UpdateProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/category/add_category",
        element: (
          <PrivateRoute>
            <CreateCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/category",
        element: (
          <PrivateRoute>
            <CategoryHome />
          </PrivateRoute>
        ),
      },
      {
        path: "/category/update_category",
        element: (
          <PrivateRoute>
            <UpdateCategory />
          </PrivateRoute>
        ),
      },
      {
        path: "/expense/create_expense",
        element: (
          <PrivateRoute>
            <CreateExpense />
          </PrivateRoute>
        ),
      },
      {
        path: "/expense",
        element: (
          <PrivateRoute>
            <ExpenseHome />
          </PrivateRoute>
        ),
      },
      {
        path: "/expense/update_expense",
        element: (
          <PrivateRoute>
            <UpdateExpense />
          </PrivateRoute>
        ),
      },
      {
        path: "/budget",
        element: (
          <PrivateRoute>
            <BudgetHome />
          </PrivateRoute>
        ),
      },
      {
        path: "/budget/create_budget",
        element: (
          <PrivateRoute>
            <CreateBudget />
          </PrivateRoute>
        ),
      },
      {
        path: "/budget/update_budget",
        element: (
          <PrivateRoute>
            <UpdateBudget />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
