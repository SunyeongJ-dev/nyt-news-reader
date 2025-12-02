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

  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(year);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedTheme, setSelectedTheme] = useState("home");
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
          fetchedArticles = await fetchTopStories(selectedTheme);
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
    selectedTheme,
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
                    <span className="theme">{article.section} | </span>
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
