import React, { useContext, useEffect, useState } from "react";
import { fetchExpenses, updateExpense, deleteExpenses } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ReactPaginate from "react-paginate";

const MyExpenses = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    category: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getExpenses();
  }, [page]);

  const getExpenses = async () => {
    const response = await fetchExpenses({
      page: page + 1,
      limit: itemsPerPage,
    });
    if (response.expenses.length === 0 && page > 0) {
      setPage(0);
    } else {
      setExpenses(response.expenses);
      setTotalPages(response.totalPages);
    }
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

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

  const handleEditClick = (expense) => {
    setEditExpenseId(expense._id);
    setEditedData({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      date: expense.date,
    });
  };

  const handleSaveClick = async (id) => {
    try {
      await updateExpense(id, editedData);
      getExpenses();
      setEditExpenseId(null);
    } catch (error) {
      console.error("Error updating expense", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (expenseId) => {
    setSelectedExpenses((prevSelected) => {
      if (prevSelected.includes(expenseId)) {
        return prevSelected.filter((id) => id !== expenseId);
      } else {
        return [...prevSelected, expenseId];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedExpenses.length === 0) {
      alert("Please select at least one expense to delete.");
      return;
    }

    try {
      await deleteExpenses(selectedExpenses);
      setSelectedExpenses([]);
      getExpenses();
    } catch (error) {
      console.error("Error deleting expenses:", error);
    }
  };

  const handleSingleDelete = async (expenseId) => {
    try {
      await deleteExpenses([expenseId]);
      getExpenses();
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">
        My Expenses
      </h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-gray-300 p-2 rounded-md w-full"
        />

        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filter.category}
          onChange={handleFilterChange}
          className="border-2 border-gray-300 p-2 rounded-md w-full"
        />

        <input
          type="text"
          name="paymentMethod"
          placeholder="Filter by Payment Method"
          value={filter.paymentMethod}
          onChange={handleFilterChange}
          className="border-2 border-gray-300 p-2 rounded-md w-full"
        />

        <input
          type="date"
          name="startDate"
          value={filter.startDate}
          onChange={handleFilterChange}
          className="border-2 border-gray-300 p-2 rounded-md w-full"
        />

        <input
          type="date"
          name="endDate"
          value={filter.endDate}
          onChange={handleFilterChange}
          className="border-2 border-gray-300 p-2 rounded-md w-full"
        />
      </div>

      {/* Expenses Table */}
      <table className="table-auto w-full bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-blue-600 text-white text-left">
            <th className="px-4 py-2">Select</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr
              key={expense._id}
              className="border-b hover:bg-gray-50 transition duration-300 ease-in-out"
            >
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedExpenses.includes(expense._id)}
                  onChange={() => handleCheckboxChange(expense._id)}
                />
              </td>
              <td className="px-4 py-2">
                {editExpenseId === expense._id ? (
                  <input
                    type="text"
                    name="description"
                    value={editedData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    className="border p-2 rounded-md"
                  />
                ) : (
                  expense.description
                )}
              </td>
              <td className="px-4 py-2">
                {editExpenseId === expense._id ? (
                  <input
                    type="number"
                    name="amount"
                    value={editedData.amount}
                    onChange={handleInputChange}
                    placeholder="Amount"
                    className="border p-2 rounded-md"
                  />
                ) : (
                  `$${expense.amount}`
                )}
              </td>
              <td className="px-4 py-2">
                {editExpenseId === expense._id ? (
                  <input
                    type="text"
                    name="category"
                    value={editedData.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    className="border p-2 rounded-md"
                  />
                ) : (
                  expense.category
                )}
              </td>
              <td className="px-4 py-2">
                {new Date(expense.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{expense.paymentMethod}</td>
              <td className="px-4 py-2 flex space-x-2">
                {editExpenseId === expense._id ? (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-md transition duration-300"
                      onClick={() => handleSaveClick(expense._id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-md transition duration-300"
                      onClick={() => setEditExpenseId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded-md transition duration-300"
                      onClick={() => handleEditClick(expense)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md transition duration-300"
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
      {/* Pagination Controls */}
      <div className="pagination flex justify-center mt-6">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 mx-2 rounded-md transition duration-300"
          onClick={handlePreviousPage}
          disabled={page === 0} // Disable previous button on first page
        >
          Previous Page
        </button>

        <ReactPaginate
          previousLabel={null} // Disable built-in "Previous" label
          nextLabel={null} // Disable built-in "Next" label
          pageCount={totalPages} // Use calculated total pages
          onPageChange={handlePageChange}
          forcePage={page} // Highlight the current page
          containerClassName={"pagination flex justify-center space-x-2"}
          activeClassName={"bg-blue-500 text-white px-4 py-2 rounded-md"}
        />

        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 mx-2 rounded-md transition duration-300"
          onClick={handleNextPage}
          disabled={page === totalPages - 1} // Disable next button on last page
        >
          Next Page
        </button>
      </div>

      {/* Bulk Delete Button */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-bold transition duration-300"
          onClick={handleBulkDelete}
          disabled={selectedExpenses.length === 0}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default MyExpenses;
