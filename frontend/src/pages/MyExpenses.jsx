import React, { useContext, useEffect, useState } from "react";
import { fetchExpenses, updateExpense, deleteExpenses } from "../api/api"; // Include the deleteExpenses API call
import { AuthContext } from "../context/AuthContext";
import ReactPaginate from "react-paginate"; // Import ReactPaginate

const MyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null); // Track the currently editing expense
  const [editedData, setEditedData] = useState({}); // Store the edited data
  const [selectedExpenses, setSelectedExpenses] = useState([]); // Track selected expenses for bulk deletion
  const [searchQuery, setSearchQuery] = useState(""); // For search
  const [filter, setFilter] = useState({
    category: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  }); // For filters

  const [page, setPage] = useState(0); // Start with page 0 for ReactPaginate
  const [totalPages, setTotalPages] = useState(1); // Set total pages dynamically
  const itemsPerPage = 10; // Set the number of items per page

  useEffect(() => {
    getExpenses();
  }, [page]);

  const getExpenses = async () => {
    const response = await fetchExpenses({
      page: page + 1, // API expects pages starting from 1
      limit: itemsPerPage,
    });
    if (response.expenses.length === 0 && page > 0) {
      setPage(0); // Reset to the first page if no data is available on the current page
    } else {
      setExpenses(response.expenses); // Update the state with paginated expenses
      setTotalPages(response.totalPages); // Set the total number of pages
    }
  };

  // Handle page change for ReactPaginate
  const handlePageChange = ({ selected }) => {
    setPage(selected); // Update the page state based on user selection
  };

  // Handle manual Previous and Next page navigation
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

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
      getExpenses(); // Re-fetch data after update
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
      setSelectedExpenses([]); // Clear the selected expenses list after deletion
      getExpenses(); // Re-fetch data after delete
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  // Handle single delete
  const handleSingleDelete = async (expenseId) => {
    try {
      await deleteExpenses([expenseId]); // Call API to delete a single expense
      getExpenses(); // Re-fetch data after delete
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  // Filter expenses based on search and filter criteria
  const filteredExpenses = expenses.filter((expense) => {
    const startDateMatch =
      !filter.startDate || new Date(expense.date) >= new Date(filter.startDate);
    const endDateMatch =
      !filter.endDate || new Date(expense.date) <= new Date(filter.endDate);
    const categoryMatch =
      !filter.category ||
      expense.category.toLowerCase().includes(filter.category.toLowerCase());
    const paymentMethodMatch =
      !filter.paymentMethod ||
      expense.paymentMethod
        .toLowerCase()
        .includes(filter.paymentMethod.toLowerCase());
    const searchMatch =
      !searchQuery ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      startDateMatch &&
      endDateMatch &&
      categoryMatch &&
      paymentMethodMatch &&
      searchMatch
    );
  });

  // Handle input changes for filters and search
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  return (
    <div>
      <h1>My Expenses</h1>

      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search by description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div>
        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filter.category}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="paymentMethod"
          placeholder="Filter by Payment Method"
          value={filter.paymentMethod}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          value={filter.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          value={filter.endDate}
          onChange={handleFilterChange}
        />
      </div>

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
          {filteredExpenses.map((expense) => (
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

      {/* Pagination Controls */}
      <div className="pagination flex justify-center mt-4">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 mx-2 rounded"
          onClick={handlePreviousPage}
          disabled={page === 0} // Disable button on the first page
        >
          Previous Page
        </button>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex justify-center"}
          activeClassName={"bg-blue-500 text-white"}
        />
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 mx-2 rounded"
          onClick={handleNextPage}
          disabled={page === totalPages - 1} // Disable button on the last page
        >
          Next Page
        </button>
      </div>

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
