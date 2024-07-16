
const express = require('express');
require("dotenv").config({ path: ".env" });
const sequelize = require('./config/dbConfig');
const cors = require("cors");
var bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
<<<<<<< HEAD
const questionAnswerRoutes = require('./routes/questionAnswerRoutes');
const adminRoutes =require('./routes/admin/adminRoutes')
=======
const adminRoutes = require('./routes/admin/adminRoutes')
const reviewRoutes = require('./routes/reviewRoute')
>>>>>>> c69375956770eb448d9edc72c39f9d5095d52d40




const app = express();
let port = process.env.PORT || 5050;


app.get('/', async (req, res) => {
  //   await News.create({
  //     description:"desc",
  //     image:"https://bne.jpg"


  //   })
  res.send('home')
});

//db connection
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

app.use(
  cors({
    origin: "*",
  })
);



//body parse
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware
app.use(express.json());
// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
// Use the news routes
app.use('/', newsRoutes);
// Use the questionAnswers routes
app.use('/api/questionAnswer', questionAnswerRoutes);

// Use the admin routes
app.use('/api', adminRoutes);
app.use('/api', reviewRoutes);


const errorMiddleWare = require('./middleware/errorMiddleWare')
app.use(errorMiddleWare);

