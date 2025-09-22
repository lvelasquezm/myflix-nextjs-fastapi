# MyFlix Frontend

A Netflix-style application built with Next.js, featuring AI-powered image generation with real-time progress tracking. Built with Tailwind CSS, shadcn/ui, and Framer Motion for a great UX.

## Features

- 🔐 **Authentication UI** - Netflix-style login page with form validation
- 🎬 **Netflix-style Interface** - Hero section, show rows with horizontal scrolling
- 🎨 **AI Image Generation** - Interactive modal with real-time progress tracking
- 📡 **Live Progress Updates** - Server-Sent Events for instant generation feedback
- ⚡ **Concurrent Generation** - Generate multiple images simultaneously with individual status
- 📊 **Performance Metrics** - Display TTFI (Time to First Image) and total batch time
- 🖼️ **Image Management** - Download generated images with one click
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ✨ **Smooth Animations** - Powered by Framer Motion with progress animations
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- 🗄️ **State Management** - Zustand for efficient state handling

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Real-time Communication**: Server-Sent Events (EventSource API)
- **HTTP Client**: Fetch API with custom error handling
- **Image Handling**: Next.js Image component with lazy loading
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

4. The frontend requires the `backend` to be running on `http://localhost:8000`.

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
├── app/                            # Next.js app router pages
│   ├── login/                      # Authentication page
│   ├── layout.tsx                  # Root layout with auth providers
│   ├── page.tsx                    # Home page with generation console
├── components/                     # React components
│   ├── auth/                       # Authentication components
│   │   ├── AuthProvider.tsx        # Global auth state initialization
│   │   ├── RouteGuard.tsx          # Client-side route protection
│   │   └── LoginForm.tsx           # Login form with validation
│   ├── home/                       # Home page components
│   │   ├── GenerationConsole.tsx   # AI image generation modal
│   │   ├── Navbar/                 # Navigation with generate button
│   │   └── Shows/                  # Show display components
│   └── ui/                         # Reusable UI components (from shadcn/ui)
├── constants/                      # Harcoded strings used in the UI
├── lib/                            # Utility functions
│   ├── api.ts                      # HTTP client for backend communication
│   └── validation.ts               # Form validation utilities
├── stores/                         # Zustand state stores
│   ├── authStore.ts                # Authentication state management
│   └── generationStore.ts          # Image generation state with SSE
├── styles/                         # CSS files
│   └── global.css                  # Global CSS styles including Tailwind import and custom style tokens.
└── types/                          # TypeScript type definitions
    ├── auth.ts                     # Authentication types
    └── generation.ts               # Image generation types
```

## Key Features Implemented

### AI Image Generation Console
- **Interactive Modal**: Full-screen generation interface with form validation
- **Real-time Progress**: Live updates via Server-Sent Events as images complete
- **Concurrent Processing**: Multiple images generated simultaneously with individual status tracking
- **Performance Metrics**: Display TTFI and total batch time when complete
- **Image Grid**: Responsive grid layout showing generation progress and results
- **Download Functionality**: One-click download for generated images
- **Error Handling**: Error states with retry functionality
- **Form Validation**: Real-time prompt validation with user feedback

### Authentication
- Login form with custom validation
- JWT token-based authentication with persistent state
- Protected routes with automatic redirects
- Loading states and error handling
- Auth state initialization on app startup

### Home Interface
- Dynamic hero section with featured content
- Horizontal scrolling show rows with smooth animations
- Interactive show cards with hover effects
- Responsive navigation bar with generation trigger
- Netflix-style UI with custom scrollbars

### Real-time Communication
- **Server-Sent Events**: Live streaming of generation progress
- **Event Handling**: Progress, completion, error, and keep-alive events
- **Connection Management**: Automatic reconnection and cleanup
- **State Synchronization**: Real-time UI updates based on backend events

### User Experience
- Smooth transitions and animations with Framer Motion
- Loading skeletons and progress indicators
- Progressive image loading with Next.js Image
- Mobile-responsive design with touch interactions

### Content Management
- Show data with mock content
- Image optimization and lazy loading
- Responsive image grids and carousels

## Using the AI Image Generation

### Accessing the Generation Console
1. **Login** to the application with demo credentials:
   - Email: `demo@myflix.com`
   - Password: `demo123`

2. **Click the "Generate" button** in the top navigation bar

3. **Enter your prompt** in the generation modal:
   - Describe what you want to generate (e.g., "A beautiful sunset over mountains")
   - Choose the number of images to generate (min 1)

4. **Watch real-time progress**:
   - See individual images appear as they complete
   - Track TTFI (Time to First Image) and total batch time
   - Monitor overall progress with the progress bar

5. **Download results**:
   - Click the download button on any completed image

### Generation Console Features
- **Form Validation**: Real-time validation with helpful error messages
- **Progress Tracking**: Live updates for each image in the batch
- **Error Recovery**: Retry failed generations with one click
- **Performance Metrics**: See generation speed and timing data
- **Responsive Design**: Works across different screen sizes

### Technical Implementation
- **Zustand Store**: Manages generation state and SSE connections
- **Server-Sent Events**: Real-time progress updates from backend
- **TypeScript Types**: Fully typed generation requests and responses
- **Error Boundaries**: Graceful handling of generation failures
- **Custom Validation**: Client-side form validation with user feedback


### Code Quality

- TypeScript for type safety with strict mode
- ESLint for code linting with Next.js rules
- Consistent component structure with PascalCase naming
- Custom validation utilities with real-time feedback
- Proper error handling and loading states
- Performance optimizations with React best practices
