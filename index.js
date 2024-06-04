require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const loginRoutes = require('./routes/loginRoutes');
const adminRoutes = require('./routes/adminRoutes');
const actionTeamRoutes = require('./routes/actionTeamRoutes');
const userReportRoutes = require('./routes/userReportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const helperRoutes = require('./routes/helperRoutes');
const pdf = require('./PDF/routePDF');

app.use(cors());
app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// landing page
app.get('/', (req, res) => {
    res.send('backend is running');
});

app.use('/user',loginRoutes);
app.use('/admin', adminRoutes);
app.use('/actionTeam',actionTeamRoutes);
app.use('/userReport',userReportRoutes);
app.use('/analytics',analyticsRoutes);
app.use('/helper', helperRoutes);
app.use('/PDF',pdf);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});