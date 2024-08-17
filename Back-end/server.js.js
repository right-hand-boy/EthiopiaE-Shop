const express = require("express");
const connectDB = require("./db/mongo");
const setupMiddleware = require("./Middleware/middleware"); // Import the middleware setup

// Import routes
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const profileImageRoute = require("./routes/profileImage"); // Import profile image route
const admin = require("./routes/admin"); // Import profile image route

const categoryRoutes = require("./routes/categoryRoutes");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");
const productsList = require("./routes/productsList");
const ProductDetail = require("./routes/productDetail");
const Search = require("./routes/search");
const Review = require("./routes/Review");
const app = express();

// Setup Middleware
setupMiddleware(app); // Apply middleware

// Connect to MongoDB
connectDB();

// Use CORS middleware
app.use(cors());
// Use routes
app.use("/", loginRoute);
app.use("/", signupRoute);
app.use("/profileImage", profileImageRoute);
// app.use("/admin", admin);
app.use("/admin", categoryRoutes);
app.use("/admin", productRoutes);
app.use("/", productsList);
app.use("/", ProductDetail);
app.use("/", Search);
app.use("/", Review);

// Global error handler
app.use(errorHandler);
// Start server

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
