![Barber Website Hero](./frontend/src/assets/hero.jpg)

# Barber Website – Barber Shop Management & Booking System

## About this project

This project is a full-stack barber shop web application consisting of a public website and an admin management panel.  
It is designed to present a barber shop professionally online while providing simple and efficient tools for managing daily operations.

The system focuses on clean user experience, maintainable architecture, and real-world usability for small service businesses.

---

## Application scope

The application supports the following core functionality:

- Customer bookings with service, date, and time selection  
- Admin management of shop data and availability  
- Gallery image management  
- Opening hours and time-off handling  
- Booking status management (booked, cancelled, completed)

---

## Features

### Public Website
- Services listing with prices and durations  
- Dynamic image gallery loaded from the backend  
- Opening hours with current day highlighted  
- Contact section with basic shop information  
- Customer booking system (no online payments)  
- Conditional handling of closed days and time-off periods  
- Accessible and responsive design  

### Admin Panel
- Barber shop profile management  
- Opening hours configuration  
- Gallery image upload and ordering  
- Booking overview with status filtering  
- Time-off management  
- User experience aligned with the public website  

---

## Technology stack

### Frontend
- Vue 3  
- Vite  
- TypeScript  
- Pinia (state management)  
- Tailwind CSS  

### Backend
- TypeScript (Node.js)  
- RESTful API  
- PostgreSQL database  
- Static file handling for uploaded images  

---

## API documentation and testing

- Interactive API documentation provided via Swagger UI  
- Manual API testing supported using Postman  

---

## Testing and code quality

- Unit testing using Vitest  
- Integration testing for combined frontend logic  
- End-to-end testing using Playwright  
- Code formatting enforced with Prettier  
- Code linting using ESLint  
- Continuous Integration (CI) using GitHub Actions  

![CI Status](https://github.com/GabrielaLukacova/Barber/actions/workflows/frontend-ci.yml/badge.svg)

---

## Architecture

- Clear separation between public and admin modules  
- Centralized state management with Pinia for shared data  
- Environment-based API configuration  
- Consistent UX and styling across the application  
- Structure designed for future scalability and extensions  

---

## Deployment

- Frontend hosted on Render  
- Backend hosted on Render  
- Environment variables used for configuration and credentials  

---

## Notes

- Gallery images support both absolute and backend-relative paths  
- Booking data is loaded dynamically from the backend  
- Booking status and filtering are handled through the admin interface  
- The codebase is structured for long-term maintainability and clarity  