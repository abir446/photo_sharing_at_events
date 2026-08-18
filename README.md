# 📸 DropCast — Plan & Capture Every Moment

DropCast is a modern, high-performance event management and photo-sharing platform. It bridges the gap between event hosts, professional photographers, and guests to collect and deliver memories in one secure, unified ecosystem.

Whether you are hosting a wedding, a concert, a corporate conference, or a milestone party, DropCast ensures that every single angle of your event is preserved.

---

## 🌟 Key Features

### 🤝 Professional Creator Marketplace
- **Vetted Local Talent:** Browse local professional creators curated by geographic location, budget range, and style preference.
- **Aesthetic Filtering:** Filter portfolios by distinct style tags including *Candid*, *Cinematic*, *Traditional*, *Editorial*, and *Documentary*.
- **Initial Portfolio Previews:** Cycle through key portfolio works directly in the marketplace search results before clicking to view a full profile.

### 🛡️ Escrow-Backed Booking Engine
- **Secure Milestone Payments:** Hosts secure dates with deposits held in escrow, releasing funds to creators only upon completion of event milestones.
- **Schedule Management:** Photographers receive instant notifications of booking requests and can manage their calendar and pending leads from their dedicated Creator Hub.

### 📲 Instant Guest QR Galleries
- **Zero App Barrier:** Guests scan custom-generated event QR codes to upload photos directly from their native mobile browsers. No App Store downloads required.
- **Real-Time Stream:** A live SSE (Server-Sent Events) feed updates event galleries in real-time, letting hosts view guest perspectives instantly.
- **Secure Cloud Delivery:** All deliverables and guest uploads are optimized, stored, and backed up in secure cloud-based media repositories.

---

## 🛠️ Technology Stack

DropCast is built using standard, modern technologies optimized for performance and reliability:

- **Frontend Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS (Vanilla utilities)
- **Database:** MongoDB (using native database clients)
- **Authentication:** Secure session authentication
- **UI Components:** Mantine UI and Lucide Icons
- **Real-time Engine:** SSE (Server-Sent Events)

---

## 🚀 Getting Started

To run DropCast locally on your machine, follow these steps:

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/abir446/photo_sharing_at_events.git
cd photo_sharing_at_events
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and define the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
# Add authentication and media credentials
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the marketplace, dashboard, and QR event systems.

---

## 📄 License
This project is licensed under the MIT License.
