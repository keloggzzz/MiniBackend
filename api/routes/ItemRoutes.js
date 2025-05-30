import express from "express";
const itemRouter = express.Router();
import pool from "./PoolConnection.js";


itemRouter.get("/items", async (req, res) => {
    console.log("Items called")
    try {
        const result = await pool.query("SELECT * from items");
        res.json({ rows: result.rows });
        console.log(result.rows.length);
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
itemRouter.delete("/delItem", async (req, res) => {
    console.log("delitem called"); // debug
    try {
        var id1 = req.query.id;
        console.log("deleting item #"+id1); //debug

        const result = await pool.query("DELETE FROM items WHERE id = $1", [id1]);
        console.log(result);
        res.json({ ans: "Successfully Deleted" });
    } catch (error) {
        console.error("Query error:", error);
        res.json({ ans: "Not Deleted" });
    }
});

    itemRouter.post("/addItem", async (req, res) => {
        console.log("additem called") //debug
        const { name, description, price, rarity, stock, picture } = req.body;
        console.log("inserting ", req.body)
      
        if (!name || !description) {
          return res.status(400).json({ success: false, error: "Missing required fields" });
        }
      
        try {
          const result = await pool.query(
            "INSERT INTO items (name, description, price, rarity, stock, picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, description, price, rarity, stock, picture || null]
          );
      
          res.status(201).json({ success: true, item: result.rows[0] });
        } catch (err) {
          console.error("Error adding item:", err);
          res.status(500).json({ success: false, error: "Server error" });
        }
      });

    itemRouter.put("/updateItem", async (req, res) => {
        console.log("Calling update item!") //debug
        try {
          const {id,name,description, price,rarity,stock,picture} = req.body;
          console.log("inserting ", req.body) //debug
      
          const qry = `
            UPDATE items
            SET name = $1, description = $2, price = $3, rarity = $4, stock = $5, picture = $6
            WHERE id = $7
          `;
      
          const values = [name, description, price, rarity, stock, picture, id];
          const result = await pool.query(qry, values);
      
          res.status(201).json({ success: true, item: result.rows[0] });
        } catch (error) {
          console.error("Query error:", error);
          res.status(500).json({ success: false, error: "Server error" });
        }
      });


export default itemRouter;

