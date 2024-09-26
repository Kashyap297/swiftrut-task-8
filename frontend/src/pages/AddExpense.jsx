import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addExpense, bulkAddExpenses } from "../api/api"; // Make sure you have this function

const AddExpense = () => {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    paymentMethod: "cash", // Default payment method
    date: "",
  });
  const [csvFile, setCsvFile] = useState(null); // State to store CSV file
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]); // Store the uploaded CSV file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (csvFile) {
      // If CSV file is provided, handle bulk upload
      const formData = new FormData();
      formData.append("file", csvFile);

      try {
        await bulkAddExpenses(formData); // Bulk upload via CSV
        navigate("/"); // Redirect to the MyExpenses page after successful addition
      } catch (error) {
        console.error("Error uploading CSV file:", error);
        setError("Failed to upload CSV. Please try again.");
      }
    } else {
      // Handle single expense entry
      if (!formData.amount || !formData.description || !formData.date) {
        setError("Please fill all the required fields");
        return;
      }

      try {
        await addExpense(formData);
        navigate("/"); // Redirect to the MyExpenses page after successful addition
      } catch (error) {
        console.error("Error adding expense:", error);
        setError("Failed to add expense. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Add Expense</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Amount"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Description"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Category"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Date"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Upload CSV for Bulk Expenses</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md w-full"
        >
          {csvFile ? "Upload CSV" : "Add Expense"}{" "}
          {/* Change button text based on file upload */}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
