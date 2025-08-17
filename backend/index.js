require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// For production, you should configure CORS more securely
// app.use(cors({ origin: 'https://your-vercel-frontend-url.vercel.app' }));
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

const stockRoutes = require('./routes/stocks');
const newsRoutes = require('./routes/news');

app.use('/api/stocks', stockRoutes);
app.use('/api/news', newsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
