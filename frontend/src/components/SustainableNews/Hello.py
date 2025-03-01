import streamlit as st
from utils import get_climate_news

# Streamlit Page Config
st.set_page_config(
    page_title="Real-Time Climate Impact News & Alerts",
    page_icon="🌍",
    layout="wide"
)

# Title & Description
st.markdown("""
    # 🌍 Real-Time Climate Impact News & Alerts
    Stay updated with the latest climate policies, sustainability efforts, and environmental news specific to your city.
""")

# Input Field for City Name
city = st.text_input("Enter your city:", "")

# Button to Fetch News
if st.button("Get Climate News", use_container_width=True):
    if city.strip():
        news_articles = get_climate_news(city)

        # Display News
        st.markdown("## 📢 Latest Climate News in Your City:")
        for article in news_articles:
            st.markdown(f"- [{article['title']}]({article['url']})")
    else:
        st.warning("Please enter a city name to fetch news.")
