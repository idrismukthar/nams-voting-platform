

## 🗳️ **ALL-IN-ONE README.md**

```markdown
# 🗳️ NAMS LASU E-Voting Platform

A secure, modern electronic voting system for Nigerian Association of Microbiology Students, LASU Chapter.

## 🎯 Live Demo
- **Frontend**: https://nams-voting.netlify.app
- **Backend**: https://nams-backend.up.railway.app
- **Admin Password**: `nams123`

## ✨ Features
- Student registration with matric validation
- Secure voting with duplicate prevention
- Admin panel for candidate management
- Live results with auto-refresh
- Mobile-responsive design
- Password-protected admin access

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express, SQLite
- **Deployment**: Netlify + Railway

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/idrismukthar/nams-voting-platform.git
cd nams-voting-platform/backend
npm install
npm start
```

### 2. Access Application
- Main App: `http://localhost:8080`
- Admin Panel: `http://localhost:8080/admin.html`
- API: `http://localhost:4000`

## 📁 Project Structure
```
nams-voting-platform/
├── backend/
│   ├── server.js          # Main server
│   ├── package.json       # Dependencies
│   └── uploads/           # Images
├── frontend/
│   ├── *.html            # Pages
│   ├── css/              # Styles
│   └── js/               # Scripts
└── README.md
```

## 📡 API Endpoints

### Authentication
- `POST /register` - Student registration
- `POST /login` - Student login

### Voting
- `GET /candidates` - Get candidates
- `POST /submitVote` - Cast vote
- `GET /results` - Live results

### Admin
- `POST /addCandidate` - Add candidate
- `DELETE /candidates/:id` - Remove candidate

## 👤 Usage

### For Students
1. Register with your matric number
2. Login to access ballot
3. Vote for your preferred candidates
4. View live results

### For Admin
1. Go to `/admin.html`
2. Enter password: `nams123`
3. Add/manage candidates
4. Monitor voting progress

## 🔧 Development

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
# Use Live Server or http-server
npx http-server -p 8080 --cors
```

## 📄 License
MIT License - see LICENSE file for details.

## 📞 Support
Email: idrismukthar6@gmail.com

---

**Built with ❤️  by The Claritas Team for NAMS LASU Chapter**
```



```markdown
# 🗳️ NAMS LASU E-Voting Platform

Secure online voting system for Microbiology Students.

## 🚀 Live Demo
- **Website**: https://nams-voting.netlify.app
- **Admin**: https://nams-voting.netlify.app/admin.html
- **Password**: `nams123`

## ✨ Features
- Student registration & voting
- Admin candidate management  
- Live results with progress bars
- Mobile-friendly design

## 🛠️ Built With
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express, SQLite
- Hosting: Netlify + Railway

## 📦 Installation
```bash
git clone https://github.com/idrismukthar/nams-voting-platform.git
cd nams-voting-platform/backend
npm install
npm start
```

## 📞 Contact
idrismukthar6@gmail.com

---

