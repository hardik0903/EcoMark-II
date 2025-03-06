# app.py
# Requirements:
#   pip install flask flask-cors google-generativeai feedparser python-dotenv openai nltk scipy
# Also run:
#   python -c "import nltk; nltk.download('vader_lexicon')"

from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
import os
import json
import feedparser
import random
import re
import openai
from dotenv import load_dotenv
import hashlib  # if needed

# Setup NLTK VADER (for any endpoints that use it)
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

# Load environment variables if available
load_dotenv()

# In production, the build folder from your React app is located in ../frontend/build relative to app.py
app = Flask(__name__, static_folder="../frontend/build")
CORS(app)

# --------------------------
# API Endpoints (all prefixed with /api)
# --------------------------

with open("activity_product_mapping.json", "r") as file:
    ACTIVITY_PRODUCT_MAPPING = json.load(file)

MIN_USAGE_BOUND = 50    # kWh/month per capita for 100% score
MAX_USAGE_BOUND = 350   # kWh/month per capita for 0% score

def calculate_sustainability_score(usage, min_bound=MIN_USAGE_BOUND, max_bound=MAX_USAGE_BOUND):
    if usage <= min_bound:
        return 100
    elif usage >= max_bound:
        return 0
    else:
        return 100 - ((usage - min_bound) / (max_bound - min_bound) * 100)

def get_bell_curve_data(usage, min_bound=MIN_USAGE_BOUND, max_bound=MAX_USAGE_BOUND):
    import numpy as np
    import scipy.stats as stats
    x = np.linspace(0, max_bound + 50, 400).tolist()
    mean = (max_bound + min_bound) / 2
    std_dev = (max_bound - min_bound) / 6
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

# Example: Energy Analyzer API endpoint
@app.route('/api/energy-analyzer', methods=['POST'])
def energy_analyzer_api():
    data = request.json
    monthly_consumption = data.get('monthlyConsumption', 0)
    household_size = data.get('householdSize', 1)
    per_capita_consumption = monthly_consumption / household_size
    sustainability_score = calculate_sustainability_score(per_capita_consumption)
    bell_curve_data = get_bell_curve_data(per_capita_consumption)
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

# Gemini API configuration
openai.api_key = "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"  # (if needed elsewhere)

import google.generativeai as palm
from google.generativeai import GenerationConfig
palm.configure(api_key="AIzaSyBY_24wnWmxwNpjAzdi2CUQGJLfZh7b61U")  # Replace with your actual Gemini API key

# Create Gemini model instances
analysis_model = palm.GenerativeModel("gemini-pro")
score_model = palm.GenerativeModel("gemini-1.5-flash-latest")

# Fallback templates & data
FALLBACK_ANALYSIS_TEMPLATE = "No detailed sustainability analysis is available for {} at this time. However, {} shows some basic sustainable practices."
FALLBACK_CONTEXT_TEMPLATE = "No contextual summary is available for {}. Please refer to other reports for more details."
FALLBACK_SCORE = 50
FALLBACK_NEWS = [
    {"title": "General Sustainability Practices", "url": "https://example.com/general-sustainability"},
    {"title": "How to Shop Eco-Friendly", "url": "https://example.com/eco-friendly-tips"}
]

# Helper function: Get sustainability score via Gemini API
def get_sustainability_score(brand_name):
    prompt = (
        f"Based solely on the sustainability performance of the brand \"{brand_name}\", "
        f"provide a sustainability score as a percentage. "
        f"Return ONLY a JSON object in the following EXACT format: "
        f'{{"score": "x%"}}, where x is a numeric value between 0 and 100. '
        f"Do NOT include any additional text or commentary. "
        f"For example, if the score is 75%, return: {{\"score\": \"75%\"}}."
    )
    try:
        response = score_model.generate_content(prompt, generation_config=GenerationConfig(temperature=0, max_output_tokens=64))
        raw_text = response.text.strip()
        json_string = re.sub(r'```(json)?\n(.*)\n```', r'\2', raw_text, flags=re.DOTALL)
        json_response = json.loads(json_string)
        return json_response
    except Exception as e:
        print("Gemini score generation error:", e)
        return {"error": "Invalid response format", "raw_response": raw_text if 'raw_text' in locals() else ""}

