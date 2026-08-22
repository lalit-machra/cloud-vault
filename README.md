# CloudVault

> A lightweight personal cloud storage platform built with React, Node.js, Express, PostgreSQL, AWS and OpenAI.

**[🚀 Live Demo](https://cloud-vault-livid.vercel.app/)**

CloudVault is a personal cloud storage platform — a lightweight alternative to something like Google Drive. Users sign up, land on a dashboard, and upload files that are securely stored and tied to their account alone. From there they can browse, search, sort, preview, download, delete, get an AI-generated summary of supported files on demand, and see files automatically categorized shortly after upload — all through a single clean interface, accessible from any device.

## Features

- **Secure authentication** — JWT-based auth with bcrypt password hashing, centralized middleware for route protection, and Zod-based request validation
- **Cloud file storage** — files are uploaded to and served from AWS S3, with presigned URLs for secure, direct downloads
- **Per-user authorization** — users can only access, download, or delete their own files, enforced independently of authentication
- **File management** — upload, list, search by filename, sort by name/date, preview, download, and delete
- **Clean Dashboard UI** — built with React, Tailwind CSS, and shadcn/ui components
- **Landing page** — public marketing page introducing the product before login/signup
- **AI-powered summaries** — a short, AI-generated summary is available on demand for any supported document, generated on first request and cached afterward so repeat views don't re-trigger the AI call
- **AI-powered categorization** — every file is automatically categorized (Personal, Work, Education, Finance, Media, or Other) shortly after upload, without blocking the upload response.

## Tech Stack

**Backend**
- Node.js, Express (ESM)
- PostgreSQL with Prisma ORM
- JWT for authentication, bcrypt for password hashing
- Zod for request validation
- AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)
- Multer for handling file uploads
- OpenAI API (gpt-5.6-luna) via the Responses API, for file summarization and categorization

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS + shadcn/ui
- Axios with request/response interceptors for auth token handling
- React Context for global auth state

**Infrastructure**
- AWS S3 — file storage
- AWS RDS (PostgreSQL) — production database
- AWS EC2 — backend hosting
- Nginx — reverse proxy
- Let's Encrypt (Certbot) — HTTPS
- Vercel — frontend hosting

## Author

Developed by Lalit Machra
