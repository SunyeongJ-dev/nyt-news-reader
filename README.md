# NYT News Reader

A full-stack web application that allows users to search New York Times archives and bookmark articles. Built with React, Node.js, Express, and MySQL.

## 🎯 Features

- **Archive Search**: Search NYT articles by date range with customizable sort options
- **Bookmarks**: Save and manage favorite articles with automatic persistence
- **Data Visualization**: View bookmark statistics with interactive charts (Chart.js)
- **Auto User ID**: Automatically generates and stores a unique user ID per browser (no login required)
- **Responsive UI**: Clean and classic interface

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Chart.js & react-chartjs-2
- CSS3

### Backend
- Node.js
- Express.js
- MySQL2
- CORS

### APIs
- New York Times Article Search API
- New York Times Top Stories API
- New York Times Most Popular API

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server 8.0
- NYT API Key ([Get one here](https://developer.nytimes.com/get-started))

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd nyt-news-reader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MySQL
- Install and start MySQL Server
- The database and tables will be created automatically on first run

### 4. Configure environment variables
Create a `.env` file in the root directory:
```env
NYT_API_KEY=your_nyt_api_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
```

### 5. Start the backend server
```bash
node server.js
```
Server will run on `http://localhost:3000`

### 6. Start the frontend development server
```bash
npm run dev
```
App will run on `http://localhost:5173`

## 📁 Project Structure

```
nyt-news-reader/
├── src/
│   ├── App.jsx              # Main React component
│   ├── main.jsx             # React entry point
│   ├── styles.css           # Styles
│   └── services/
│       └── nytApi.js        # NYT API service
├── server.js                # Express backend server
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── eslint.config.js         # ESLint configuration
├── .env                     # Environment variables (not tracked)
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README.md
```

## 🔌 API Endpoints

### Backend Endpoints

**NYT API Proxy Endpoints:**
- `GET /api/search` - Search NYT archives
  - Query params: `begin_date`, `end_date`, `sort`
- `GET /api/topstories/v2/:theme` - Get top stories by theme
  - Params: `theme` (e.g., home, world, business, etc.)
- `GET /api/mostpopular/v2/viewed/:period` - Get most popular articles
  - Params: `period` (1, 7, or 30 days)

**Bookmark Management Endpoints:**
- `GET /api/bookmarks` - Get bookmark IDs for a user
  - Query params: `userId`
  - Returns: Array of article IDs
- `GET /api/bookmarks/articles` - Get full bookmark data
  - Query params: `userId`
  - Returns: Array of bookmark objects with article details
- `POST /api/bookmarks` - Toggle bookmark (add/remove)
  - Body: `{ userId, articleId, articleData: { title, section, pub_date, url } }`
  - Returns: `{ bookmarked: true/false }`
- `DELETE /api/bookmarks/clear` - Clear all bookmarks for a user
  - Body: `{ userId }`
  - Returns: `{ success: true, deletedCount: number }`

## 📝 Usage

1. Enter a date range to search NYT archives
2. Browse search results
3. Click "Bookmark" to save articles
4. View your saved bookmarks in the sidebar
5. Check bookmark statistics in the chart section

**Note**: User ID is automatically generated and stored in browser's localStorage, so bookmarks persist per browser without requiring login/signup.

## 🎓 Course Project

This project was developed as part of a web development course assignment, focusing on:
- Full-stack application development
- RESTful API integration
- Database design and management
- Modern JavaScript (ES6+)
- Asynchronous programming
- Data visualization

## 📄 License

This is a course assignment project.
