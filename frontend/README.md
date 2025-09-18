# MyFlix Frontend

A Netflix-style application built with Next.js, Tailwind CSS, Shadcn/UI and Framer Motion.

## Features

- 🔐 **Authentication UI** - Netflix-style login page with form validation
- 🎬 **Netflix-style Interface** - Hero section, show rows with horizontal scrolling
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ✨ **Smooth Animations** - Powered by Framer Motion
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🗄️ **State Management** - Zustand for efficient state handling

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites

1. In a terminal, if you're at the root, go to the `frontend` folder:
```bash
$ cd frontend
```

2. Node.js 22.0.0 or higher (specified in `.nvmrc`). The preferred method is to use a Node version manager
like [nvm](https://github.com/nvm-sh/nvm) to avoid collisions with other installed Node versions.
You can see the installation instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating).
After installing it, just run:
```bash
$ nvm install 22.0.0
```

3. Make sure you're using the required Node version by running:
```bash
$ nvm use
```

### Local development

1. Install dependencies:
```bash
$ npm install
```

2. Start the development server:
```bash
$ npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser


## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── login/              # Authentication page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── home/               # Home page components
│   └── ui/                 # Reusable UI components (from Shadcn/UI)
├── lib/                    # Utility functions
├── stores/                 # Zustand state stores
├── styles/                 # CSS files
│   └── global.css          # Global CSS styles including Tailwind import and custom style tokens.
└── types/                  # TypeScript type definitions
```

## Key Features Implemented

### Authentication
- Netflix-style login form
- Custom form validation
- Error handling and loading states
- Persistent authentication state

### Home Interface
- Dynamic hero section with featured content
- Horizontal scrolling show rows
- Interactive show cards with hover effects
- Responsive navigation bar

### User Experience
- Smooth transitions and animations
- Loading skeletons
- Progressive image loading
- Mobile-responsive design

### Content
Dummy data is generated in `src/lib/shows.ts` for the shows displayed in the app.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Consistent component structure
- Custom validation utilities
