import 'dotenv/config';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors'; 

const app = express();
const PORT = 3000;
const NYT_API_KEY = process.env.NYT_API_KEY;

const corsOptions = {
    origin: 'http://localhost:5173', 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Node.js Server is Running');
});

// Archive API endpoint
app.get('/api/archive/:year/:month', async (req, res) => {
    const { year, month } = req.params;
    const nytUrl = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${NYT_API_KEY}`;
    
    try {
        const response = await fetch(nytUrl);
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'External API Error' }));
            return res.status(response.status).json(errorBody);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data from NYT Archive:", error);
        res.status(500).json({ error: "Internal server error during fetch." });
    }
});

// Top Stories API endpoint
app.get('/api/topstories/v2/:theme', async (req, res) => {
    const { theme } = req.params;
    const nytUrl = `https://api.nytimes.com/svc/topstories/v2/${theme}.json?api-key=${NYT_API_KEY}`;
    
    try {
        const response = await fetch(nytUrl);
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'External API Error' }));
            return res.status(response.status).json(errorBody);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data from NYT Top Stories:", error);
        res.status(500).json({ error: "Internal server error during fetch." });
    }
});

// Most Popular API endpoint
app.get('/api/mostpopular/v2/viewed/:period', async (req, res) => {
    const { period } = req.params;
    const nytUrl = `https://api.nytimes.com/svc/mostpopular/v2/viewed/${period}.json?api-key=${NYT_API_KEY}`;
    
    try {
        const response = await fetch(nytUrl);
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: 'External API Error' }));
            return res.status(response.status).json(errorBody);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data from NYT Most Popular:", error);
        res.status(500).json({ error: "Internal server error during fetch." });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});