import { useState, useEffect } from "react";
import { fetchArchive, fetchTopStories } from "./services/nytApi";

function App() {
  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "Top Stories") return;

    const loadArticles = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      setLoading(true);
      try {
        const data = await fetchTopStories();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [activeTab]);
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
                    <a href={article.url}>{article.title}</a>
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
