# PartyRoom
🚀 Real-Time Communication & File Sharing Platform

A full-stack real-time communication platform that combines video calling, global chat, and secure file sharing into a single application.

This project was built to deeply understand how modern real-time systems work internally, including WebRTC signaling, WebSocket communication, authentication flows, and frontend-backend coordination — not just UI rendering.


---

📌 Why This Project?

Most tutorials show what to use, not how things actually work.
This project focuses on:

Understanding real-time communication

Building authentication without shortcuts

Learning state handling across frontend & backend

Designing scalable and secure APIs



---

🔥 Core Modules


---

🎥 1. Real-Time Video Call

A peer-to-peer video calling system similar to Zoom/Meet (simplified).

Features

Room-based video calls

Peer-to-peer audio & video streaming

Camera and microphone controls

Live remote stream rendering


Tech Used

WebRTC – Media streaming

STUN servers – NAT traversal

WebSockets – Signaling

React – UI and media controls

Spring Boot – Signaling backend


How It Works

1. User joins a room


2. WebSocket establishes signaling channel


3. WebRTC exchanges offers/answers


4. Media streams connect directly between peers




---

💬 2. Global Open Chat

A real-time global chat system where users can communicate instantly.

Features

Real-time bi-directional messaging

Live user join/leave tracking

Emoji support

Message persistence

Automatic cleanup of old messages


Tech Used

WebSockets

Spring Boot

React

SQL Database

JPA / Hibernate


How It Works

WebSocket keeps persistent connection

Messages are broadcast to all active users

Messages are stored in DB and fetched on join



---

📁 3. Secure File Transfer System

A personal cloud-style file sharing module with authentication.

Features

User registration & login

Password hashing using BCrypt

Private file storage per user

Upload & download files securely


Tech Used

Spring Boot REST APIs

Spring Security

BCrypt Password Encoder

React Dashboard

SQL Database


Security

Plain passwords are never stored

BCrypt hashing with salt

Unauthorized access is blocked



---

🧠 Tech Stack Summary

Frontend

React.js

JavaScript (ES6+)

WebRTC APIs

WebSocket client

Inline CSS


Backend

Java

Spring Boot

Spring Security

REST APIs

WebSockets


Database

SQL

JPA / Hibernate



---

🏗 System Architecture

React Frontend
     |
     | REST / WebSocket
     |
Spring Boot Backend
     |
     | JPA
     |
SQL Database

WebSockets → Real-time chat & signaling

WebRTC → Peer-to-peer media streams

REST APIs → Auth & file handling



---

🔐 Authentication Flow

Registration

1. User submits username & password


2. Password is hashed using BCrypt


3. User stored in database



Login

1. Username fetched from DB


2. BCrypt verifies password


3. Session is allowed




---

🧪 Local Setup

Backend

cd backend
mvn spring-boot:run

Runs on:

http://localhost:8080

Frontend

cd frontend
npm install
npm start

Runs on:

http://localhost:3000


---

⚠️ Notes

Built primarily for learning & demonstration

Deployed on free hosting (cold starts possible)

WebRTC may take a few seconds on first connection



---

🚀 Future Improvements

JWT authentication

Role-based access control

TURN servers for better WebRTC reliability

Improved UI/UX

Cloud file storage (AWS S3 / GCP)



---

👨‍💻 Developer

Pranay Pawar
Full-Stack Java Developer

📧 Email: 00pranaypawar@gmail.com
🔗 LinkedIn:
https://www.linkedin.com/in/pranay-pawar-3707101ab


---

⭐ Final Note

This project demonstrates real-world full-stack skills:

Real-time communication

Secure authentication

Backend logic

Frontend state handling

System design fundamentals
