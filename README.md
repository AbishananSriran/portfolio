# Abishanan's Portfolio ([abi.gg](https://abi.gg))

## Description

This is a modern, interactive portfolio website for Abishanan, showcasing his professional experience, projects and skills. The site features a sleek React-based frontend built with Vite, TypeScript and Tailwind CSS, incorporating advanced UI components from Radix UI and interactive 3D elements using React Three Fiber. Key features include:

- **Interactive Portfolio Sections**: Detailed experience at various companies along with featured projects.
- **AI-Powered Chat Widget**: Intelligent chat assistant that answers questions about Abishanan using Google Gemini AI, with context retrieved from embedded knowledge chunks.
- **Contact Form**: Secure contact form with reCAPTCHA verification and email sending via Resend.
- **Responsive Design**: Optimized for all devices with smooth animations and particle collision simulations.
- **Backend API**: A Node.js Express server handling chat responses, contact form submissions and email notifications.

The backend leverages Google Gemini for AI responses, Resend for email services and reCAPTCHA for spam protection, ensuring a robust and secure user experience.

## Tech Stack

### Frontend

- **React** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Three Fiber** for 3D graphics
- **Framer Motion** for animations
- **ReCAPTCHA** for spam protection

### Backend

- **Node.js** with Express
- **Google Gemini AI** for chat responses
- **Resend** for email sending

## Prerequisites

- Node.js v23 (latest version recommended)
- `npm` or `yarn` package manager

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

1. Install dependencies:

   ```bash
   npm install
   ```

1. Create a `.env` file in the `backend` directory with the following environment variables:

   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   RESEND_API_KEY=your_resend_api_key
   RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_for_production
   RECAPTCHA_TEST_SECRET_KEY=your_recaptcha_test_secret_key_for_development
   ```

1. Start the development server:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:3001`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

1. Install dependencies (with `--force`):

   ```bash
   npm install --force
   ```

1. Create a `.env` file in the `frontend` directory with the following environment variables:

   ```env
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_for_production
   VITE_RECAPTCHA_TEST_SITE_KEY=your_recaptcha_test_site_key_for_development
   ```

1. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:8080`.

## Usage

- Open your browser and navigate to `http://localhost:8080` to view the portfolio.
- The backend API endpoints are available at `http://localhost:3001/api/*`.
- Use the chat widget to interact with the AI assistant.
- Submit the contact form to send messages (requires valid reCAPTCHA).

## Build for Production

### Frontend Build

```bash
cd frontend
npm run build
```

### Backend Build

```bash
cd backend
npm start
```

## Contributing

This is a personal portfolio project. Contributions are not currently accepted.
