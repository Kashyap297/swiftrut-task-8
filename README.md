Expense Tracker Application
Overview
The Expense Tracker is a full-featured application that allows users to manage their expenses efficiently. The app supports adding, viewing, editing, deleting expenses, and provides detailed statistics with visual charts for monthly comparisons and category breakdowns. The backend handles secure user authentication, role-based access control, and CRUD operations for expenses with advanced filtering and pagination.

Features
Frontend:
Add Expense: Users can add expenses with validation (e.g., amount must be a number, date must be valid).
View and Manage Expenses: View all expenses in a dynamic table with sorting and inline editing.
Filters & Search: Filter by category, date range, and payment method, and search for specific expenses.
Charts: Visualize expenses using line charts and pie charts, with dynamic filters for time range and category breakdowns.
Auto-suggestions: For frequent categories based on previous entries.
Pagination: Handle large datasets with paginated expense lists.
Responsive UI: Built using Styled Components for modular, responsive design.
Backend:
CRUD Operations: Create, read, update, and delete expenses with advanced filtering, sorting, and pagination.
Bulk Upload: Upload multiple expenses via CSV file.
User Authentication: JWT-based authentication with secure password hashing.
Role-Based Access Control: Separate roles for regular users and admins.
Expense Statistics: Generate monthly comparisons and category-wise expense breakdown using MongoDB aggregation.
Full-Stack Integration:
Real-Time Updates: Charts and tables update in real time based on filtered data.
Secure Data Handling: All operations are secured with JWT tokens and role-based access control.
Deployment: Frontend and backend are deployed on Vercel/Netlify and Heroku/Render respectively.
