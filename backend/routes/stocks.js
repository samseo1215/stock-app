const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT ticker FROM stocks');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a new stock
router.post('/', async (req, res) => {
  try {
    const { ticker } = req.body;
    if (!ticker) {
      return res.status(400).json({ msg: 'Please provide a ticker' });
    }
    // Convert to uppercase to maintain consistency
    const upperCaseTicker = ticker.toUpperCase();

    const newStock = await db.query(
      'INSERT INTO stocks (ticker) VALUES ($1) ON CONFLICT (ticker) DO NOTHING RETURNING *',
      [upperCaseTicker]
    );

    if (newStock.rows.length === 0) {
        return res.status(409).json({ msg: 'Stock already exists.' });
    }

    res.status(201).json(newStock.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a stock
router.delete('/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const upperCaseTicker = ticker.toUpperCase();

    const result = await db.query('DELETE FROM stocks WHERE ticker = $1 RETURNING *', [upperCaseTicker]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Stock not found' });
    }

    res.json({ msg: 'Stock deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
