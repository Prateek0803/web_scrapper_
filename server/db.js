import mysql from "mysql";

class MySQLConnection {
  constructor() {
    this.connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "ykone",
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
