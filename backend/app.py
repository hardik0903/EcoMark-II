# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import numpy as np
import scipy.stats as stats
import google.generativeai as genai
import feedparser
import random
from dotenv import load_dotenv

# Load environment variables from .env file (if present)
load_dotenv()

# Set up Flask to serve the React build folder
# Adjust the static_folder path based on your folder structure
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)  # Enable CORS for all routes

# Load Google API key from environment variable, fallback to hardcoded key (not recommended for production)
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Google Gemini AI with the API key
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel(model_name="gemini-pro")

# Load activity-to-product mapping from JSON
with open("activity_product_mapping.json", "r") as file:
    ACTIVITY_PRODUCT_MAPPING = json.load(file)

# Energy Analyzer Constants
MIN_USAGE_BOUND = 50   # kWh/month per capita for 100% score
MAX_USAGE_BOUND = 350  # kWh/month per capita for 0% score

# Energy Analyzer Functions
def calculate_sustainability_score(usage, min_bound=MIN_USAGE_BOUND, max_bound=MAX_USAGE_BOUND):
    if usage <= min_bound:
        return 100
    elif usage >= max_bound:
        return 0
    else:
        # Linear interpolation between min_bound and max_bound
        return 100 - ((usage - min_bound) / (max_bound - min_bound) * 100)

def get_bell_curve_data(usage, min_bound=MIN_USAGE_BOUND, max_bound=MAX_USAGE_BOUND):
    # Generate x values for the bell curve
    x = np.linspace(0, max_bound + 50, 400).tolist()
    # Use a standard normal distribution centered at the midpoint between the bounds
    mean = (max_bound + min_bound) / 2
    std_dev = (max_bound - min_bound) / 6  # Empirical rule: 99.7% within 3 std dev
    y = stats.norm.pdf(x, mean, std_dev).tolist()
    return {
        "x": x,
        "y": y,
        "usage": usage,
        "usage_y": stats.norm.pdf(usage, mean, std_dev).item(),
        "min_bound": min_bound,
        "max_bound": max_bound,
        "mean": mean,
        "std_dev": std_dev
    }

# Route for Energy Analyzer
@app.route('/api/energy-analyzer', methods=['POST'])
def energy_analyzer():
    data = request.json
    monthly_consumption = data.get('monthlyConsumption', 0)
    household_size = data.get('householdSize', 1)
    # Calculate per capita consumption
    per_capita_consumption = monthly_consumption / household_size
    # Calculate sustainability score and bell curve data
    sustainability_score = calculate_sustainability_score(per_capita_consumption)
    bell_curve_data = get_bell_curve_data(per_capita_consumption)
    
    # Generate recommendations based on score
    if sustainability_score <= 50:
        recommendations = [
            "Use energy-efficient appliances and lighting.",
            "Insulate your home to reduce heating and cooling costs.",
            "Implement smarter energy usage behaviors, such as turning off lights when not needed."
        ]
    else:
        recommendations = [
            "Maintain your energy-efficient habits.",
            "Consider investing in renewable energy sources like solar panels.",
            "Advocate for energy conservation in your community."
        ]
    
    return jsonify({
        "perCapitaConsumption": per_capita_consumption,
        "sustainabilityScore": sustainability_score,
        "bellCurveData": bell_curve_data,
        "recommendations": recommendations
    })

# Route for Sustainable Brands
@app.route('/api/sustainable-brands', methods=['POST'])
def sustainable_brands():
    data = request.json
    brand_name = data.get('brandName', '')
    
    if not brand_name:
        return jsonify({"error": "Brand name is required"}), 400
    
    # Gemini prompt for brand analysis
    initial_prompt = f"""gather and process information from various sources, including corporate sustainability reports, news articles, and online reviews.
    - The analysis highlights the brand's efforts in areas such as energy efficiency, waste reduction, and ethical sourcing, enabling users to support environmentally responsible companies.
    GENERATE BRAND ANALYSIS OF THIS: {brand_name}"""
    
    try:
        # Get brand analysis and score from Gemini
        response = gemini_model.generate_content(initial_prompt)
        analysis = response.text
        
        score_prompt = "give the json_format and don't input anything else than json; sustain score in this format {score:x%}"
        score_response = gemini_model.generate_content(score_prompt)
        score_text = score_response.text
        
        import re
        match = re.search(r'(\d+)%', score_text)
        if match:
            score_value = float(match.group(1))
        else:
            score_value = 50  # Default value
        
        return jsonify({
            "brandName": brand_name,
            "analysis": analysis,
            "score": score_value
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for Sustainable News
@app.route('/api/sustainable-news', methods=['POST'])
def sustainable_news():
    data = request.json
    city = data.get('city', '')
    
    if not city:
        return jsonify({"error": "City name is required"}), 400
    
    # Fetch climate news via Google News RSS
    rss_url = f"https://news.google.com/rss/search?q={city}+climate+sustainability"
    feed = feedparser.parse(rss_url)
    
    articles = []
    for entry in feed.entries[:5]:
        articles.append({
            "title": entry.title,
            "url": entry.link
        })
    
    if not articles:
        articles = [{"title": "No city-specific news found", "url": "#"}]
    
    return jsonify({
        "city": city,
        "articles": articles
    })

# Route for Sustainable Recommender
@app.route('/api/sustainable-recommender', methods=['POST'])
def sustainable_recommender():
    data = request.json
    user_input = data.get('userInput', '')
    
    if not user_input:
        return jsonify({"error": "User input is required"}), 400
    
    # AI-generated sustainable habits prompt
    prompt = f"""
    Based on this daily routine: "{user_input}", suggest 5 sustainable habits.
    """
    
    try:
        response = gemini_model.generate_content(prompt)
        ai_suggestions = response.text.split("\n")[:5]  # Top 5 suggestions
    except Exception as e:
        ai_suggestions = [
            "Use reusable water bottles", 
            "Switch to LED bulbs", 
            "Use public transport", 
            "Recycle waste properly", 
            "Opt for eco-friendly products"
        ]
    
    # Select recommended products based on user input activities
    recommended_products = []
    for activity, products in ACTIVITY_PRODUCT_MAPPING.items():
        if activity in user_input.lower():
            recommended_products.extend(random.sample(products, min(5, len(products))))
    
    if not recommended_products:
        all_products = sum(ACTIVITY_PRODUCT_MAPPING.values(), [])
        recommended_products = random.sample(all_products, 5)
    
    product_links = [{
        "name": product,
        "url": f"https://www.amazon.com/s?k={'+'.join(product.split())}"
    } for product in recommended_products]
    
    return jsonify({
        "userInput": user_input,
        "habits": ai_suggestions,
        "products": product_links
    })

# Serve static files for production (React build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Check if the requested file exists in the build folder
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Otherwise, serve index.html (React handles routing)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
