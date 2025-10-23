# 🗳️ NAMS LASU E-Voting Platform

A secure and user-friendly electronic voting system designed specifically for the Nigerian Association of Microbiology Students (NAMS), LASU Chapter.

# 🗳️ NAMS LASU E-Voting Platform

A secure and user-friendly electronic voting system for the Nigerian Association of Microbiology Students (NAMS), LASU Chapter.

## 🚀 Live Demo
- **Frontend**: https://nams-voting.netlify.app
- **Backend API**: https://nams-backend.up.railway.app

## ✨ Features
- 👤 Secure student authentication with matric validation
- 🗳️ One-vote-per-student system with duplicate prevention  
- 👨‍💼 Admin panel for candidate management
- 📊 Live results with auto-refresh
- 📱 Mobile-responsive design
- 🔒 Password-protected admin access

## 🛠️ Tech Stack
**Frontend**: HTML5, CSS3, Vanilla JavaScript  
**Backend**: Node.js, Express.js, SQLite  
**Deployment**: Netlify (Frontend), Railway (Backend)

## 📦 Installation
```bash
# Clone repository
git clone https://github.com/idrismukthar/nams-voting-platform.git

# Setup backend
cd backend
npm install
npm start

# Setup frontend  
cd ../frontend
# Use Live Server or http-server
## 📝 API Documentation

### Authentication Endpoints
- `POST /register` - Register new student
- `POST /login` - Student login
- `POST /admin/login` - Admin login

### Voting Endpoints
- `GET /candidates` - List all candidates
- `POST /vote` - Cast a vote
- `GET /results` - View results

### Admin Endpoints
- `POST /admin/candidates` - Add candidate
- `DELETE /admin/candidates/:id` - Remove candidate

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 **FINAL DEPLOYMENT STEPS:**
 ## Install dotenv**:
   ```bash
   cd backend
   npm install dotenv

## 📞 Support

For support, email idrismukthar6@gmail.com or open an issue in this repository.

## 🙏 Acknowledgments

- NAMS LASU Chapter
- The Claritas Team
- All contributors who have helped with testing and feedback
- The open-source community for the amazing tools
