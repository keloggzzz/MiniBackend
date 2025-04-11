import express from "express";
import cors from "cors";
import pg from "pg";
import pool from "./routes/PoolConnection.js";
import userRouter from "./routes/UserRoutes.js";
import itemRouter from "./routes/ItemRoutes.js";
import orderRouter from "./routes/OrderRoutes.js";

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true
}));


app.use("/items", itemRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
  //anything with /items should be redirected to the itemRouter. 
  //anything with /users should be redirected to the userRouter.
  //anything with /order should be redirected to the orderRouter.

//******************************************************************** */


app.get("/",(req,res)=>{
    try { res.send("This is the server for Kelis's mini project!!"); }
    catch (error) { console.error("Query error:", error);
    res.send(" Sorry Error")
   }
});



app.listen(3000, () => console.log("Server ready on port 3000."));