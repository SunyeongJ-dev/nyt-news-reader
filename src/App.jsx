import { useState, useEffect } from "react";
import {
  fetchArchive,
  fetchTopStories,
  fetchMostPopular,
} from "./services/nytApi";

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

  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedSection, setSelectedSection] = useState("home");
  const [popularPeriod, setPopularPeriod] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
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
          fetchedArticles = []; // Bookmarks functionality not implemented yet
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
  ]);
  return (
    <>
      <header>
        <div class="container">
          <a href="index.html" class="logo">
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
        <input type="search" placeholder="Search articles..." />
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
      </div>
      <main>
        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          <ul className="article-list">
            {articles.map((article) => (
              <li key={article.id} className="article-item">
                <span className="article-number">
                  {articles.indexOf(article) + 1}
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
                <button class="bookmark-btn" title="Bookmark">
                  ☆
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div class="pagination">
        <a href="#">&lt; Prev</a> | <a href="#">Next &gt;</a>
      </div>

      <section id="chart-section">
        <h3>Article Analytics</h3>
        <div id="chart-placeholder">Chart will be displayed here.</div>
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
