import { useState, useEffect } from "react";
import {
  fetchArchive,
  fetchTopStories,
  fetchMostPopular,
} from "./services/nytApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const years = Array.from({ length: 30 }, (_, i) => year - i);
  const sections = [
    "arts",
    "automobiles",
    "books",
    "business",
    "fashion",
    "food",
    "health",
    "insider",
    "magazine",
    "movies",
    "nyregion",
    "obituaries",
    "opinion",
    "politics",
    "realestate",
    "science",
    "sports",
    "sundayreview",
    "technology",
    "theater",
    "t-magazine",
    "travel",
    "upshot",
    "us",
    "world",
  ];

  // State variables
  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedSection, setSelectedSection] = useState("home");
  const [popularPeriod, setPopularPeriod] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const [userId, setUserId] = useState(null);

  // Pagination variables
  const articlesPerPage = 10;
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  // Variables for the chart
  const sectionCounts = articles.reduce((acc, article) => {
    const section = article.section || "Unknown";
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {});
  const chartData = {
    labels: Object.keys(sectionCounts),
    datasets: [
      {
        label: "Articles per Section",
        data: Object.values(sectionCounts),
        backgroundColor: "#567b95",
      },
    ],
  };

  // Set user ID and fetch bookmarks on initial load
  useEffect(() => {
    let id = localStorage.getItem("nyt_user_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("nyt_user_id", id);
    }
    setUserId(id);

    fetch(`http://localhost:3000/api/bookmarks?userId=${id}`)
      .then((response) => response.json())
      .then((savedIds) => setBookmarks(savedIds.bookmarks || []))
      .catch(() => setBookmarks([]));
  }, []);

  // Load articles when tabs or filters change
  useEffect(() => {
    if (activeTab === "Bookmarks" && !userId) {
      setLoading(false);
      setArticles([]);
      return;
    }

    const loadArticles = async () => {
      setLoading(true);
      setArticles([]);

      try {
        let fetchedArticles = [];

        if (activeTab === "All") {
          fetchedArticles = await fetchArchive(selectedYear, selectedMonth);
        } else if (activeTab === "Top Stories") {
          fetchedArticles = await fetchTopStories(selectedSection);
        } else if (activeTab === "Popular") {
          fetchedArticles = await fetchMostPopular(popularPeriod);
        } else if (activeTab === "Bookmarks") {
          const response = await fetch(
            `http://localhost:3000/api/bookmarks/articles?userId=${userId}`
          );
          fetchedArticles = await response.json();

          const bookmarkedIds = fetchedArticles.map((article) => article.id);
          setBookmarks(bookmarkedIds);
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          fetchedArticles = fetchedArticles.filter((article) =>
            article.title.toLowerCase().includes(query)
          );
        }

        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [
    activeTab,
    selectedYear,
    selectedMonth,
    searchQuery,
    selectedSection,
    popularPeriod,
    userId,
  ]);

  return (
    <>
      <header>
        <div className="container">
          <a href="index.html" className="logo">
            NYT
          </a>
          <nav>
            <a
              href=""
              className={activeTab === "All" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("All");
              }}
            >
              All
            </a>
            <a
              href=""
              className={activeTab === "Top Stories" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Top Stories");
              }}
            >
              Top Stories
            </a>
            <a
              href=""
              className={activeTab === "Popular" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Popular");
              }}
            >
              Popular
            </a>
            <a
              href=""
              className={activeTab === "Bookmarks" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Bookmarks");
              }}
            >
              Bookmarks
            </a>
          </nav>
        </div>
        <input
          type="search"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      <div className="filters">
        {activeTab === "All" && (
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {[...Array(12)].map((_, i) => {
                const monthNum = i + 1;
                const monthName = new Date(year, i).toLocaleString("en-CA", {
                  month: "long",
                });
                return (
                  <option key={monthNum} value={monthNum}>
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {activeTab === "Top Stories" && (
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="home">Home</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                    .replace("Nyregion", "NY Region")
                    .replace("T-magazine", "T Magazine")
                    .replace("Sundayreview", "Sunday Review")
                    .replace("Us", "US")}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeTab === "Popular" && (
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPopularPeriod(1);
              }}
              className={popularPeriod === 1 ? "active" : ""}
            >
              1 Day
            </a>
            |
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPopularPeriod(7);
              }}
              className={popularPeriod === 7 ? "active" : ""}
            >
              7 Days
            </a>
            |
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPopularPeriod(30);
              }}
              className={popularPeriod === 30 ? "active" : ""}
            >
              30 Days
            </a>
          </div>
        )}

        {activeTab === "Bookmarks" && bookmarks.length > 0 && (
          <div className="clear-bookmarks-container">
            <button
              className="clear-btn"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear all bookmarks?"
                  )
                ) {
                  fetch("http://localhost:3000/api/bookmarks/clear", {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userId }),
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      if (data.success) {
                        setBookmarks([]);
                        setArticles([]);
                      }
                    })
                    .catch((error) => {
                      console.error("Error clearing bookmarks:", error);
                      alert("Failed to clear bookmarks");
                    });
                }
              }}
            >
              Clear All Bookmarks
            </button>
          </div>
        )}
      </div>
      <main>
        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul className="article-list">
            {currentArticles.map((article, index) => (
              <li key={article.id} className="article-item">
                <span className="article-number">
                  {indexOfFirstArticle + index + 1}
                </span>
                <div className="article-content">
                  <h2 className="headline">
                    <a href={article.url} target="_blank">
                      {article.title}
                    </a>
                  </h2>
                  <p className="article-meta">
                    <span className="section">{article.section} | </span>
                    <span className="date">{article.pub_date}</span>
                  </p>
                </div>
                <button
                  className={`bookmark-btn ${
                    bookmarks.includes(article.id) ? "bookmarked" : ""
                  }`}
                  title="Bookmark"
                  onClick={() => {
                    fetch("http://localhost:3000/api/bookmarks", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userId,
                        articleId: article.id,
                        articleData: {
                          title: article.title,
                          section: article.section,
                          pub_date: article.pub_date,
                          url: article.url,
                        },
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.bookmarked) {
                          setBookmarks([...bookmarks, article.id]);
                        } else {
                          setBookmarks(
                            bookmarks.filter((id) => id !== article.id)
                          );
                        }
                      });
                  }}
                >
                  {bookmarks.includes(article.id) ? "★" : "☆"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div className="pagination">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) setCurrentPage(currentPage - 1);
          }}
        >
          ← Prev
        </a>

        <span>
          Page {currentPage} of {totalPages}{" "}
        </span>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
          }}
        >
          Next →
        </a>
      </div>

      <section id="chart-section">
        <h3>Article Analytics</h3>
        {articles.length > 0 ? (
          <div>
            <Bar data={chartData} />
          </div>
        ) : (
          <p>No analytics to display.</p>
        )}
      </section>

      <footer>
        <p>
          Data provided by
          <a href="https://developer.nytimes.com/" target="_blank">
            The New York Times
          </a>
        </p>
        <p>
          &copy; 2025 NYT News Archive |
          <a href="https://developer.nytimes.com/terms" target="_blank">
            API Terms of Use
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
