README.md Template

# Project Name

A brief, compelling description of your project. Explain what it does, its purpose, and why it’s useful.

---

## 🚀 Features

- Upload `.js` / `.ts` files for analysis  
- Monaco diff editor for side-by-side code comparison  
- Inline comments for AI suggestions  
- Analytics dashboard: issues by category & severity  

---

## 📦 Installation

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/project-name.git

# Navigate into the project directory
cd project-name

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🛠️ Usage

Explain how users can run or use your project. Include screenshots, example commands, or code snippets.

```bash
# Example command
npm run start
```

### Example Output

```json
{
    "success": true,
    "data": {
        "id": ,
        "projectName": ,
        "timestamp": ,
        "diffs": [
            {
                "file": ,
                "path": ,
                "status": ,
                "oldCode": ,
                "newCode": ,
                "comments": [
                    {
                        "id": ,
                        "line": ,
                        "message": ,
                        "category":,
                        "severity":
                    },
                    {
                        "id": ,
                        "line": ,
                        "message": ,
                        "category": ,
                        "severity": 
                    },

                    ...
                ]
            }
        ],
        "summary": {
            "totalIssues": ,
            "byCategory": {
                "security": ,
                "bug": ,
                "performance": ,
                "readability": 
            },
            "bySeverity": {
                "high": ,
                "medium": ,
                "low": 
            }
        }
    }
}
```

---

## 🧩 Project Structure

```
project-name/
│
├─ src/                  # Source code
│  ├─ components/        # React components
│  ├─ pages/             # App pages
│  ├─ services/          # API services
│  └─ utils/             # Utility functions
│
├─ public/               # Static assets
├─ tests/                # Test cases
├─ .env                  # Environment variables
├─ package.json
└─ README.md
```

---

## ⚙️ Configuration

Explain how to configure environment variables or other settings:

```
GEMINI_API_KEY=your-api-key
```

---

## 📊 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **AI/ML:** Gemini API 
