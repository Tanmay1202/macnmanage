# MacnManage - Resource Management System

A production-grade, full-stack application for managing inventory, tracking production, and monitoring resources in real-time. Built with a focus on high-density data visualization and a modern "developer-tool" aesthetic.

## 🚀 Features

### Core Modules
*   **Inventory API**: Full CRUD capabilities for Raw Materials, Machines, Tools, and Finished Goods.
*   **Production Monitor**: Real-time tracking of active machines and efficiency metrics.
*   **Dynamic Dashboard**: Bento-grid style overview with live stats and system status.

### Production Features
*   **Search**: Global `Cmd+K` / `Ctrl+K` search to jump to resources instantly.
*   **Logging System**: Dedicated side-drawer for logging production events (Start, Stop, Issue, Output).
*   **Notifications**: Custom, non-intrusive toast notification system.
*   **Authentication**: Secure JWT-based auth flow.

## 🛠 Tech Stack

*   **Frontend**: React (Vite), TailwindCSS, Lucide Icons, React Router DOM.
*   **Backend**: Node.js, Express.
*   **Database**: MongoDB (Mongoose Schema).
*   **Design**: Dark-mode first, border-driven UI, reduced radius aesthetics.

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/macnmanage.git
    cd macnmanage
    ```

2.  **Server Setup**
    ```bash
    cd server
    npm install
    # Create .env file with:
    # MONGO_URI=your_mongodb_connection_string
    # JWT_SECRET=your_jwt_secret
    # PORT=5000
    npm run dev
    ```

3.  **Client Setup** (Open a new terminal)
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open `http://localhost:5173` in your browser.

## 📂 Project Structure

```
macnmanage/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (Sidebar, BentoGrid)
│   │   ├── context/        # Global State (ToastContext)
│   │   ├── pages/          # Views (Dashboard, Inventory, Production)
│   │   └── ...
├── server/                 # Express Backend
│   ├── controllers/        # Business Logic
│   ├── models/             # Mongoose Schemas (Resource, ProductionLog)
│   ├── routes/             # API Endpoints
│   └── ...
```

## ⌨️ Shortcuts

*   `Cmd/Ctrl + K`: Focus Search
*   `Esc`: Close Drawers/Modals

## 📄 License

This project is licensed under the Apache 2.0 License.

