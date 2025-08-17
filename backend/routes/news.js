const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    // 1. Fetch all stock tickers from our database
    const { rows: stocks } = await db.query('SELECT ticker FROM stocks');

    if (stocks.length === 0) {
      return res.json([]);
    }

    const tickers = stocks.map(s => s.ticker);
    const query = tickers.join(' OR ');

    // 2. Fetch news from NewsAPI
    const newsResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query,
        apiKey: process.env.NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20, // Limit the number of articles
      }
    });

    // 3. Format and send the response
    const articles = newsResponse.data.articles.map(article => ({
      title: article.title,
      source: article.source.name,
      summary: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt
    }));

    res.json(articles);

  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).send('Failed to fetch news');
  }
});

module.exports = router;
