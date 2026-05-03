const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

app.use('/api/v1', routes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start', err);
    process.exit(1);
  });
