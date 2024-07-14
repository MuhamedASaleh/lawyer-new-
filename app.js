
const express = require('express');
require("dotenv").config({ path: ".env" });
const sequelize = require('./config/dbConfig');
const cors = require("cors");
var bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const adminRoutes =require('./routes/admin/adminRoutes')




const app = express();
 let port =process.env.PORT || 8000 ;


app.get('/', async(req, res) => {
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

// Use the admin routes
app.use('/api', adminRoutes);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  