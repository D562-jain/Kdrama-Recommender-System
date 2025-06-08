# VS Code Setup Instructions

## Step-by-Step Guide to Run the K-Drama Recommender in VS Code

### 1. Download and Extract the Project

1. Download the project ZIP file
2. Extract it to your desired location (e.g., `C:\Projects\kdrama-recommender`)
3. Open VS Code
4. Go to `File > Open Folder` and select the extracted project folder

### 2. Install Required Extensions (Recommended)

Install these VS Code extensions for the best development experience:

- **Python** (by Microsoft)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Prettier - Code formatter**

### 3. Set Up Python Environment

#### Option A: Using VS Code's Built-in Terminal

1. Open VS Code terminal: `View > Terminal` or `Ctrl+`` (backtick)
2. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   \`\`\`
3. Activate the virtual environment:
   - **Windows:**
     \`\`\`bash
     venv\Scripts\activate
     \`\`\`
   - **macOS/Linux:**
     \`\`\`bash
     source venv/bin/activate
     \`\`\`
4. Install Python dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

#### Option B: Using VS Code Python Interpreter

1. Press `Ctrl+Shift+P` to open command palette
2. Type "Python: Select Interpreter"
3. Choose "Create Virtual Environment"
4. Select "venv" and choose your Python installation
5. VS Code will create and activate the virtual environment
6. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

### 4. Set Up Node.js Environment

1. Make sure you have Node.js 18+ installed
2. In the VS Code terminal, run:
   \`\`\`bash
   npm install
   \`\`\`

### 5. Running the Application

#### Method 1: Using VS Code Tasks (Recommended)

1. Press `Ctrl+Shift+P` and type "Tasks: Run Task"
2. You can create custom tasks or use the terminal

#### Method 2: Using Multiple Terminals

1. **Start the Backend:**
   - Open a new terminal: `Terminal > New Terminal`
   - Navigate to backend folder:
     \`\`\`bash
     cd backend
     \`\`\`
   - Run the Flask app:
     \`\`\`bash
     python app.py
     \`\`\`
   - You should see: "Backend ready! Starting Flask server..."

2. **Start the Frontend:**
   - Open another terminal: `Terminal > New Terminal`
   - In the root directory, run:
     \`\`\`bash
     npm run dev
     \`\`\`
   - You should see: "Local: http://localhost:3000"

### 6. Verify Everything is Working

1. **Backend Check:**
   - Go to http://localhost:5000/api/stats
   - You should see JSON data with drama statistics

2. **Frontend Check:**
   - Go to http://localhost:3000
   - You should see the K-Drama Finder website

3. **Full Integration Check:**
   - Search for a drama (e.g., "Crash Landing on You")
   - Click on it to get recommendations
   - Verify you see similarity scores and recommendations

### 7. VS Code Workspace Configuration

Create a `.vscode/settings.json` file in your project root:

\`\`\`json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
\`\`\`

### 8. Debugging in VS Code

#### Python Backend Debugging:

1. Go to `Run and Debug` view (`Ctrl+Shift+D`)
2. Click "create a launch.json file"
3. Select "Python"
4. Choose "Flask"
5. Configure the launch.json:

\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Flask",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/app.py",
      "env": {
        "FLASK_APP": "app.py",
        "FLASK_ENV": "development"
      },
      "args": [],
      "jinja": true,
      "justMyCode": true
    }
  ]
}
\`\`\`

#### Frontend Debugging:

The Next.js app can be debugged using browser developer tools or VS Code's built-in debugger.

### 9. Common Issues and Solutions

#### Issue: "Python not found"
- **Solution:** Install Python from python.org or use the Microsoft Store version

#### Issue: "npm command not found"
- **Solution:** Install Node.js from nodejs.org

#### Issue: "Module not found" errors
- **Solution:** Make sure you're in the correct directory and have run `npm install` and `pip install -r requirements.txt`

#### Issue: Backend connection failed
- **Solution:** Ensure the Flask server is running on port 5000 and not blocked by firewall

#### Issue: CORS errors
- **Solution:** The Flask app includes CORS headers, but ensure both servers are running

### 10. Development Tips

1. **Auto-reload:** Both Next.js and Flask support auto-reload during development
2. **Code formatting:** Use Prettier for frontend and Black for Python
3. **Git integration:** VS Code has excellent Git support built-in
4. **Extensions:** Install the recommended extensions for better IntelliSense

### 11. Production Build

To build for production:

\`\`\`bash
# Frontend
npm run build
npm start

# Backend (use a production WSGI server)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
\`\`\`

## Quick Start Commands

\`\`\`bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Start backend (Terminal 1)
cd backend
python app.py

# 3. Start frontend (Terminal 2)
npm run dev

# 4. Open browser
# http://localhost:3000
\`\`\`

That's it! You should now have a fully functional K-Drama recommendation system running in VS Code.
