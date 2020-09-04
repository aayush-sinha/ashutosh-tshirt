require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const User = require("./models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
//ROUTES IMPORT
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoutes = require("./routes/paymentbRoutes");

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(authRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(paymentBRoutes);

//Testing
// app.get("/success",(req, res)=>{
//   res.json({
//     error: "no error"
//   })
// })


//DB CONNECTION
mongoose
  .connect('mongodb+srv://ashutosh07:ashutosh07@wearyourteecluster.igpz5.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
  


//ROUTES
app.get('/',(req,res)=>{
  res.send(200)
})
// app.post("/signup",(req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(422).json({
//       error: errors.array()[0].msg
//     });
//   }

//   const user = new User(req.body);
//   user.save((err, user) => {
//     if (err) {
//       return res.status(400).json({
//         err: "NOT able to save user in DB"
//       });
//     }
//     res.json({
//       name: user.name,
//       email: user.email,
//       id: user._id
//     });
//   });
// });


 
//PORTS
const port = process.env.PORT || 8000;

//SERVER LISTINING
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
