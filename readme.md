# Pet Adoption Platform

A comprehensive MERN stack web application for connecting pet shelters with potential adopters, featuring detailed pet profiles, application management, messaging system, and user reviews.

## Features

### Core Functionality
- **Pet Listings**: Browse available pets with detailed profiles including photos, medical history, and behavior traits
- **Advanced Search & Filtering**: Find pets by species, breed, size, age, and location
- **Application Management**: Submit and track adoption applications with comprehensive forms
- **Messaging System**: Direct communication between adopters and shelters
- **User Reviews**: Rate and review shelters to help future adopters
- **Favorites**: Save favorite pets for later viewing
- **Foster Program**: Support for foster parents and fostered pets

### User Roles
- **Adopters**: Browse pets, submit applications, save favorites, communicate with shelters
- **Shelters**: Manage pet listings, review applications, schedule meet-and-greets, communicate with adopters
- **Foster Parents**: List and manage fostered pets

## Tech Stack

### Backend
- **Node.js** with **Express** for server
- **MongoDB** with **Mongoose** for database
- **JWT** for authentication
- **Nodemailer** for email notifications
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **React** with JavaScript
- **TailwindCSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Email service credentials (Gmail, etc.)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. From the project root directory, install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Pets
- `GET /api/pets` - Get all pets with filters
- `GET /api/pets/:id` - Get pet by ID
- `POST /api/pets` - Create new pet listing (shelter only)
- `PUT /api/pets/:id` - Update pet (shelter only)
- `DELETE /api/pets/:id` - Delete pet (shelter only)
- `POST /api/pets/:id/reviews` - Add pet review
- `POST /api/pets/:id/favorite` - Toggle favorite
- `GET /api/pets/favorites` - Get user favorites

### Applications
- `GET /api/applications` - Get applications (filtered by user role)
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Submit new application
- `PUT /api/applications/:id/status` - Update application status (shelter only)
- `POST /api/applications/:id/notes` - Add note to application (shelter only)
- `POST /api/applications/:id/meet-greet` - Schedule meet & greet (shelter only)

### Messages
- `GET /api/messages/conversations` - Get all conversations
- `POST /api/messages/conversations` - Create new conversation
- `GET /api/messages/conversations/:id/messages` - Get messages in conversation
- `POST /api/messages/conversations/:id/messages` - Send message

### Reviews
- `POST /api/reviews` - Create shelter review
- `GET /api/reviews/shelter/:shelterId` - Get shelter reviews
- `DELETE /api/reviews/:id` - Delete review

## Database Models

### User
- Personal information (name, email, phone, address)
- Role (adopter, shelter, foster)
- Shelter information (for shelter users)
- Favorite pets
- Notification preferences

### Pet
- Basic information (name, species, breed, age, size, gender, color)
- Description and location
- Medical history (vaccinated, spayed/neutered, special needs)
- Behavior traits (good with kids/pets, energy level, trained)
- Photos and videos
- Status (available, pending, adopted, fostered)
- Adoption fee
- Reviews

### Application
- Pet and applicant references
- Comprehensive application data (housing, household, experience)
- Status tracking (pending, reviewing, approved, rejected)
- Notes and communication
- Meet & greet scheduling

### Conversation & Message
- Participant references
- Related pet or application
- Message content and read status
- Timestamps

### Review
- Shelter and reviewer references
- Rating and comment
- Category ratings (communication, process, support)

## Email Notifications

The platform sends automated emails for:
- New user registration
- New pet listings (to users with notifications enabled)
- Application status updates
- New messages (to users with notifications enabled)
- Meet & greet scheduling

## File Uploads

Pet photos and videos are stored locally in the `server/uploads/` directory. Files are validated for type and size (max 10MB).

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Protected API routes
- Input validation and sanitization

## Development Notes

- The frontend runs on port 5173 (Vite default)
- The backend runs on port 5000 (configurable)
- MongoDB connection must be active before starting the backend
- Email credentials must be valid for email notifications to work

## Future Enhancements

- Real-time messaging with WebSockets
- Image upload to cloud storage (AWS S3, Cloudinary)
- Payment processing for adoption fees
- Pet adoption events calendar
- Admin dashboard for platform management
- Mobile app development

## License

This project is open source and available for educational and commercial use.
<<<<<<< HEAD:readme

=======
>>>>>>> 9d5e709f7b37087f726f605103cdbaf083b611d9:readme.md
