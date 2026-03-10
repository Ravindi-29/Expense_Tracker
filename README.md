# 🌸 Pastel Expense Tracker - Monthly Budget Plan

A beautiful, beginner-friendly full-stack Expense Tracker Web Application built with Node.js, Express, and Vanilla JavaScript. The design is inspired by soft pastel monthly budget planners, featuring a clean aesthetic and smooth animations.

![Dashboard Preview Placeholder](https://via.placeholder.com/800x450?text=Pastel+Expense+Tracker+Dashboard)

## ✨ Features

-   **User Authentication**: Secure registration and login using JWT.
-   **Transaction Management**: 
    -   Add Income and Expenses with categories.
    -   Edit and Delete transactions.
    -   Real-time balance, income, and expense updates.
-   **Monthly Summary**: 
    -   Automatically generates a summary at the end of each month.
    -   In-app notifications for new summaries.
    -   Option to save or delete the summary.
-   **Dashboard & Visualization**: 
    -   Interactive doughnut chart (Income vs Expenses) using Chart.js.
    -   Search and filter transaction history by text or category.
-   **Responsive & Modern UI**:
    -   Pastel-themed design with soft gradients and glassmorphism.
    -   Dark Mode support.
    -   Smooth CSS transitions and animations.
    -   Mobile-friendly layout.

## 🛠️ Technologies Used

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript, Chart.js, Lucide Icons.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (via Mongoose).
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt.js.

## 📂 Project Structure

```text
expense-tracker/
├── frontend/
│   ├── index.html      # Main HTML structure
│   ├── style.css       # Pastel aesthetic and animations
│   └── script.js       # Frontend logic and API calls
├── backend/
│   ├── server.js       # Express server entry point
│   ├── routes/         # API Route definitions
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Business logic for routes
│   └── middleware/     # Auth protection middleware
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── README.md           # Documentation
```

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) installed on your machine.
-   [MongoDB](https://www.mongodb.com/) installed locally or a MongoDB Atlas account.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/expense-tracker.git
    cd expense-tracker
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/expense_tracker
    JWT_SECRET=your_secret_key
    ```

### Running the Project

1.  **Start the MongoDB server** (if running locally).
2.  **Start the backend server**:
    ```bash
    npm run dev
    ```
3.  **Open the frontend**:
    Simply open `frontend/index.html` in your browser.

## 🔮 Future Improvements

-   [ ] Email notifications for monthly summaries.
-   [ ] Export data to CSV or PDF (Budget Plan format).
-   [ ] Multi-currency support.
-   [ ] Recurring transactions (subscriptions).

## 👤 Author

**Your Name / Antigravity AI**
-   GitHub: [Your Profile](https://github.com/yourusername)
-   Portfolio: [Your Website](https://yourportfolio.com)

---
*Created with ❤️ for beginners to learn full-stack development.*
