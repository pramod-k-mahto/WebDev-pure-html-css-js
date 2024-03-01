
const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/', quizRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
