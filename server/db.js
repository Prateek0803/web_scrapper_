import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

class MySQLConnection {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }

  connect() {
    this.connection.connect((err) => {
      if (err) throw err;
      console.log("Connected to MySQL database!");
    });
  }

  async insertData(data) {
    console.log(data);
    const sql = `INSERT INTO company_details SET ?`;

    this.connection.query(sql, data, (error, results, fields) => {
      if (error) {
        console.error("Error inserting data:", error);
        return;
      }
      console.log(
        "Data inserted successfully with rows effected",
        fields,
        results
      );
    });
  }
}

export default MySQLConnection;
