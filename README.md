# MediCare+ | Clinic Booking System

![MediCare+ Banner](client/public/vite.svg)

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🏥 MediCare+ – Clinic Booking System

**MediCare+** is a modern **MERN Stack** clinic booking web application that connects **patients, doctors, and administrators** through a secure, scalable, and visually rich platform.  
The system provides **role-based dashboards**, **real-time appointment booking**, and a **premium UI with 3D animations**.

---

## 🚀 Features

### 🌟 Patient Features
- Book appointments by doctor specialty
- View doctor profiles and availability
- Manage appointments and booking history
- Mobile-first responsive UI
- Modern glassmorphism UI with 3D effects

### 👨‍⚕️ Doctor Features
- Doctor dashboard with upcoming appointments
- Manage profile, availability slots, and fees
- Secure authentication and authorization
- Real-time appointment updates

### 🛠 Admin Features
- Admin dashboard for full system control
- Manage doctors, patients, and hospitals
- Add, edit, or remove doctor profiles
- Centralized monitoring and management

---

## 🏗 Tech Stack

### Frontend (Client)
- React.js (Vite)
- Tailwind CSS
- Three.js (`@react-three/fiber`, `@react-three/drei`)
- React Router DOM
- Axios
- React Icons

### Backend (Server)
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JSON Web Tokens (JWT)
- Bcrypt.js
- Nodemailer

---

## ⚙️ Installation & Setup

### 🔹 Prerequisites
- Node.js installed
- MongoDB Atlas or local MongoDB

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/clinic-booking.git
cd clinic-booking
````

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Run the backend server:

```bash
npm run dev
```

Backend runs at:
👉 [http://localhost:5000](http://localhost:5000)

---

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🌐 Live Demo

🚀 **Deployed Application:**
👉 [[https://clinic-booking-rho.vercel.app](https://clinic-booking-rho.vercel.app/)]


---

## 🚢 Deployment

Frontend

* Deployed using **Vercel**
* Environment variables configured in Vercel dashboard

 Backend

* Deployed using **Render / Railway**
* MongoDB Atlas used as cloud database

---

## 🤝 Contributing

Contributions are welcome 🙌

1. Fork the repository
2. Create your feature branch

   ```bash
   git checkout -b feature/NewFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add NewFeature"
   ```
4. Push to the branch

   ```bash
   git push origin feature/NewFeature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Developed By

**Harish**
🎓 BE CSE Student
💻 MERN Stack Developer
🌐 Portfolio: [https://harish-urcq.vercel.app](https://harish-urcq.vercel.app)

