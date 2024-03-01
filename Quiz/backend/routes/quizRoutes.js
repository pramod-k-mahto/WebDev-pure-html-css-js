
const express = require('express');
const router = express.Router();
const connectionPool = require('../connection');
const bcrypt = require('bcrypt'); 

router.get('/', async (req, res) => {
 res.send("Home")
})


router.post('/addQuestion', async (req, res) => {
    const { questionText, options, correctAnswer } = req.body;
    console.log(req.body)
    try {

        const sql = 'INSERT INTO questions (question_text, options, correct_answer) VALUES (?, ?, ?)';
        await connectionPool.execute(sql, [questionText, JSON.stringify(options), correctAnswer]);

        res.redirect('/getQuiz');
    } catch (error) {
         console.error('Error adding question:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/getQuiz', async (req, res) => {
    try {
        const sql = 'SELECT * FROM questions ORDER BY RAND() LIMIT 10';
        connectionPool.query(sql, (error, result) => {
            if (error) {
                console.error('Error fetching questions:', error.message);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.render('quizPage', { questions: result });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/edit/:id', async (req, res) => {
    const questionId = req.params.id;

    try {
        const sql = 'SELECT * FROM questions WHERE id = ?';
        connectionPool.query(sql, [questionId], (error, result) => {
            if (error) {
                console.error('Error fetching question for edit:', error.message);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (result.length === 0) {
                res.status(404).send('Question not found');
                return;
            }

            const options = result[0].options;
            res.render('edit', { question: { ...result[0], options } });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/quiz', async (req, res) => {
    try {
        const sql = 'SELECT * FROM questions';
        connectionPool.query(sql, (error, result) => {
            if (error) {
                console.error('Error fetching questions:', error.message);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(result);
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/updateQuestion/:id', async (req, res) => {
    const questionId = req.params.id;
    const { questionText,options, correctAnswer } = req.body;
      const optionsArray = options.split(',');
     const optionsA= JSON.stringify(optionsArray)

    try {
        const sql = 'UPDATE questions SET question_text = ?, options = ?, correct_answer = ? WHERE id = ?';
         connectionPool.execute(sql, [questionText, optionsA, correctAnswer, questionId]);

        res.redirect('/getQuiz');
    } catch (error) {
        console.error('Error updating question:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/delete/:id', async (req, res) => {
    const questionId = req.params.id;

    try {
        const sql = 'DELETE FROM questions WHERE id = ?';
        await connectionPool.execute(sql, [questionId]);

        res.redirect('/getQuiz');
    } catch (error) {
        console.error('Error deleting question:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/submitContact', (req, res) => {
    console.log("from server")
    console.log("body",req.body)

    const { fname, lname, email, contact, message } = req.body;
    const sql = 'INSERT INTO contacts (first_name, last_name, email, contact_number, message) VALUES (?, ?, ?, ?, ?)';
    connectionPool.execute(sql, [fname, lname, email, contact, message], (error, results) => {
        if (error) {
            console.error('Error submitting contact:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Contact submitted successfully!');
            res.redirect('http://127.0.0.1:5500/screens/index.html#');

            // res.json({ success: true });


        }
    });
});


router.post('/signup', (req, res) => {
    const { first_name, last_name, email, pswd } = req.body;
    const password = bcrypt.hashSync(pswd, 10);

    const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    const values = [first_name, last_name, email, password];

    connectionPool.execute(sql, [first_name, last_name, email, password], (error, results) => {
        if (error) {
            console.error('Error submitting signup:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('signup submitted successfully!');
            res.redirect('http://127.0.0.1:5500/screens/login.html');

            // res.json({ success: true });


        }
    });
});


router.post('/login', (req, res) => {
    const { email, pswd } = req.body;

    // Fetch user from the database based on the provided email
    const sql = 'SELECT * FROM users WHERE email = ?';
    connectionPool.query(sql, [email], async (error, results) => {
        if (error) {
            console.error('Error fetching user for login:', error.message);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Invalid email or password');
            return;
        }

        const user = results[0];

        // Compare the entered password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(pswd, user.password);

        if (passwordMatch) {
            res.redirect('http://127.0.0.1:5500/screens/home.html#');

            // http://127.0.0.1:5500/screens/index.html
            // res.status(200).send('Login successful');
            // You may want to set a session or JWT token for authenticated users.
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});

module.exports = router;












// CREATE TABLE IF NOT EXISTS questions (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     question_text VARCHAR(255) NOT NULL,
//     options JSON NOT NULL,
//     correct_answer VARCHAR(255) NOT NULL
// );




// CREATE TABLE IF NOT EXISTS users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     fname VARCHAR(50) NOT NULL,
//     lname VARCHAR(50) NOT NULL,
//     email VARCHAR(100) NOT NULL,
//     contact VARCHAR(20) NOT NULL,
//     message TEXT NOT NULL
// );
