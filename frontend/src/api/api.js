import axios from "axios";

// Set your backend API base URL
const API_BASE_URL = "http://localhost:8000/api"; // Make sure to update this with your actual backend API URL

// Function to get the token from localStorage
const getToken = () => localStorage.getItem("token");

// Fetch expenses with token authentication
export const fetchExpenses = async () => {
  const token = getToken();
  const response = await axios.get(`${API_BASE_URL}/expenses`, {
    headers: {
      Authorization: `Bearer ${token}`, // Set token in headers
    },
  });
  return response.data;
};

// Add expense with token authentication
export const addExpense = async (expense) => {
  const token = getToken();
  const response = await axios.post(`${API_BASE_URL}/expenses`, expense, {
    headers: {
      Authorization: `Bearer ${token}`, // Set token in headers
    },
  });
  return response.data;
};

// Login user and receive the token
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, credentials);
  return response.data; // This will include the token
};

// Register user and receive the token
export const registerUser = async (credentials) => {
  const response = await axios.post(
    `${API_BASE_URL}/users/register`,
    credentials
  );
  return response.data; // This will include the token
};
