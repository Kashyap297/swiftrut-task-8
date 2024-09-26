import React, { useContext, useEffect, useState } from "react";
import { fetchExpenses, updateExpense } from "../api/api"; // Include the updateExpense API call
import { AuthContext } from "../context/AuthContext";

const MyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null); // Track the currently editing expense
  const [editedData, setEditedData] = useState({}); // Store the edited data

  useEffect(() => {
    const getExpenses = async () => {
      const data = await fetchExpenses();
      setExpenses(data.expenses);
    };
    getExpenses();
  }, []);

  // Handle the Edit button click, toggle between view and edit mode
  const handleEditClick = (expense) => {
    setEditExpenseId(expense._id); // Set the expense to edit mode
    setEditedData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      date: expense.date,
    });
  };

  // Handle saving the updated expense data
  const handleSaveClick = async (id) => {
    try {
      await updateExpense(id, editedData);
      // After saving, reload the expenses
      const data = await fetchExpenses();
      setExpenses(data.expenses);
      setEditExpenseId(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating expense", error);
    }
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  return (
    <div>
      <h1>My Expenses</h1>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id} style={{ marginBottom: "15px" }}>
            {editExpenseId === expense._id ? (
              // Render input fields if the expense is in edit mode
              <div>
                <input
                  type="text"
                  name="description"
                  value={editedData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
                <input
                  type="number"
                  name="amount"
                  value={editedData.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                />
                <input
                  type="text"
                  name="category"
                  value={editedData.category}
                  onChange={handleInputChange}
                  placeholder="Category"
                />
                <input
                  type="text"
                  name="paymentMethod"
                  value={editedData.paymentMethod}
                  onChange={handleInputChange}
                  placeholder="Payment Method"
                />
                <input
                  type="date"
                  name="date"
                  value={new Date(editedData.date).toISOString().substr(0, 10)}
                  onChange={handleInputChange}
                />
                <button onClick={() => handleSaveClick(expense._id)}>
                  Save
                </button>
                <button onClick={() => setEditExpenseId(null)}>Cancel</button>
              </div>
            ) : (
              // Render the expense details and Edit button if not in edit mode
              <div>
                <span>
                  {expense.description} - ${expense.amount} on{" "}
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                <button onClick={() => handleEditClick(expense)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyExpenses;
