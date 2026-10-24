# Movie Ticket Booking Frontend

A React + TypeScript frontend for the Movie Ticket Booking System.

## Overview

This project provides a customer and admin interface for browsing movies, scheduling shows, selecting seats, creating bookings, processing payments, and managing records.

## Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

## Requirements

- Node.js 22
- npm
- Existing Spring Boot backend running at http://localhost:8080

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Run

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:8080
API: http://localhost:8080/api

## Routes

- Public: `/`, `/movies`, `/movies/:id`, `/theatres`, `/shows`, `/shows/:id`, `/signin`, `/signup`
- Customer: `/bookings/new/:showId`, `/bookings`, `/bookings/:id`, `/payments/:bookingId`, `/payments/:id/status`
- Admin: `/admin`, `/admin/users`, `/admin/movies`, `/admin/theatres`, `/admin/shows`, `/admin/bookings`, `/admin/payments`

## Authentication

Users sign in using the backend JWT auth endpoints. The JWT is saved in local storage and attached via Axios interceptor.

## Folder Structure

- src/components
- src/context
- src/pages
- src/routes
- src/services
- src/types
- src/utils

## Testing

- Run the backend first.
- Start the frontend with `npm run dev`.
- Validate the normal booking and admin flows against the real API.

## Future Enhancements

- Interactive theatre seat map layouts
- Multi-screen support and enhanced search
- Review and rating features
- Online payment integrations
