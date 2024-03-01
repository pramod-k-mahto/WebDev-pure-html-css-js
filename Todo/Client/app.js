const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
});

// Middleware to parse the incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files (e.g., HTML, CSS)
app.use(express.static('public'));

// Function to create the database and table if they don't exist
const createDatabaseAndTable = () => {
  connection.query(
    'CREATE DATABASE IF NOT EXISTS todo',
    (createDbError, createDbResult) => {
      if (createDbError) {
        console.error('Error creating database:', createDbError.message);
        return;
      }

      console.log('Database "todo" created or already exists');

      connection.query('USE todo', (useDbError, useDbResult) => {
        if (useDbError) {
          console.error('Error using database:', useDbError.message);
          return;
        }

        console.log('Using database "todo"');

        connection.query(
          'CREATE TABLE IF NOT EXISTS todolist (idtodolist INT AUTO_INCREMENT PRIMARY KEY, list VARCHAR(255))',
          (createTableError, createTableResult) => {
            if (createTableError) {
              console.error('Error creating todolist table:', createTableError.message);
              return;
            }

            console.log('Table "todolist" created or already exists');

            // Create the 'users' table if it doesn't exist
            connection.query(
              'CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL)',
              (createUsersTableError, createUsersTableResult) => {
                if (createUsersTableError) {
                  console.error('Error creating users table:', createUsersTableError.message);
                  return;
                }

                console.log('Table "users" created or already exists');
              }
            );
          }
        );
      });
    }
  );
};

// Call the function to create database and table
createDatabaseAndTable();

// Endpoint to handle the signup form submission
app.post('/users/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Insert data into the 'users' table
  const sql = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
  const values = [firstName, lastName, email, password];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Signup successful');
      res.status(200).send('Signup successful');
    }
  });
});

// Endpoint to get to-do list data
app.get('/todolist', (req, res) => {
  connection.query('SELECT * FROM todolist', (error, rows) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(rows);
    }
  });
});

// Endpoint to add a to-do list item
app.post('/todolist', (req, res) => {
  const { list } = req.body;

  const sql = 'INSERT INTO todolist (list) VALUES (?)';
  const values = [list];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Insertion successful');
      res.json({ "status": 200 });
    }
  });
});

// Endpoint to delete a to-do list item
app.delete('/todolist/:id', (req, res) => {
  const itemId = req.params.id;

  const sql = 'DELETE FROM todolist WHERE idtodolist = ?';
  connection.query(sql, [itemId], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Deletion successful');
      res.send('Deleted successfully');
    }
  });
});

// Endpoint to update a to-do list item
app.post('/todolist/update/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  const { list } = req.body;

  const sql = 'UPDATE todolist SET list=? WHERE idtodolist=?';
  const values = [list, itemId];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error updating item data:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Item data updated successfully');
      res.json({ "status": 200 });
    }
  });
});
// Endpoint to handle the login form submission
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  // Check the user's credentials
  connection.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) {
        console.error('Error checking credentials:', error);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          console.log('Login successful');
          res.status(200).send('Login successful');
        } else {
          console.log('Invalid credentials');
          res.status(401).send('Invalid credentials');
        }
      }
    }
  );
});
// Start the server
app.listen(PORT, () => {
  console.log(`App is listening at port number http://localhost:${PORT}`);
});
