import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mysql from "mysql2";
import "dotenv/config";

const app = express();
const PORT = 3000;
const NYT_API_KEY = process.env.NYT_API_KEY;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");

  // Create database
  db.query(`CREATE DATABASE IF NOT EXISTS nyt_bookmarks`, (err) => {
    if (err) {
      console.error("Error creating nyt_bookmarks database:", err);
      return;
    }
    console.log("nyt_bookmarks database is ready.");

    // Select database
    db.query("USE nyt_bookmarks", (err) => {
      if (err) {
        console.error("Error selecting nyt_bookmarks database:", err);
        return;
      }
      console.log("Using nyt_bookmarks database.");

      // Create bookmarks table
      db.query(
        `
          CREATE TABLE IF NOT EXISTS bookmarks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          article_id VARCHAR(255) NOT NULL,
          title VARCHAR(500),
          section VARCHAR(100),
          pub_date VARCHAR(100),
          url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_bookmark (user_id, article_id)
          )
        `,
        (err) => {
          if (err) {
            console.error("Error creating bookmarks table:", err);
            return;
          }
          console.log("Bookmarks table is ready.");
        }
      );
    });
  });
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js Server is Running");
});

// Archive Search API endpoint
app.get("/api/search", async (req, res) => {
  const { begin_date, end_date, sort = "newest" } = req.query;

  const nytUrl =
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?` +
    `begin_date=${begin_date}&` +
    `end_date=${end_date}&` +
    `sort=${sort}&` +
    `api-key=${NYT_API_KEY}`;

  try {
    const response = await fetch(nytUrl);
    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: "External API Error" }));
      return res.status(response.status).json(errorBody);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching from NYT Search API:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Top Stories API endpoint
app.get("/api/topstories/v2/:theme", async (req, res) => {
  const { theme } = req.params;
  const nytUrl = `https://api.nytimes.com/svc/topstories/v2/${theme}.json?api-key=${NYT_API_KEY}`;

  try {
    const response = await fetch(nytUrl);
    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: "External API Error" }));
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
app.get("/api/mostpopular/v2/viewed/:period", async (req, res) => {
  const { period } = req.params;
  const nytUrl = `https://api.nytimes.com/svc/mostpopular/v2/viewed/${period}.json?api-key=${NYT_API_KEY}`;

  try {
    const response = await fetch(nytUrl);
    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: "External API Error" }));
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

// Bookmark toggle
app.post("/api/bookmarks", async (req, res) => {
  const { userId, articleId, articleData } = req.body;

  try {
    const [bookmarked] = await db
      .promise()
      .query("SELECT * FROM bookmarks WHERE user_id = ? AND article_id = ?", [
        userId,
        articleId,
      ]);

    if (bookmarked.length > 0) {
      await db
        .promise()
        .query("DELETE FROM bookmarks WHERE user_id = ? AND article_id = ?", [
          userId,
          articleId,
        ]);
      res.json({ bookmarked: false });
    } else {
      await db
        .promise()
        .query("INSERT INTO bookmarks (user_id, article_id, title, section, pub_date, url) VALUES (?, ?, ?, ?, ?, ?)", [
          userId,
          articleId,
          articleData.title,
          articleData.section,
          articleData.pub_date,
          articleData.url
        ]);
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ error: "DB error during bookmark toggle." });
  }
});

// Get bookmark IDs
app.get("/api/bookmarks", async (req, res) => {
  const { userId } = req.query;

  try {
    const [rows] = await db.promise().query(
      "SELECT article_id FROM bookmarks WHERE user_id = ?",
      [userId]
    );
    const ids = rows.map((row) => row.article_id);
    res.json(ids);

  } catch (error) {
    console.error("Error fetching bookmark IDs:", error);
    res.status(500).json({ error: "DB error during fetching bookmark IDs." });
  }
});

// Get bookmarks with full data
app.get("/api/bookmarks/articles", async (req, res) => {
  const { userId } = req.query;

 try {
    const [rows] = await db.promise().query(
      "SELECT article_id as id, title, section, pub_date, url FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ error: "DB error during fetching bookmarks." });
  }
});