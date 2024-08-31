import express from 'express';
import { UrlModel } from '../../db/Models.js';
const urlstic = express.Router();

// Get all URLs
urlstic.get('/urls', async (req, res) => {
    try {
        const urls = await UrlModel.find().sort({ createdAt: -1 });
        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
});

// Get URL creation stats
urlstic.get('/stats', async (req, res) => {
    try {
        const dailyCount = await UrlModel.aggregate([
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const monthlyCount = await UrlModel.aggregate([
            { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({ dailyCount, monthlyCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default urlstic;
