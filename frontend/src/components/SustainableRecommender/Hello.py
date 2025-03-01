import streamlit as st
from utils import get_sustainable_recommendations

st.title("Sustainable Living Recommender 🌱")

user_input = st.text_input("Enter your daily routine or activity:")

if st.button("Get Recommendations"):
    if user_input.strip():
        recommendations = get_sustainable_recommendations(user_input)
        st.subheader("🌿 Sustainable Habits:")
        for habit in recommendations["habits"]:
            st.write(f"- {habit}")

        st.subheader("🛒 Recommended Sustainable Products:")
        for product, link in recommendations["products"]:
            st.markdown(f"[{product}]({link})")
    else:
        st.warning("Please enter your daily routine or activity!")
