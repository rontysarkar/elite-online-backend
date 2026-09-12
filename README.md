# Elite Online ISP

Elite Online ISP is an **Internet Service Provider (ISP) Management System** developed to digitalize and simplify customer connection requests, package management, monthly billing, payment collection, and reporting.

This project is developed as a **Backend API** using Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.

## 🚀 Live API

🔗 **Live API:** [Elite Online ISP API](https://elite-online-backend.vercel.app)

---

## 🛠️ Backend Technology

- **Node.js** — Runtime Environment
- **Express.js** — Backend Framework
- **TypeScript** — Type-safe Development
- **PostgreSQL** — Relational Database
- **Prisma ORM** — Database ORM & Query Management

---

## 🔄 Project Workflow

```text
Connection Request
        ↓
Admin Review & Approval
        ↓
New Customer Creation
        ↓
Monthly Bill Generation
        ↓
       Payment
      ↙       ↘
   bKash      Cash
 (Customer) (Collector)
      ↘       ↙
      Bill Update
          ↓
     Admin Reports
```

### Workflow Description

1. A customer submits a connection request by selecting an internet package and area.
2. The Admin reviews the connection request.
3. After approval, a new customer account is created with the selected package and area.
4. Every month, the system generates a monthly bill for the customer.
5. The customer can pay the bill through bKash, or the assigned collector can collect the payment through cash.
6. After successful payment, the bill status is updated to PAID.
7. Finally, the Admin can view overall billing and collection reports.

---

## ✨ Main Features

- Customer connection request
- Package and area selection
- Admin request review and approval
- Automatic customer creation after approval
- Internet package management
- Area management
- Collector assignment by area
- Monthly bill generation
- Online payment through bKash
- Manual cash collection by collectors
- Bill payment status management
- Paid, unpaid, and overdue bill tracking
- Cash and bKash payment tracking
- Admin billing and collection reports

---

## 👥 User Roles

### 👨‍💼 Admin

- Manage customers
- Manage collectors
- Manage internet packages
- Manage service areas
- Review and approve connection requests
- Manage bills and payments
- View overall billing reports
- View paid, unpaid, and overdue amounts
- View cash and bKash collection information

### 🧑‍💼 Collector

- View customers from assigned areas
- View customer bills
- Collect bills through cash
- Update cash payment information
- View collection-related information

### 👤 Customer

- Submit internet connection requests
- Select package and area
- View monthly bills
- View payment information
- Pay bills through bKash

---

## 📊 Admin Reports

The Admin can get an overall overview of the billing system, including:

- Total bills
- Total bill amount
- Paid bills and amount
- Unpaid bills and amount
- Overdue bills and amount
- Cash collection
- bKash payment
- Collection rate

---

## 🔐 Demo Credentials

### Admin

```
Email: admin@gmail.com
Password: 12345678
```

### Collector

```
Email: rabby@gmail.com
Password: 12345678
```

> **Note:** Replace the password placeholders with your actual demo passwords before publishing the README.

---

## 📌 Project Goal

The main goal of Elite Online ISP is to make the ISP's customer management, billing, payment collection, and reporting process more organized, efficient, and digital.