# Sustainable Brands API endpoint
@app.route('/api/sustainable-brands', methods=['POST'])
def sustainable_brands_api():
    data = request.json
    brand_name = data.get('brandName', '').strip()
    if not brand_name:
        return jsonify({
            "brandName": "Unknown Brand",
            "analysis": FALLBACK_ANALYSIS_TEMPLATE.format("Unknown Brand", "this brand"),
            "context": FALLBACK_CONTEXT_TEMPLATE.format("Unknown Brand"),
            "score": None,
            "articles": FALLBACK_NEWS
        })
    final_response = {
        "brandName": brand_name,
        "analysis": "",
        "context": "",
        "score": None,
        "articles": FALLBACK_NEWS,
        "raw_score_response": ""
    }
    try:
        analysis_prompt = (
            f"Provide a detailed sustainability analysis for the brand \"{brand_name}\" in at least 3 paragraphs. "
            f"Then, on a new line, write 'Context:' followed by a brief contextual summary in at least 2 paragraphs. "
            f"Ensure that the delimiter 'Context:' appears exactly."
        )
        analysis_config = GenerationConfig(temperature=0.7, max_output_tokens=512)
        analysis_response = analysis_model.generate_content(analysis_prompt, generation_config=analysis_config)
        raw_text = analysis_response.text.strip()
        if "Context:" in raw_text:
            parts = raw_text.split("Context:")
            final_response["analysis"] = parts[0].strip()
            final_response["context"] = parts[1].strip()
        else:
            final_response["analysis"] = raw_text
            final_response["context"] = FALLBACK_CONTEXT_TEMPLATE.format(brand_name)
    except Exception as e:
        print("Gemini analysis error:", e)
        final_response["analysis"] = FALLBACK_ANALYSIS_TEMPLATE.format(brand_name, brand_name)
        final_response["context"] = FALLBACK_CONTEXT_TEMPLATE.format(brand_name)

    score_result = get_sustainability_score(brand_name)
    if "score" in score_result:
        match = re.search(r'(\d+)%', score_result["score"])
        if match:
            final_response["score"] = float(match.group(1))
        else:
            final_response["score"] = None
    else:
        final_response["score"] = None
    final_response["raw_score_response"] = score_result.get("raw_response", "")

    try:
        rss_url = f"https://news.google.com/rss/search?q={brand_name}+sustainability"
        feed = feedparser.parse(rss_url)
        articles = []
        for entry in feed.entries[:5]:
            articles.append({
                "title": entry.title,
                "url": entry.link
            })
        final_response["articles"] = articles if articles else FALLBACK_NEWS
    except Exception as e:
        print("News fetch error:", e)
    return jsonify(final_response)

# Sustainable News API endpoint
@app.route('/api/sustainable-news', methods=['POST'])
def sustainable_news_api():
    data = request.json
    brand = data.get('brand', '')
    if not brand:
        return jsonify({"error": "Brand name is required"}), 400
    rss_url = f"https://news.google.com/rss/search?q={brand}+sustainability"
    feed = feedparser.parse(rss_url)
    articles = []
    for entry in feed.entries[:5]:
        articles.append({
            "title": entry.title,
            "url": entry.link
        })
    if not articles:
        articles = FALLBACK_NEWS
    return jsonify({"brand": brand, "articles": articles})

# Sustainable Recommender API endpoint
@app.route('/api/sustainable-recommender', methods=['POST'])
def sustainable_recommender_api():
    data = request.json
    user_input = data.get('userInput', '')
    if not user_input:
        return jsonify({"error": "User input is required"}), 400
    prompt = f'Based on this daily routine: "{user_input}", suggest 5 sustainable habits.'
    try:
        response = palm.generate_content(prompt, generation_config=GenerationConfig(temperature=0.7, max_output_tokens=128))
        ai_suggestions = response.text.split("\n")[:5]
    except Exception as e:
        ai_suggestions = [
            "Use reusable water bottles",
            "Switch to LED bulbs",
            "Use public transport",
            "Recycle waste properly",
            "Opt for eco-friendly products"
        ]
    recommended_products = []
    for activity, products in ACTIVITY_PRODUCT_MAPPING.items():
        if activity in user_input.lower():
            recommended_products.extend(random.sample(products, min(5, len(products))))
    if not recommended_products:
        all_products = sum(ACTIVITY_PRODUCT_MAPPING.values(), [])
        recommended_products = random.sample(all_products, 5)
    # Modified to point to amazon.in instead of amazon.com
    product_links = [{
        "name": product,
        "url": f"https://www.amazon.in/s?k={product.replace(' ', '+')}"
    } for product in recommended_products]
    return jsonify({
        "userInput": user_input,
        "habits": ai_suggestions,
        "products": product_links
    })

# Raw Score Debug Endpoint
@app.route('/sustainable-brands/rawscore', methods=['GET'])
def raw_score_api():
    brand = request.args.get('brand', '').strip()
    if not brand:
        return jsonify({"error": "Brand parameter is required"}), 400
    try:
        score_prompt = (
            f"Based solely on the sustainability performance of the brand \"{brand}\", provide a sustainability score as a percentage. "
            f"Return ONLY a JSON object in the exact format: {{\"score\": \"x%\"}}, where x is a numeric value between 0 and 100. "
            f"Do NOT include any additional text or commentary."
        )
        model_instance = palm.GenerativeModel("gemini-1.5-flash-latest")
        score_config = GenerationConfig(temperature=0, max_output_tokens=64)
        score_response = model_instance.generate_content(score_prompt, generation_config=score_config)
        raw_text = score_response.text.strip()
        return jsonify({"brand": brand, "raw_score_response": raw_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------
# Static File Routes for Production (Single Build)
# --------------------------
# In production, after running "npm run build", your React app's build folder is in frontend/build.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    static_folder = os.path.join(os.getcwd(), "frontend", "build")
    if path and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    return send_from_directory(static_folder, "index.html")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
