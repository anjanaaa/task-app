# React Tasks App

![CI/CD Pipeline](https://github.com/anjanaaa/task-app/actions/workflows/ci-cd.yml/badge.svg)
![GitHub Pages](https://img.shields.io/badge/deployment-GitHub%20Pages-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Supabase](https://img.shields.io/badge/Database-Supabase-green)

A modern React application for managing tasks with optional time limits, real-time countdown functionality, and cloud persistence.

## 🌐 Live Demo

**Deployed App**: [https://anjanaaa.github.io/task-app](https://anjanaaa.github.io/task-app)

> **Note**: The live demo uses GitHub Pages. For full functionality with data persistence, you'll need to set up your own Supabase instance (see setup guide below).

## ✨ Features

- ✅ **Task Management**: Add, complete, and delete tasks
- ⏰ **Time Limits**: Optional countdown timers for tasks
- 🕐 **Real-time Updates**: Live countdown and instant synchronization
- 💾 **Cloud Persistence**: Tasks saved to Supabase database
- 🔄 **Multi-device Sync**: Real-time updates across all devices
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Glass morphism effects and gradient backgrounds
- 🚀 **Auto-deploy**: CI/CD pipeline with GitHub Actions
- 🔒 **Security**: Automated vulnerability scanning

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## How to Use

1. **Add a Task**: Enter a task title in the input field
2. **Set Time Limit** (Optional): Check the "Add time limit" checkbox and specify duration in minutes
3. **View Tasks**: Tasks are displayed in two sections - Active and Completed
4. **Track Time**: For tasks with time limits, see real-time countdown showing remaining time
5. **Complete Tasks**: Click the checkbox to mark tasks as completed
6. **Delete Tasks**: Click the trash icon to remove tasks

## Features in Detail

### Time Tracking
- Time limits are specified in minutes
- Real-time countdown updates every second
- Visual indicators when time expires
- Different styling for expired tasks

### Task Management
- Tasks are automatically organized into Active and Completed sections
- Completed tasks have strike-through styling
- Task creation timestamps are displayed
- Clean, intuitive interface

### Responsive Design
- Works seamlessly on desktop and mobile devices
- Adaptive layout for different screen sizes
- Modern glassmorphism design with gradient backgrounds

## 🔧 Available Scripts

### Development
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

### Code Quality
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Fix ESLint issues automatically  
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted

### Testing & Performance
- `npm run test:coverage` - Run tests with coverage report
- `npm run lighthouse` - Run Lighthouse performance tests
- `npm run analyze` - Analyze bundle size

### Production
- `npm run serve` - Serve production build locally

## 🛠️ Technology Stack

- **Frontend**: React 18.2, Modern CSS, Responsive Design
- **Backend**: Supabase (PostgreSQL, Real-time subscriptions)
- **CI/CD**: GitHub Actions (Build, Test, Deploy, Security)
- **Deployment**: GitHub Pages
- **Tools**: ESLint, Prettier, Lighthouse CI
- **Testing**: Jest, React Testing Library

## 📁 Project Structure

```
task-app/
├── .github/workflows/     # CI/CD pipelines
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   ├── hooks/           # Custom hooks (useTasks)
│   ├── lib/             # Supabase client
│   └── ...
├── database-schema.sql   # Database setup
├── SUPABASE_SETUP.md    # Database setup guide
├── CICD_SETUP.md        # Pipeline setup guide
└── lighthouserc.js      # Performance testing config
```

## 🚀 Setup Guides

- **[Supabase Setup](./SUPABASE_SETUP.md)** - Database configuration
- **[CI/CD Setup](./CICD_SETUP.md)** - Pipeline configuration

## 🌐 Browser Support

This app works in all modern browsers that support ES6+ features and WebSocket connections.
