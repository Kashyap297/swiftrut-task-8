import React, { useContext, useEffect, useState } from "react";
import { fetchExpenses, updateExpense, deleteExpenses } from "../api/api"; // Include the deleteExpenses API call
import { AuthContext } from "../context/AuthContext";

const MyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null); // Track the currently editing expense
  const [editedData, setEditedData] = useState({}); // Store the edited data
  const [selectedExpenses, setSelectedExpenses] = useState([]); // Track selected expenses for bulk deletion

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

  // Handle checkbox change for selecting expenses
  const handleCheckboxChange = (expenseId) => {
    setSelectedExpenses((prevSelected) => {
      if (prevSelected.includes(expenseId)) {
        // Remove the ID if it's already selected
        return prevSelected.filter((id) => id !== expenseId);
      } else {
        // Add the ID to the selected list
        return [...prevSelected, expenseId];
      }
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedExpenses.length === 0) {
      alert("Please select at least one expense to delete.");
      return;
    }

    try {
      await deleteExpenses(selectedExpenses); // Call API to delete selected expenses
      setExpenses((prevExpenses) =>
        prevExpenses.filter(
          (expense) => !selectedExpenses.includes(expense._id)
        )
      );
      setSelectedExpenses([]); // Clear the selected expenses list after deletion
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  // Handle single delete
  const handleSingleDelete = async (expenseId) => {
    try {
      await deleteExpenses([expenseId]); // Call API to delete a single expense
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== expenseId)
      );
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  return (
    <div>
      <h1>My Expenses</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th>Select</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id} className="border-t">
              <td>
                <input
                  type="checkbox"
                  checked={selectedExpenses.includes(expense._id)}
                  onChange={() => handleCheckboxChange(expense._id)}
                />
              </td>
              <td>
                {editExpenseId === expense._id ? (
                  <input
                    type="text"
                    name="description"
                    value={editedData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                  />
                ) : (
                  expense.description
                )}
              </td>
              <td>
                {editExpenseId === expense._id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editedData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                  />
                ) : (
                  `$${expense.amount}`
                )}
              </td>
              <td>
                {editExpenseId === expense._id ? (
                  <input
                    type="text"
                    name="category"
                    value={editedData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                  />
                ) : (
                  expense.category
                )}
              </td>
              <td>
                {editExpenseId === expense._id ? (
                  <input
                    type="date"
                    name="date"
                    value={new Date(editedData.date)
                      .toISOString()
                      .substr(0, 10)}
                    onChange={handleInputChange}
                  />
                ) : (
                  new Date(expense.date).toLocaleDateString()
                )}
              </td>
              <td>
                {editExpenseId === expense._id ? (
                  <input
                    type="text"
                    name="paymentMethod"
                    value={editedData.paymentMethod}
                    onChange={handleInputChange}
                    placeholder="Payment Method"
                  />
                ) : (
                  expense.paymentMethod
                )}
              </td>
              <td>
                {editExpenseId === expense._id ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleSaveClick(expense._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                      onClick={() => setEditExpenseId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditClick(expense)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleSingleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="bg-red-600 text-white px-4 py-2 rounded mt-4"
        onClick={handleBulkDelete}
        disabled={selectedExpenses.length === 0}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default MyExpenses;
