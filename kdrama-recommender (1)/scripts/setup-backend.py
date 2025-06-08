import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Global variables to store the processed data
df = None
cosine_sim = None
indices = None

def load_and_process_data():
    """Load and process the K-drama dataset from URL"""
    global df, cosine_sim, indices
    
    try:
        # Fetch the CSV data from the provided URL
        csv_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kdrama-djhA9j8FqLIKfjNBgpDlP3Jg5WgFsk.csv"
        print("Fetching K-drama dataset from URL...")
        
        # Download the CSV file
        response = requests.get(csv_url)
        response.raise_for_status()
        
        # Save temporarily and load with pandas
        with open('temp_kdrama.csv', 'wb') as f:
            f.write(response.content)
        
        # Load the dataset
        try:
            df = pd.read_csv('temp_kdrama.csv', encoding='utf-8')
        except UnicodeDecodeError:
            df = pd.read_csv('temp_kdrama.csv', encoding='latin1')
        
        print(f"Successfully loaded {len(df)} K-dramas from dataset")
        print("Dataset columns:", df.columns.tolist())
        
        # Rename columns to match our expected names
        df = df.rename(columns={
            'Name': 'title',
            'Synopsis': 'synopsis',
            'Genre': 'genres',
            'Tags': 'tags',
            'Cast': 'cast',
            'Director': 'director',
            'Rating': 'rating',
            'Year of release': 'year',
            'Number of Episodes': 'episodes',
            'Original Network': 'network'
        })
        
        # Handle missing values by filling them with empty strings
        for col in ['synopsis', 'genres', 'tags', 'cast', 'director']:
            if col in df.columns:
                df[col] = df[col].fillna('')
            else:
                print(f"Warning: Column '{col}' not found in dataset")
        
        # Clean and prepare the data
        print("Processing text data for recommendations...")
        
        # Combine all relevant text features into a single 'soup' column
        df['soup'] = (
            df['synopsis'].astype(str) + ' ' + 
            df['genres'].astype(str) + ' ' + 
            df['tags'].astype(str) + ' ' + 
            df['cast'].astype(str) + ' ' + 
            df['director'].astype(str)
        )
        
        # Clean the 'soup' text
        def clean_text(text):
            text = str(text).lower()
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        
        df['soup'] = df['soup'].apply(clean_text)
        
        # Create TF-IDF matrix
        print("Creating TF-IDF matrix...")
        tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
        tfidf_matrix = tfidf.fit_transform(df['soup'])
        
        # Calculate cosine similarity
        print("Calculating similarity matrix...")
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
        
        # Create indices mapping
        indices = pd.Series(df.index, index=df['title']).drop_duplicates()
        
        print("Backend data loaded and processed successfully!")
        print(f"Sample dramas: {df['title'].head().tolist()}")
        
        # Clean up temporary file
        import os
        if os.path.exists('temp_kdrama.csv'):
            os.remove('temp_kdrama.csv')
            
    except Exception as e:
        print(f"Error loading dataset: {e}")
        raise e

@app.route('/api/dramas', methods=['GET'])
def get_dramas():
    """Get all available dramas with additional info"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    # Select relevant columns and convert to dict
    columns_to_include = ['title', 'synopsis', 'genres', 'rating', 'year', 'episodes', 'network']
    available_columns = [col for col in columns_to_include if col in df.columns]
    
    dramas = df[available_columns].to_dict('records')
    
    # Clean up any NaN values
    for drama in dramas:
        for key, value in drama.items():
            if pd.isna(value):
                drama[key] = '' if key in ['synopsis', 'genres'] else None
    
    return jsonify(dramas)

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Get recommendations for a given drama"""
    if df is None or cosine_sim is None or indices is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    data = request.get_json()
    title = data.get('title', '').strip()
    
    if not title:
        return jsonify({'error': 'Title is required'}), 400
    
    # Check if title exists in our dataset
    if title not in indices:
        # Find similar titles (case-insensitive partial matching)
        all_titles = df['title'].tolist()
        matching_titles = [t for t in all_titles if title.lower() in t.lower()]
        
        if not matching_titles:
            # Try reverse matching
            matching_titles = [t for t in all_titles if any(word.lower() in t.lower() for word in title.split())]
        
        return jsonify({
            'error': f"Drama '{title}' not found in our database",
            'suggestions': matching_titles[:10] if matching_titles else [],
            'total_dramas': len(df)
        }), 404
    
    try:
        # Get recommendations
        idx = indices[title]
        sim_scores = list(enumerate(cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Get top 10 most similar dramas (excluding the input drama itself)
        sim_scores = sim_scores[1:11]
        drama_indices = [i[0] for i in sim_scores]
        
        # Get recommendation details
        columns_to_include = ['title', 'synopsis', 'genres', 'rating', 'year', 'episodes', 'network']
        available_columns = [col for col in columns_to_include if col in df.columns]
        
        recommendations_df = df.iloc[drama_indices][available_columns]
        recommendations = recommendations_df.to_dict('records')
        
        # Clean up any NaN values and add similarity scores
        for i, drama in enumerate(recommendations):
            for key, value in drama.items():
                if pd.isna(value):
                    drama[key] = '' if key in ['synopsis', 'genres'] else None
            drama['similarity_score'] = round(sim_scores[i][1], 3)
        
        # Get input drama details
        input_drama_details = df[df['title'] == title][available_columns].iloc[0].to_dict()
        for key, value in input_drama_details.items():
            if pd.isna(value):
                input_drama_details[key] = '' if key in ['synopsis', 'genres'] else None
        
        return jsonify({
            'input_drama': input_drama_details,
            'recommendations': recommendations,
            'total_found': len(recommendations)
        })
        
    except Exception as e:
        return jsonify({'error': f'Error generating recommendations: {str(e)}'}), 500

@app.route('/api/search', methods=['GET'])
def search_dramas():
    """Search dramas by title"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    query = request.args.get('q', '').strip().lower()
    if not query:
        return jsonify([])
    
    # Filter dramas that match the search query
    matching_dramas = df[df['title'].str.lower().str.contains(query, na=False)]
    
    columns_to_include = ['title', 'synopsis', 'genres', 'rating', 'year']
    available_columns = [col for col in columns_to_include if col in df.columns]
    
    results = matching_dramas[available_columns].head(20).to_dict('records')
    
    # Clean up NaN values
    for drama in results:
        for key, value in drama.items():
            if pd.isna(value):
                drama[key] = '' if key in ['synopsis', 'genres'] else None
    
    return jsonify(results)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dataset statistics"""
    if df is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    stats = {
        'total_dramas': len(df),
        'unique_genres': len(df['genres'].dropna().unique()) if 'genres' in df.columns else 0,
        'year_range': {
            'min': int(df['year'].min()) if 'year' in df.columns and not df['year'].isna().all() else None,
            'max': int(df['year'].max()) if 'year' in df.columns and not df['year'].isna().all() else None
        },
        'avg_rating': round(df['rating'].mean(), 2) if 'rating' in df.columns and not df['rating'].isna().all() else None
    }
    
    return jsonify(stats)

if __name__ == '__main__':
    print("Starting K-Drama Recommender Backend...")
    load_and_process_data()
    print("Backend ready! Starting Flask server...")
    app.run(debug=True, port=5000, host='0.0.0.0')
