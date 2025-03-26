import express from "express";
const userRouter = express.Router();
import pool from "./PoolConnection.js";

userRouter.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * from users");
        res.json({ rows: result.rows });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Database query failed" });
    }
});

 //get a single user. must say getUser?id=#
 userRouter.get("/getUser", async (req, res) => {
   
    try {
        var id1 = req.query.id;
        console.log(id1);
        const result = await pool.query("SELECT * from users where id=" + id1);
        console.log(result);
        res.json({ rows: result.rows });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.json({ rows: [] });
    }
});


//deleting a single user. must say delUser?id=#
userRouter.get("/delUser", async (req, res) => {
    try {
        var id1 = req.query.id;
        console.log(id1);
        const result = await pool.query("DELETE from users where id=" + id1);
        console.log(result);
        res.json({ ans: "Successfully Deleted" });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.json({ ans: "Not Deleted" });
    }
});

export default userRouter;