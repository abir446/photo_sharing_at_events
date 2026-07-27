# DropCast - Live Photo Sharing at Events

DropCast is a modern, responsive web application designed to collect and display photos/videos shared by guests at events in real-time. By eliminating app downloads, sign-up walls, and complex groups, DropCast lets event hosts create a single repository of high-fidelity memories.

---

## Aim of the Project

The core purpose of DropCast is to **simplify collaborative event photography**. 

Typically, gathering photos from guests after a wedding, concert, or party involves chasing people down on messaging apps or social media, resulting in lost resolution and high friction. DropCast solves this by letting hosts:
1. Create a dedicated event dashboard.
2. Generate and display a custom QR code at the venue.
3. Allow guests to instantly upload original photos/videos directly from their phone's native browser.
4. Stream these shared moments live onto a projector screen or gallery feed using Server-Sent Events (SSE).

---

## Technology Stack

### Frontend (Next.js App Router)
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4 with custom gradients and glassmorphism design.
- **Authentication**: Kinde Auth for host authentication and dashboard protection.
- **Real-time Updates**: Server-Sent Events (SSE) listener for instant feed updates.

### Backend (Express Node.js)
- **Runtime**: Node.js in ES Module mode (`"type": "module"`).
- **Framework**: Express.js
- **Media Parser**: Multer (configured for in-memory buffers).
- **QR Generation**: `qrcode` library.

### Storage & Database
- **Database**: MongoDB (Dropcast database) for event metadata and upload logs.
- **Storage**: Cloudinary API for high-resolution photo/video storage and secure delivery.

---

## Getting Started: Local Setup

Follow these steps to run both the frontend and the backend on your local machine.

### Prerequisites
- Node.js (v18.11.0 or higher recommended, to support watch modes).
- A MongoDB cluster or local database instance.
- A Cloudinary account (for image/video hosting).
- A Kinde Auth project (for host authentication).
- A Mailchimp account (for newsletter subscription routing, optional).

---

### Step 1: Environment Variables

Create a `.env.local` file in the **root** of the workspace directory. It should contain the following configurations:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Mailchimp Marketing Configuration
MAILCHIMP_API_KEY=your-mailchimp-api-key
MAILCHIMP_SERVER=your-mailchimp-server-prefix (e.g. us21)
MAILCHIMP_AUDIENCE_ID=your-mailchimp-audience-id

# Kinde Authentication Configuration (Next.js)
KINDE_CLIENT_ID=your-kinde-client-id
KINDE_CLIENT_SECRET=your-kinde-client-secret
KINDE_ISSUER_URL=https://<your-auth-domain>.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
PORT=5000
```

---

### Step 2: Running the Express Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Run the development server (runs with automatic watch reload):
   ```bash
   npm run dev
   ```
   *The Express server will start on port `5000` (`http://localhost:5000`).*

---

### Step 3: Running the Next.js Frontend

1. Navigate to the root directory of the project:
   ```bash
   cd ..
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The client application will start on port `3000` (`http://localhost:3000`).*

---

## File Upload Constraints

- Both the frontend UI and the backend servers enforce a **30MB maximum file size limit** (configured for high-resolution images and short video clips).
- Next.js Server Actions are configured in `next.config.mjs` to accept payloads up to `30mb` via:
  ```javascript
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb',
    },
  }
  ```
- Express backend is protected via Multer request limits:
  ```javascript
  const upload = multer({
    limits: { fileSize: 30 * 1024 * 1024 }
  });
  ```
