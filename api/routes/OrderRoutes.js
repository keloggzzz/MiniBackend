import express from "express";
const orderRouter = express.Router();
import pool from "./PoolConnection.js";


orderRouter.get("/orders", async (req, res) => {
    try {
        const result = await pool.query("SELECT * from orders");
        res.json({ rows: result.rows });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Database query failed" });
    }
});

 //get a single order. must say getorder?id=#
orderRouter.get("/getOrder", async (req, res) => {
   
        try {
            var id1 = req.query.id;
            console.log(id1);
            const result = await pool.query("SELECT * from orders where id=" + id1);
            console.log(result);
            res.json({ rows: result.rows });
            //   console.log(result.rows.length);
        } catch (error) {
            console.error("Query error:", error);
            res.json({ rows: [] });
        }
    });

//deleting a single order. must say delOrder?id=#
orderRouter.delete("/delOrder", async (req, res) => {
    try {
        var id1 = req.query.id;
        console.log(id1);
        const result = await pool.query("DELETE from orders where id=" + id1);
        console.log(result);
        res.json({ ans: "Successfully Deleted" });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.json({ ans: "Not Deleted" });
    }
});

export default orderRouter;