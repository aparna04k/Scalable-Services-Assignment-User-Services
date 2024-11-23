const express = require('express');
const app = express();
const sequelize = require('./config/database');
require('dotenv').config();

app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});
