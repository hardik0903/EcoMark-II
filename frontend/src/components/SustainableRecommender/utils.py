import json
import random
import google.generativeai as genai

API_KEY = "your_api_key"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-pro")

# Load activity-to-product mapping from JSON
with open("activity_product_mapping.json", "r") as file:
    ACTIVITY_PRODUCT_MAPPING = json.load(file)

def get_sustainable_recommendations(user_input):
    # AI-generated sustainable habits
    prompt = f"""
    Based on this daily routine: "{user_input}", suggest 5 sustainable habits.
    """
    try:
        response = model.generate_content(prompt)
        ai_suggestions = response.text.split("\n")[:5]  # Get top 5 sustainable habits
    except Exception as e:
        ai_suggestions = ["Use reusable water bottles", "Switch to LED bulbs", "Use public transport", 
                          "Recycle waste properly", "Opt for eco-friendly products"]

    # Select relevant sustainable products
    recommended_products = []
    for activity, products in ACTIVITY_PRODUCT_MAPPING.items():
        if activity in user_input.lower():
            recommended_products.extend(random.sample(products, min(5, len(products))))  # Pick up to 5 products

    if not recommended_products:
        all_products = sum(ACTIVITY_PRODUCT_MAPPING.values(), [])
        recommended_products = random.sample(all_products, 5)  # Pick random products if no match

    product_links = [(product, get_amazon_product_link(product)) for product in recommended_products]

    return {"habits": ai_suggestions, "products": product_links}

def get_amazon_product_link(product_name):
    base_url = "https://www.amazon.com/s?k="
    search_query = "+".join(product_name.split())
    return f"{base_url}{search_query}"
