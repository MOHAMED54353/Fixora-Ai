# Fixora AI | Smart Car Maintenance Platform

**Smarter Diagnosis. Easier Booking. Better Car Care.**

Fixora AI is an AI-powered car maintenance platform that connects customers with maintenance services through intelligent problem analysis, online booking, and technician management.

The platform is designed to simplify the vehicle maintenance journey by bringing AI-assisted diagnosis, service discovery, booking management, and customer feedback into one unified experience.

## Overview

Finding the right maintenance service can be time-consuming, especially when drivers are unsure what is wrong with their vehicles.

Fixora AI addresses this challenge by allowing users to describe their car problems, receive preliminary AI-generated recommendations, and book suitable maintenance services through a centralized platform.

The system also provides dedicated workflows for customers, technicians, and administrators to help organize the maintenance process from booking creation to service completion.

## Key Features

### AI-Powered Car Diagnosis

* Analyze vehicle problems based on user-provided descriptions.
* Generate preliminary AI-assisted recommendations.
* Present diagnosis results to help users understand potential issues before requesting maintenance.

### Service Booking

* Browse available maintenance services.
* Create and manage maintenance bookings.
* Track booking progress through different statuses.
* Support additional maintenance issues during the service workflow.

### Vehicle Management

* Manage vehicle information.
* Associate maintenance requests with the relevant vehicle.
* Keep vehicle-related service activities organized.

### Technician Management

* Manage technician information and experience.
* Support technician assignment to maintenance bookings.
* Track maintenance progress through booking status updates.

### Role-Based Access

* **Customer:** Manage vehicles, request AI diagnosis, book services, and submit reviews.
* **Technician:** Handle assigned bookings and update maintenance progress.
* **Administrator:** Manage platform services, technicians, bookings, and operational information.

### Booking Lifecycle

* Pending
* In Progress
* Waiting for Client Approval
* Completed
* Cancelled

### Reviews and Invoices

* Submit ratings and reviews for completed services.
* Access booking-related invoice information.

## Technology Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge\&logo=vite\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-671DDF?style=for-the-badge\&logo=axios\&logoColor=white)

* React Router
* Axios
* REST API integration

### Backend

![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge\&logo=dotnet\&logoColor=white)

* RESTful API architecture
* Authentication and authorization
* Role-based access control
* Booking and service management

### AI Integration

* AI-assisted vehicle problem analysis.
* Preliminary recommendations based on user descriptions.

## System Architecture

Fixora AI follows a client-server architecture:

1. **Frontend:** Provides the user interface and handles user interactions.
2. **Backend API:** Processes requests, applies business logic, and manages platform operations.
3. **Database:** Stores application data, including users, vehicles, services, bookings, and related information.
4. **AI Integration:** Analyzes user-provided vehicle problem descriptions and returns preliminary recommendations.

## Booking Workflow

```text
Customer
   |
   v
Describe Car Problem
   |
   v
AI-Assisted Diagnosis
   |
   v
Select Maintenance Service
   |
   v
Create Booking
   |
   v
Technician Assignment
   |
   v
Maintenance Process
   |
   v
Service Completion
   |
   v
Invoice and Customer Review
```

## Security and Access Control

The platform includes authentication and role-based access to support separate workflows for customers, technicians, and administrators.

Authenticated requests communicate with the backend API, while protected frontend routes help control access to role-specific pages.

## Getting Started

### Prerequisites

* Node.js and npm
* Access to the Fixora AI backend API
* Git

## Future Improvements

Potential directions for future development include:

* Advanced vehicle diagnostic capabilities.
* Maintenance history and service reminders.
* Enhanced technician availability management.
* Fleet management for business customers.
* Expanded analytics and operational reporting.

## Important Disclaimer

AI-generated diagnoses are preliminary and depend on the information provided by the user. They should not be treated as definitive mechanical diagnoses or as a substitute for professional vehicle inspection.

## Contributors

**Mohamed Elsayed**

GitHub: [@MOHAMED54353](https://github.com/MOHAMED54353)

---

**Fixora AI — Bringing Intelligence to Car Maintenance.**
