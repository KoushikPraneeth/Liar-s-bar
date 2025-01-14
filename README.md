# Liar's Bar - Card Game

Liar's Bar is a multiplayer card game built with modern web technologies.

## Features

- Multiplayer card game implementation
- Responsive UI built with React and Tailwind CSS
- Type-safe codebase using TypeScript
- Fast development experience with Vite

## Technologies

- React 18
- TypeScript
- Tailwind CSS
- Vite
- ESLint (code quality)
- PostCSS (CSS processing)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Project Structure

```
.
├── src/
│   ├── components/      # React components
│   │   ├── Card.tsx     # Card component
│   │   ├── GameBoard.tsx # Main game board
│   │   ├── Player.tsx   # Player component
│   │   └── TableLayout.tsx # Game table layout
│   ├── types/           # TypeScript types
│   │   └── game.ts      # Game-related types
│   ├── utils/           # Utility functions
│   │   └── gameLogic.ts # Game logic implementation
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```


