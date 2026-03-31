# ⚡ CodeVault

> **Code that ships. Not code that sits.**

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/codevault) [![Contributors](https://img.shields.io/badge/contributors-2-blue)](#authors) [![MERN](https://img.shields.io/badge/stack-MERN-blueviolet)]() [![FullStack](https://img.shields.io/badge/type-Full--Stack-black)]() [![JWT](https://img.shields.io/badge/auth-JWT-orange)]() [![Razorpay](https://img.shields.io/badge/payments-Razorpay-0C2451)]() [![Brevo](https://img.shields.io/badge/email-Brevo-0099FF)]() [![Groq LLM](https://img.shields.io/badge/AI-Groq-black)]()

---

## 🎯 What is CodeVault?

CodeVault is a **production-grade developer marketplace** where engineers buy and sell **fully built, scalable codebases** — powered by AI, secured with modern authentication, and ready to deploy.

### ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Discovery** | Groq API powers intelligent search & recommendations |
| 💳 **Secure Payments** | Razorpay integration for hassle-free transactions |
| 🔐 **JWT Authentication** | Role-based access control (RBAC) for all users |
| 📧 **Email Automation** | Brevo API for transactional emails & notifications |

| ⚙️ **Production-Ready** | Deploy immediately — zero setup required |

---

## 👥 Platform Roles

### 🛒 Buyers
- Browse 100+ production-ready projects
- Secure instant checkout via Razorpay
- Download complete codebase immediately



### 🧑‍💻 Sellers
- Upload & monetize your codebases
- Earn 85% from every sale
- Build your engineering portfolio
- Passive income stream

### 🛡️ Admins
- Verify & approve all projects
- Maintain quality & security standards
- Monitor platform health & analytics

---

## 🛠️ Technology Stack

| Category | Tech |
|----------|------|
| **Frontend** | React 18  • Tailwind CSS • Vite |
| **Backend** | Node.js • Express • MongoDB |
| **Auth** | JWT • Auth • bcrypt |
| **Payments** | Razorpay API |
| **Email** | Brevo SMTP |
| **AI** | Groq API (LLM) |

---

## ⚙️ System Architecture

```
┌──────────────────────────────────────┐
│      React Frontend (Vite)           │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Express API + JWT Authentication    │
│  (Role-Based Access Control)         │
└────────────┬─────────────────────────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌────────────────────────────────────────┐
│  MongoDB | Razorpay | Brevo | Claude   │
└────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
PURCHASE FLOW:
Select Project → Add to Cart → Checkout
                                  ↓
            ← Payment Verification ← Razorpay
                  ↓
         Send Confirmation Email (Brevo)
                  ↓
        Grant Instant Access & Download
```

---

## 🔐 Security

| Security Feature | Implementation |
|------------------|-----------------|
| **Authentication** | JWT tokens with expiration |
| **Password** | bcrypt hashing (12 rounds) |
| **API Security** | Rate limiting & CORS |
| **Data** | SSL/TLS encryption |
| **Payments** | Razorpay|
| **Access Control** | Role-based RBAC |

---




## 🌟 Why CodeVault?

```
┌─────────────────────────────────────────────┐
│  ✅ Production-Ready Codebases              │
│  ✅ AI-Powered Search                       │
│  ✅ Secure Payments (Razorpay)              │
│  ✅ Role-Based Access (Buyer•Seller• Admin) │
└─────────────────────────────────────────────┘
```

---

## 💡 Philosophy

> "The best engineers don't start from zero. They start from verified."

CodeVault eliminates repetition so developers can focus on innovation.

---




## 👨‍💻 Authors

| Name | Role |
|------|------|
| **Shruti Sangvikar** | Full-Stack Developer |
| **Sahil Inamdar** | Full-Stack Developer |

---





<div align="center">

### ⚡ Ready to Ship Code, Not Build It?

**Browse Projects** | **Sell Your Code**

Built with ❤️ by developers, for developers

</div>
