import express from "express";
const orderRouter = express.Router();
import pool from "./PoolConnection.js";

//Changed orders table to be functional. All orders will be limited to three items. 
//Orders must be linked to a user, all items linked to an item in items table 
orderRouter.get("/orders", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT o.id, o.user_id, o.total_price, o.purchase_date,
               i1.name AS item1_name, i2.name AS item2_name, i3.name AS item3_name
        FROM orders o
        LEFT JOIN items i1 ON o.item1 = i1.id
        LEFT JOIN items i2 ON o.item2 = i2.id
        LEFT JOIN items i3 ON o.item3 = i3.id
      `);
      res.json({ rows: result.rows });
    } catch (error) {
      console.error("Query error:", error);
      res.status(500).json({ error: "Database query failed" });
    }
  });

 //Get a single order. must say getorder?id=#
 orderRouter.get("/getOrder", async (req, res) => {
    try {
      const id = parseInt(req.query.id);
      const result = await pool.query(`
        SELECT o.id, o.user_id, o.total_price, o.purchase_date,
               i1.name AS item1_name, i2.name AS item2_name, i3.name AS item3_name
        FROM orders o
        LEFT JOIN items i1 ON o.item1 = i1.id
        LEFT JOIN items i2 ON o.item2 = i2.id
        LEFT JOIN items i3 ON o.item3 = i3.id
        WHERE o.id = $1`, [id]);
  
      res.json({ rows: result.rows });
    } catch (error) {
      console.error("Query error:", error);
      res.status(500).json({ error: "Database query failed" });
    }
  });

//Deleting a single order. must say delOrder?id=#
orderRouter.delete("/delOrder", async (req, res) => {
    try {
      const id = parseInt(req.query.id);
      await pool.query("DELETE FROM orders WHERE id = $1", [id]);
      res.json({ ans: "Successfully Deleted" });
    } catch (error) {
      console.error("Query error:", error);
      res.status(500).json({ ans: "Not Deleted" });
    }
  });

  //Add an order; may not be used in current implementation to reduce complexity
  orderRouter.post("/addOrder", async (req, res) => {
    console.log("Adding Order...")
    try {
        const { user_id, item1, item2, item3 } = req.body;

        // Get all item prices to compute a total
        const items = [item1, item2, item3].filter(Boolean);
        const itemPrices = await Promise.all(
            items.map(id => pool.query("SELECT price FROM items WHERE id=$1", [id]))
        );

        const total_price = itemPrices.reduce((acc, res) => acc + Number(res.rows[0].price), 0);

        const result = await pool.query(`
            INSERT INTO orders (user_id, item1, item2, item3, total_price, purchase_date)
            VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
            RETURNING *;
        `, [user_id, item1 || null, item2 || null, item3 || null, total_price]);

        res.json({ success: true, order: result.rows[0] });
    } catch (error) {
        console.error("Add order error:", error);
        res.status(500).json({ success: false, error: "Failed to add order" });
    }
});

export default orderRouter;