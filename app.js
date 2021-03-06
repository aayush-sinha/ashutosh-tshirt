require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//DB CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
  
//ROUTES

//Auth

const {check, validationResult} = require("express-validator");
const {signout,signup,signin, isSignedIn} = require("./controllers/auth");

app.post("/signup",[
    check("name", "name should be atleast 3 letters").isLength({min: 3}),
    check("email", "email required").isEmail(),
    check("password").isLength({min: 8}).withMessage("Password should be atleast of 8 letters")
],signup);

app.post("/signin",[
    check("email", "email required").isEmail(),
    check("password").isLength({min: 1}).withMessage("Password field is req")
],signin);

app.get("/signout",signout);

app.get("/testroute", isSignedIn, (req,res)=>{
    res.json(req.auth);
})

// category

const { getCategoryByID, createCategory, getCategory, getAllCategory, updateCategory, removeCategory } = require("./controllers/category");
const { isAuthenticated, isAdmin } = require("./controllers/auth");
const { getUserByID } = require("./controllers/user");
app.param("userId", getUserByID);
app.param("categoryId", getCategoryByID);
app.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);
app.get("/category/:categoryId", getCategory);
app.get("/categories", getAllCategory);
app.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);
app.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory);

//order
const { pushOrderInPurchaseList } = require("./controllers/user");
const { updateStock } = require("./controllers/product");
const { getOrderById, createOrder, getAllorders, updateStatus, getOrderStatus } = require("./controllers/order");
app.param("userId", getUserByID);
app.param("orderId", getOrderById);
app.post("order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);
app.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllorders);
app.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
app.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

//payment


const { getToken, processPayment } = require("./controllers/paymentb");
app.param("userId", getUserByID);
app.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);
app.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

//product
const { getProductById, createProduct, getProduct, photo, removeProduct, updateProduct, getAllProducts, getAllUniqueCategories } = require("./controllers/product");
app.param("userId", getUserByID);
app.param("productId", getProductById);
app.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
app.get("/product/:productId", getProduct);
app.get("/product/photo/:productId", photo);
app.delete("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, removeProduct);
app.put("/product/:userId/:productId",  isSignedIn, isAuthenticated, isAdmin, updateProduct);
app.get("/products", getAllProducts);
app.get("/products/categories", getAllUniqueCategories);


//user

const {  getUser, updateUser, userPurchaseList, successMessage } = require("./controllers/user");
app.param("userId", getUserByID);
app.get("/user/:userId", isSignedIn, isAuthenticated ,getUser);
app.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
app.get("user/orders/:userId", isSignedIn, isAuthenticated, userPurchaseList);
app.get("user/orders/success", successMessage);

//PORTS
const port = process.env.PORT || 8000;

//SERVER LISTINING
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
