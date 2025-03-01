import feedparser

def get_climate_news(city):
    """
    Fetches climate-related news for a specific city using Google News RSS Feeds.
    :param city: The city name entered by the user.
    :return: A list of news articles with titles and URLs.
    """
    rss_url = f"https://news.google.com/rss/search?q={city}+climate+sustainability"

    # Parse the RSS feed
    feed = feedparser.parse(rss_url)

    # Extract top 5 news articles
    articles = []
    for entry in feed.entries[:5]:
        articles.append({
            "title": entry.title,
            "url": entry.link
        })

    # If no articles found, return a message
    return articles if articles else [{"title": "No city-specific news found", "url": "#"}]
