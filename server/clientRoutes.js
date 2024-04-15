import express from "express";
import MySQLConnection from "./db.js";

const router = express.Router();
const mysqlConnection = new MySQLConnection();

router.get("/clients", (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    mysqlConnection.connection.query(
      "SELECT * FROM company_details",
      (err, results) => {
        if (err) {
          console.error("Error fetching clients:", err);
          return res.status(500).send("Error fetching clients");
        }
        res.status(200).json(results);
      }
    );
  } else {
    mysqlConnection.connection.query(
      "SELECT * FROM company_details WHERE companyname LIKE ? OR cin LIKE ? OR email = ? OR id = ?",
      [`%${searchTerm}%`, `%${searchTerm}%`, searchTerm, searchTerm],
      (err, results) => {
        if (err) {
          console.error("Error searching for clients:", err);
          return res.status(500).send("Error searching for clients");
        }
        res.status(200).json(results);
      }
    );
  }
});

router.post("/clients", (req, res) => {
  const newClient = req.body;
  mysqlConnection.connection.query(
    "INSERT INTO company_details SET ?",
    [newClient],
    (err, result) => {
      if (err) {
        console.error("Error creating client:", err);
        return res.status(500).send("Error creating client");
      }
      res
        .status(201)
        .json({ message: "Client created successfully", id: result.insertId });
    }
  );
});

router.post("/clients/:id", (req, res) => {
  const clientId = req.params.id;
  const updatedClient = req.body;
  mysqlConnection.connection.query(
    "UPDATE company_details SET ? WHERE id = ?",
    [updatedClient, clientId],
    (err, result) => {
      if (err) {
        console.error("Error updating client:", err);
        return res.status(500).send("Error updating client");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Client not found");
      }
      res.json({ message: "Client updated successfully" });
    }
  );
});

router.post("/clients/:id", (req, res) => {
  const clientId = req.params.id;
  const updatedClient = req.body;
  mysqlConnection.connection.query(
    "UPDATE company_details SET ? WHERE id = ?",
    [updatedClient, clientId],
    (err, result) => {
      if (err) {
        console.error("Error updating client:", err);
        return res.status(500).send("Error updating client");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Client not found");
      }
      res.json({ message: "Client updated successfully" });
    }
  );
});

router.delete("/clients/:id", (req, res) => {
  const clientId = req.params.id;
  mysqlConnection.connection.query(
    "DELETE FROM company_details WHERE id = ?",
    [clientId],
    (err, result) => {
      if (err) {
        console.error("Error deleting client:", err);
        return res.status(500).send("Error deleting client");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Client not found");
      }
      res.status(200).json({ message: "Client deleted successfully" });
    }
  );
});

export default router;
