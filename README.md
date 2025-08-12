# Reformation Baptist Church of Kigali Website

A modern, full-stack website for Reformation Baptist Church of Kigali, built with React, TypeScript, Node.js, and MongoDB.

## Features

### Frontend
- **Modern React Application** with TypeScript and Vite
- **Responsive Design** with Tailwind CSS
- **Five Main Sections**: Home, Resources, Missions, Ministries, Contact
- **Professional Aesthetics** with church-appropriate color palette
- **SEO Optimized** with proper meta tags and semantic HTML

### Backend
- **RESTful API** built with Node.js, Express, and TypeScript
- **MongoDB Database** with Mongoose ODM
- **JWT Authentication** for admin dashboard
- **Input Validation** and security middleware
- **Error Handling** and logging

### Admin Dashboard
- **Secure Authentication** with JWT tokens
- **Content Management** for sermons, missions, ministries
- **Contact Form Management** with message viewing
- **Dashboard Analytics** with usage statistics

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: Helmet.js, CORS, Rate limiting

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reformation-baptist-church
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # In the backend directory
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/reformation-baptist-church
   JWT_SECRET=your-super-secure-jwt-secret-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**
   - Install and start MongoDB locally, or set up MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env` file

5. **Create Admin User**
   ```bash
   # Start the backend server first
   cd backend
   npm run dev
   
   # In another terminal, create admin user
   curl -X POST http://localhost:5001/api/auth/create-admin \
   -H "Content-Type: application/json" \
   -d '{"username": "admin", "password": "yourpassword"}'
   ```

## Running the Application

### Development Mode

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on `http://localhost:5001`

2. **Start the Frontend Development Server**
   ```bash
   # In the root directory
   npm run dev
   ```
   Application will run on `http://localhost:3000`

### Production Build

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Build the Backend**
   ```bash
   cd backend
   npm run build
   ```

3. **Start Production Server**
   ```bash
   cd backend
   npm start
   ```

## Project Structure

```
reformation-baptist-church/
├── src/                          # Frontend source code
│   ├── components/              # Reusable React components
│   ├── pages/                   # Page components
│   ├── App.tsx                  # Main App component
│   └── main.tsx                 # App entry point
├── backend/                     # Backend source code
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Custom middleware
│   │   └── server.ts            # Server entry point
│   ├── .env.example             # Environment variables template
│   └── package.json             # Backend dependencies
├── public/                      # Static assets
├── index.html                   # HTML template
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Frontend dependencies
```

## API Endpoints

### Public Endpoints
- `GET /api/sermons` - Get all sermons
- `GET /api/sermons/:id` - Get single sermon
- `GET /api/missions` - Get all missions
- `GET /api/ministries` - Get all ministries
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/sermons` - Manage sermons
- `GET /api/admin/missions` - Manage missions
- `GET /api/admin/ministries` - Manage ministries
- `GET /api/admin/contact-messages` - View contact messages

## Usage

### Accessing the Website
1. Visit `http://localhost:3000` for the main website
2. Navigate through Home, Resources, Missions, Ministries, and Contact sections
3. Use the YouTube link for live streaming

### Admin Dashboard
1. Visit `http://localhost:3000/admin/login`
2. Log in with your admin credentials
3. Manage content through the admin dashboard

### Content Management
- **Sermons**: Upload and categorize audio/video sermons
- **Missions**: Add mission locations and updates
- **Ministries**: Manage ministry information and activities
- **Contact Messages**: View and respond to contact form submissions

## Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for security headers
- Password hashing with bcrypt

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Backend Deployment
The backend can be deployed to:
- Heroku
- DigitalOcean
- AWS EC2
- Google Cloud Platform

### Database
Use MongoDB Atlas for production database hosting.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions about this church website, please contact the development team or church administrators.

---

**Reformation Baptist Church of Kigali**  
*Proclaiming the Gospel in Rwanda*