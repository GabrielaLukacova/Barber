![Barber Website Hero](./frontend/src/assets/hero.jpg)

# Barber Website – Barber Shop Management & Booking System

## About this project

This project is a full-stack barber shop web application consisting of a public website and an admin management panel.  
It is designed to present a barber shop professionally online while providing simple, efficient tools for managing daily operations.

The system focuses on clean UX, maintainable architecture, and real-world usability for small service businesses.

---

## The application handles

- Customer bookings with service, date and time selection
- Admin management of shop data and availability
- Gallery image management
- Opening hours and time-off handling
- Automatic booking status handling

---

## Features

### Public Website
- Services listing with prices
- Dynamic image gallery loaded from backend
- Opening hours with current day highlighted
- Clean contact section
- Customer booking system (no payments)
- Conditional display of time-off periods
- Accessible, responsive design

### Admin Panel
- Barber shop profile management
- Opening hours management
- Gallery image upload and ordering
- Booking management with status filters
- Automatic sorting of bookings by date
- Time-off management
- UX aligned with the public website

---

## Tech stack

### Frontend
- Vue 3
- Vite
- TypeScript
- Pinia
- Tailwind CSS

### Backend
- TypeScript (Node.js)
- RESTful API
- PostgreSQL database
- Static file handling for uploaded images

---

## API documentation & testing

- Interactive API documentation and testing via Swagger UI
- Manual API testing supported with Postman collections

---

## Testing and code quality

- Unit testing with Jest
- Integration testing
- End-to-end testing with Playwright
- Code formatting with Prettier
- Code linting with ESLint
- Continuous Integration and Deployment (CI/CD) using GitHub Actions

---

## Architecture

- Clear separation between public and admin modules
- Centralized state management with Pinia for shared data (services, gallery, bookings, opening hours)
- Environment-specific configuration for API access
- Consistent UX and styling across the application
- Designed for scalability and future extensions

---

## Deployment

- Frontend hosted on Render
- Backend hosted on Render
- Environment variables used for API configuration

---

## Notes

- Gallery images support absolute and backend-relative paths
- Bookings are auto-loaded and sorted from earliest to latest
- Past bookings are hidden by default and accessible via filters
- The codebase is structured for long-term maintainability