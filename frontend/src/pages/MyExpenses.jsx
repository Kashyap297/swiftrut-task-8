import React, { useContext, useEffect, useState } from "react";
import { fetchExpenses } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const MyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const getExpenses = async () => {
      const data = await fetchExpenses(user.token);
      setExpenses(data.expenses);
    };

    getExpenses();
  }, [user]);

  return (
    <div>
      <h1>My Expenses</h1>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id}>
            {expense.description} - ${expense.amount} on {expense.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyExpenses;
