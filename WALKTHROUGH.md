# Project Verification Walkthrough

Once the dependencies are installed, follow these steps to bring your Resource Management System to life.

## 1. Start the Backend (The Brain)
Open a terminal and run:
```bash
cd server
npm run dev
```
**Success Criteria:**
- You should see: `Server running on port 5000`
- You should see: `MongoDB Connected: ...`

## 2. Start the Frontend (The Face)
Open a **new** terminal (keep the server running!) and run:
```bash
cd client
npm run dev
```
**Success Criteria:**
- It will show a local URL, usually `http://localhost:5173`.
- Ctrl+Click that link to open it in your browser.
- You should see the **Dashboard** with the "M / M" sidebar and the Bento Grid.

## 3. Verify Functionality
1.  **Navigation**: Click the sidebar links (Inventory, Production). They should update the URL (even if the page is empty).
2.  **Responsiveness**: Resize your window. The Sidebar should vanish on small screens (basic responsive behavior).
3.  **Dark Mode**: The site should appear in Dark Mode by default (Deep backgrounds, light text).

## Troubleshooting
- **"Module not found"**: If errors say this, it means `npm install` didn't finish. Run it again in the respective folder.
- **"MongoNetworkError"**: Make sure your local MongoDB instance is running.
