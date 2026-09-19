# Mentor AI

Mentor AI is an interactive programming learning platform built with Next.js. It combines structured lessons, knowledge checks, coding challenges, deterministic validation, and AI-generated mentoring feedback.

## Features

- JavaScript and Python learning paths
- Markdown lessons with code examples
- Timed multiple-choice knowledge tests
- Browser-based JavaScript code execution with timeout handling
- Deterministic challenge validation before AI evaluation
- Gemini-powered feedback and error explanations
- JWT authentication with HTTP-only cookies
- Email OTP verification during registration
- MongoDB-backed course progress
- Automated unit and API tests with Vitest

## Tech Stack

- Next.js 16 App Router
- TypeScript
- React 19
- Tailwind CSS
- MongoDB with Mongoose
- Gemini API
- Vitest

## Project Structure

```text
app/             Pages and API routes
components/      Lesson, editor, terminal, quiz, and feedback UI
data/             JavaScript and Python course content
lib/              Authentication, database, code validation, and runner logic
models/           Mongoose models for users and email verification
types/            Shared TypeScript types
```

## Getting Started

### Requirements

- Node.js 20 or newer
- MongoDB database, local or MongoDB Atlas
- Gemini API key
- SMTP account for email verification

### Install

```bash
npm install
```

### Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=Mentor AI <your-email@example.com>
```

`SMTP_FROM` is optional and defaults to `SMTP_USER`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Testing

Run the automated tests once:

```bash
npm test
```

Run tests in watch mode while developing:

```bash
npm run test:watch
```

Run the full quality checks:

```bash
npm run lint
npm test
npm run build
```

The test suite covers challenge validation, AI evaluation API protection, login behavior, registration validation, and OTP verification.

## Deploying to Vercel

1. Push the project to a GitHub repository.
2. Open [Vercel](https://vercel.com) and select **Add New Project**.
3. Import the GitHub repository.
4. Keep the detected Next.js framework and default build settings.
5. Add every variable from `.env.example` under **Settings > Environment Variables**.
6. Deploy the project.
7. In MongoDB Atlas, allow the deployment to connect to the database and verify that the database user has the required permissions.
8. Test registration, email verification, login, course progress, and AI feedback on the deployed URL.

For production, use a strong unique `JWT_SECRET`, restrict database access where possible, and set SMTP credentials using an app password or a transactional email provider. Never commit `.env.local` or production secrets.

## Resume Highlights

- Designed a full-stack learning workflow spanning client UI, authenticated API routes, database persistence, and external AI services.
- Combined deterministic code checks with AI feedback so evaluation is not based solely on a language model.
- Added automated tests for core validation, authentication, registration, OTP, and API security paths.
