# React Tasks App

A modern React application for managing tasks with optional time limits and real-time countdown functionality.

## Features

- ✅ Add tasks with descriptive titles
- ⏰ Optional time limits for tasks (in minutes)
- 🕐 Real-time countdown showing remaining time
- ✔️ Mark tasks as completed
- 🗑️ Delete tasks
- 📱 Responsive design
- 🎨 Modern UI with gradient background and glass morphism effects

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

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Technology Stack

- React 18
- Modern CSS with Flexbox and Grid
- Responsive design principles
- Real-time updates with setInterval

## Browser Support

This app works in all modern browsers that support ES6+ features.
