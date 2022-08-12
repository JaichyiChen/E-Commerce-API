require("dotenv").config();
//applies try and catch to all our controllers
require("express-async-errors");
//express
const express = require("express");
const app = express();

//rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
//database
const connectDB = require("./db/connect");

//Router
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRotues");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");

//middleware
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// image and fileuploads
app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("e-commerce-api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

//error handler for 404
app.use(notFoundMiddleware);
//only invoked if the route exist and within that route we get some sort of error
app.use(errorHandlerMiddleware);

//port
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
