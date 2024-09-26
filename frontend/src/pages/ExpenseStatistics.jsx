import React, { useEffect, useState } from "react";
import { fetchExpenses } from "../api/api";
import {
  LineChart,
  PieChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ExpenseStatistics = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const getExpenses = async () => {
      const data = await fetchExpenses();
      setExpenses(data.expenses);
    };
    getExpenses();
  }, []);

  const expenseByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(expenseByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "long",
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const monthlyData = Object.entries(monthlyExpenses).map(
    ([month, amount]) => ({
      name: month,
      total: amount,
    })
  );

  return (
    <div>
      <h1>Expense Statistics</h1>

      <div style={{ width: "100%", height: 400 }}>
        <h2>Expenses by Category</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              fill="#8884d8"
              label
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <h2>Expenses Over Time (Monthly)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseStatistics;
