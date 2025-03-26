import express from "express";
const itemRouter = express.Router();
import pool from "./PoolConnection.js";


itemRouter.get("/items", async (req, res) => {
    try {
        const result = await pool.query("SELECT * from items");
        res.json({ rows: result.rows });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.status(500).json({ error: "Database query failed" });
    }
});

 //get a single item. must say getItem?id=#
 itemRouter.get("/getItem", async (req, res) => {
   
    try {
        var id1 = req.query.id;
        console.log(id1);
        const result = await pool.query("SELECT * from items where id=" + id1);
        console.log(result);
        res.json({ rows: result.rows });
        //   console.log(result.rows.length);
    } catch (error) {
        console.error("Query error:", error);
        res.json({ rows: [] });
    }
});

//deleting a single item. must say delBook?id=#
itemRouter.get("/delItem", async (req, res) => {
        try {
            var id1 = req.query.id;
            console.log(id1);
            const result = await pool.query("DELETE from items where id=" + id1);
            console.log(result);
            res.json({ ans: "Successfully Deleted" });
            //   console.log(result.rows.length);
        } catch (error) {
            console.error("Query error:", error);
            res.json({ ans: "Not Deleted" });
        }
    });


export default itemRouter;

