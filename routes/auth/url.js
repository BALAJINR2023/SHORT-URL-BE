import express from 'express';
import { UrlModel } from '../../db/Models.js';
import { v4 as uuidv4 } from 'uuid';
const urlRouter = express.Router();

// Create a short URL
urlRouter.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    // Validate original URL
    if (!originalUrl || typeof originalUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate a unique ID and build the short URL
   
    const urlId = uuidv4();
    const shortUrl = `${urlId}`;
    
    try {
        // Create and save the new URL entry
        const newUrl = new UrlModel({
            originalUrl,
            shortUrl,
            urlId // Store the URL ID for future reference
        });
        
        await newUrl.save();
        
        // Respond with the shortened URL
        res.status(201).json({
            msg: 'URL shortened successfully',
            shortUrl,
            urlId
        });
    } catch (error) {
        console.error('Error saving URL:', error);
        res.status(500).json({ error: 'Failed to shorten URL' });
    }
});

// Redirect to the original URL
urlRouter.get('/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    // console.log('Received shortUrl:', shortUrl);
    try {
        const url = await UrlModel.findOneAndUpdate(
            { shortUrl },
            { $inc: { clicks: 1 } }, // Increment clicks by 1
            { new: true } // Return the updated document
        );
        // console.log('Found URL:', url);
        if (url) {
            res.redirect(url.originalUrl);
            console.log('Redirecting to:', url.originalUrl);
        } else {
            res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve URL', error });
    }
});

export default urlRouter;
