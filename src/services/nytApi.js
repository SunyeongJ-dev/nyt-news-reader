const BASE_URL = "http://localhost:3000/api";

export const fetchArchive = async (year, month) => {
  const paddedMonth = String(month).padStart(2, "0");

  const beginDate = `${year}${paddedMonth}01`;
  const endDate = `${year}${paddedMonth}31`;

  const response = await fetch(
    `${BASE_URL}/search?begin_date=${beginDate}&end_date=${endDate}&sort=newest`
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
    .slice(0, 100);
};

export const fetchTopStories = async (theme = "home") => {
  const response = await fetch(`${BASE_URL}/topstories/v2/${theme}`);
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
    .slice(0, 100);
};

export const fetchMostPopular = async (period = 1) => {
  const response = await fetch(`${BASE_URL}/mostpopular/v2/viewed/${period}`);

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
    .slice(0, 100);
};
