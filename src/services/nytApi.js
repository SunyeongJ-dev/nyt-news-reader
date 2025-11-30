const API_KEY = import.meta.env.VITE_NYT_API_KEY;

export const fetchArchive = async (year, month) => {
  const response = await fetch(
    `/nyt-api/svc/archive/v1/${year}/${month}.json?api-key=${API_KEY}`
  );
  // Authentication error handling
  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 200)}`);
  }
  const data = await response.json();
  return data.response.docs
    .map((doc) => ({
      id: doc._id,
      title: doc.headline.main,
      section: doc.section_name,
      pub_date: new Date(doc.pub_date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      url: doc.web_url,
    }))
    .slice(0, 30); // Limit to 30 articles
};

export const fetchTopStories = async (theme = "home") => {
  const response = await fetch(
    `/nyt-api/svc/topstories/v2/${theme}.json?api-key=${API_KEY}`
  );
  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.results
    .map((item) => ({
      id: item.uri,
      title: item.title,
      section: item.section,
      pub_date: new Date(item.published_date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      url: item.url,
    }))
    .slice(0, 30);
};

export const fetchMostPopular = async (period = 1) => {
  const response = await fetch(
    `/nyt-api/svc/mostpopular/v2/viewed/${period}.json?api-key=${API_KEY}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(errorText);
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();

  return data.results
    .map((item) => ({
      id: item.id,
      title: item.title,
      section: item.section,
      pub_date: new Date(item.published_date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      url: item.url,
    }))
    .slice(0, 30);
};
