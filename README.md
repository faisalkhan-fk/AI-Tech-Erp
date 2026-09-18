# 🤖 AI-Tech ERP

An **AI-Powered Enterprise Resource Planning (ERP) System** designed to simplify and automate organizational operations through a centralized web-based platform.

The system provides role-based access for **Admin, Manager, and Employee**, with modules for employee management, attendance, leave management, task management, reporting, and AI-assisted productivity.

## 🌐 Live Demo

🚀 **Try the application:**

👉 https://ai-tech-erp.vercel.app/

---

## 📌 About The Project

**AI-Tech ERP** is a full-stack ERP platform that brings multiple organizational processes together in one system.

The goal of the project is to reduce manual administrative work, improve task management, provide meaningful dashboards, and use AI capabilities to assist employees and managers in their daily operations.

---

## ✨ Key Features

### 🔐 Role-Based Authentication

The system supports different roles with role-specific access:

* 👨‍💼 **Admin**
* 🧑‍💼 **Manager**
* 👨‍💻 **Employee**

Each role gets access to the features relevant to their responsibilities.

### 👥 Employee Management

* Add and manage employees
* View employee information
* Manage employee roles
* Employee records management

### 🕐 Attendance Management

* Track employee attendance
* Monitor attendance records
* Attendance dashboard
* Centralized attendance information

### 🏖️ Leave Management

* Submit leave requests
* Review leave requests
* Approve or reject leaves
* Track leave status

### ✅ Task Management

* Create and assign tasks
* Track task status
* Set task priorities
* Monitor task progress
* Manager and employee task views

### 🤖 AI-Powered Features

The system is designed with AI-assisted functionality to improve productivity, including:

* AI-based task recommendations
* AI-generated reports
* Intelligent productivity insights
* Automated assistance for organizational workflows

### 📊 Dashboard & Analytics

Role-specific dashboards provide an overview of important organizational information such as:

* Employee statistics
* Attendance
* Leave requests
* Task progress
* Productivity information
* Organizational metrics

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │     React.js        │
                    │      Tailwind       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │    Spring Boot      │
                    │    Java REST API    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    │       MySQL         │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    AI Services      │
                    │ AI Recommendations  │
                    │   & AI Reports      │
                    └─────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* ⚛️ React.js
* 🎨 Tailwind CSS
* JavaScript
* HTML5
* CSS3

### Backend

* ☕ Java
* 🌱 Spring Boot
* REST APIs
* JWT Authentication

### Database

* 🗄️ MySQL

### AI & Analytics

* 🤖 AI-powered task recommendations
* 📄 AI-generated reports
* 📊 Dashboard analytics

### Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm

### Deployment

* ▲ Vercel — Frontend
* ☁️ Backend deployment environment

---

## 🔑 Authentication & Security

The application uses authentication and role-based authorization to protect system resources.

```text
User Login
    ↓
Authentication
    ↓
JWT Token
    ↓
Role Verification
    ↓
Role-Based Dashboard
```

Different users receive access according to their assigned role.

---

## 👨‍💼 User Roles

| Role        | Responsibilities                                                 |
| ----------- | ---------------------------------------------------------------- |
| 🔴 Admin    | Manage employees, roles, organizational data and system settings |
| 🟡 Manager  | Manage team tasks, leave requests and monitor team performance   |
| 🟢 Employee | Manage assigned tasks, attendance and leave requests             |

---

## 📂 Project Structure

```text
AI-Tech-Erp/
│
├── backend/
│   └── Spring Boot Backend
│
├── frontend/
│   └── React Frontend
│
├── backend.zip
│
├── fix_urls.js
├── generate_auth.js
├── generate_frontend.js
├── generate_phase2.js
├── generate_phase2_frontend.js
├── generate_phase3.js
├── generate_phase3_frontend.js
├── generate_phase4.js
├── generate_phase4_frontend.js
├── generate_security.js
└── update_urls.js
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/faisalkhan-fk/AI-Tech-Erp.git
cd AI-Tech-Erp
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on the local development server.

### 3. Backend Setup

Open the `backend` project in your preferred Java IDE such as IntelliJ IDEA, Eclipse, or VS Code.

Configure your MySQL database and update the database credentials in the Spring Boot configuration.

Then run the Spring Boot application.

---

## 🗄️ Database Configuration

Example MySQL configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_tech_erp
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> Replace the database credentials with your local configuration.

---

## 🔄 Application Workflow

```text
User
 │
 ▼
Login
 │
 ▼
Authentication
 │
 ▼
Role Verification
 │
 ├───────────────┐
 ▼               ▼
Admin          Manager
 │               │
 ▼               ▼
Admin          Manager
Dashboard      Dashboard
 │               │
 └───────┬───────┘
         │
         ▼
   ERP Modules
         │
 ┌───────┼────────┐
 ▼       ▼        ▼
Tasks  Attendance Leave
         │
         ▼
     AI Features
         │
         ▼
 Reports & Insights
```

---

## 📊 Main ERP Modules

```text
┌───────────────────────────────┐
│          AI-Tech ERP          │
├───────────────────────────────┤
│ 👥 Employee Management        │
│ 🕐 Attendance Management      │
│ 🏖️ Leave Management           │
│ ✅ Task Management             │
│ 🤖 AI Task Recommendation     │
│ 📄 AI Report Generation       │
│ 📊 Dashboard & Analytics      │
│ 🔐 Role-Based Authentication  │
└───────────────────────────────┘
```

---

## 🎯 Project Objectives

* Centralize organizational operations
* Reduce manual administrative work
* Improve employee task management
* Provide role-based dashboards
* Automate reporting processes
* Improve productivity using AI
* Provide a scalable full-stack ERP architecture

---

## 🔮 Future Enhancements

* 💬 AI-powered ERP chatbot
* 📧 Automated email notifications
* 📱 Mobile application
* 📈 Advanced predictive analytics
* 🧠 More intelligent employee/task recommendations
* 🔔 Real-time notifications
* 📅 Calendar integration
* 📊 Advanced HR analytics
* ☁️ Improved cloud infrastructure
* 🔒 Enhanced security and audit logging

---

## 🌐 Project Links

### 🚀 Live Application

👉 https://ai-tech-erp.vercel.app/

### 💻 GitHub Repository

👉 https://github.com/faisalkhan-fk/AI-Tech-Erp

---

## 👨‍💻 Author

**Faisal Khan**

MCA Student | Full Stack Developer | AI & Software Development Enthusiast

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ **Star** on GitHub.

---

**Built with ❤️ using React, Spring Boot, MySQL and AI**
