# K-Drama Recommender System

A beautiful AI-powered K-drama recommendation website built with Next.js and Python Flask.

# Live Preview
![image](https://github.com/user-attachments/assets/99357e2b-e380-4d31-aa63-4c7b0c09204a)


## Features

- 🎬 Browse 250+ K-dramas with ratings, genres, and details
- 🤖 AI-powered recommendations using TF-IDF similarity
- 🔍 Real-time search functionality
- 📱 Responsive design with pastel colors
- ⭐ Similarity scores for recommendations
- 🎨 Beautiful UI with K-drama themed images

## Tech Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components

**Backend:**
- Python Flask
- Pandas
- Scikit-learn
- TF-IDF Vectorization
- Cosine Similarity

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- VS Code (recommended)

### 1. Install Frontend Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Install Backend Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Start the Backend

\`\`\`bash
cd backend
python app.py
\`\`\`

The backend will:
- Download the K-drama dataset automatically
- Process the data for AI recommendations
- Start the Flask server on http://localhost:5000

### 4. Start the Frontend

\`\`\`bash
npm run dev
\`\`\`

The frontend will start on http://localhost:3000

## Usage

1. Open http://localhost:3000 in your browser
2. Search or browse through available K-dramas
3. Click on a drama you've watched and enjoyed
4. Get AI-powered recommendations with similarity scores!

## API Endpoints

- `GET /api/dramas` - Get all available dramas
- `POST /api/recommend` - Get recommendations for a drama
- `GET /api/search?q=query` - Search dramas by title
- `GET /api/stats` - Get dataset statistics


