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
  Cell,
  Label,
} from "recharts";

const ExpenseStatistics = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Function to get all months in the year
  const getAllMonths = () => [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const getExpenses = async () => {
      const data = await fetchExpenses();
      setExpenses(data.expenses);
      setFilteredExpenses(data.expenses); // Set initial filtered expenses
    };
    getExpenses();
  }, []);

  // Function to handle filtering expenses by category and month
  const filterExpenses = () => {
    let filtered = expenses;
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }
    if (selectedMonth !== "all") {
      filtered = filtered.filter((expense) => {
        const month = new Date(expense.date).toLocaleString("default", {
          month: "long",
        });
        return month === selectedMonth;
      });
    }
    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    filterExpenses();
  }, [selectedCategory, selectedMonth]);

  const expenseByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categoryData = Object.entries(expenseByCategory).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  // Process monthly expenses to ensure all months are included, even if no data exists
  const monthlyExpenses = filteredExpenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString("default", {
      month: "long",
    });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  const allMonths = getAllMonths();
  const monthlyData = allMonths.map((month) => ({
    name: month,
    total: monthlyExpenses[month] || 0, // Ensure that months without expenses have a total of 0
  }));

  // Define a color palette for categories
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#F39C12",
  ];

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Expense Statistics
      </h1>

      {/* Filters */}
      <div className="flex justify-center mb-8">
        <div className="mx-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Filter by Category
          </label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {/* Dynamically populate categories */}
            {Object.keys(expenseByCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mx-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Filter by Month
          </label>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {/* Populate months dynamically */}
            {getAllMonths().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pie Chart for Category Breakdown */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Expenses by Category
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                label
                labelLine={false}
                outerRadius={120}
                cx="50%"
                cy="50%"
                animationDuration={800} // Adding smooth animation
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart for Monthly Expenses */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Expenses Over Time (Monthly)
        </h2>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#334155">
                <Label value="Month" offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis stroke="#334155">
                <Label value="Total ($)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                activeDot={{ r: 8 }}
                animationDuration={800} // Adding smooth animation
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStatistics;
