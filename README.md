# Booking Application

A modern, full-stack booking application built with **TypeScript**, **React**, and **Express**, featuring a responsive UI with Material-UI components and comprehensive date/time management.

## 📋 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Booking Management**: Create, manage, and track bookings with date and time picker support
- **Calendar Integration**: Built-in calendar and date picker components for easy date selection
- **Dashboard & Analytics**: Visual analytics using Chart.js and Recharts
- **Timezone Support**: Full timezone awareness with moment-timezone
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS and Material-UI
- **Real-time Updates**: RESTful API with Axios for seamless client-server communication
- **Database**: PostgreSQL with Sequelize ORM for robust data management

## 🛠️ Tech Stack

### Frontend
- **React** 18.3 - UI library
- **TypeScript** 5.6 - Type-safe JavaScript
- **Vite** 5.4 - Fast build tool and dev server
- **Material-UI (MUI)** - Component library and styling
- **Tailwind CSS** 3.4 - Utility-first CSS
- **React Router** 6.27 - Client-side routing
- **Emotion** - CSS-in-JS styling solution

### Backend
- **Express** 4.21 - Web server framework
- **Node.js** with TypeScript - Server-side runtime
- **PostgreSQL** - Database
- **Sequelize** 6.37 - ORM for database operations
- **JWT** - JSON Web Token authentication
- **bcrypt/bcryptjs** - Password hashing

### UI Components & Utilities
- **MUI Date Pickers** - Advanced date/time selection
- **React DatePicker** - Flexible date input
- **React Calendar** - Calendar component
- **React Icons** - Icon library
- **Chart.js & Recharts** - Data visualization

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Somu325/Booking.git
   cd Booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/booking_db
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run migrate
   ```

## 🚀 Getting Started

### Development

Start the development server:
```bash
npm run dev
```

This will start:
- **Frontend**: Vite dev server (typically at `http://localhost:5173`)
- **Backend**: Express server (configure as needed)

### Build

Build the TypeScript and create an optimized production bundle:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
Booking/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API services and utilities
│   ├── styles/         # Global styles and Tailwind config
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main App component
├── server/             # Express backend
│   ├── routes/         # API routes
│   ├── models/         # Sequelize models
│   ├── controllers/    # Route handlers
│   └── middleware/     # Custom middleware
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 📊 Language Composition

- **TypeScript**: 92.1%
- **CSS**: 7.4%
- **Other**: 0.5%

## 🔐 Authentication

The application uses JWT-based authentication:
- Passwords are hashed using bcrypt
- JWT tokens are issued upon successful login
- Tokens are stored in cookies using js-cookie
- Protected routes verify token validity

## 📅 Date & Time Handling

- **date-fns**: Modern date utility library
- **Day.js**: Lightweight date manipulation
- **moment/moment-timezone**: Comprehensive date and timezone handling
- **React DatePicker & MUI Date Pickers**: User-friendly date input components

## 🗄️ Database

The application uses PostgreSQL with Sequelize ORM:
- Connection pooling for better performance
- Migration support for schema management
- Type-safe queries with TypeScript support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is currently without a specified license. See the repository for more details.

## 👤 Author

**Somu325** - [GitHub Profile](https://github.com/Somu325)

## 📞 Support

For support, issues, or questions, please open an issue on the [GitHub Issues](https://github.com/Somu325/Booking/issues) page.

---

**Last Updated**: February 2026
