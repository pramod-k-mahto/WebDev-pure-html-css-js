const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'webquiz'
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  connection.query('CREATE DATABASE IF NOT EXISTS webquiz', (err) => {
    if (err) {
      console.error('Error creating database:', err);
      connection.release();
      return;
    }

    connection.query('USE webquiz', (err) => {
      if (err) {
        console.error('Error selecting database:', err);
        connection.release();
        return;
      }

      const createSchemaSql = `
        CREATE TABLE IF NOT EXISTS questions (
          id INT PRIMARY KEY AUTO_INCREMENT,
          question_text VARCHAR(255),
          options JSON,
          correct_answer VARCHAR(255)
        );
      `;

      connection.query(createSchemaSql, (err) => {
        if (err) {
          console.error('Error creating schema:', err);
        }

        connection.release();
      });
    });
  });
});

module.exports = pool;
