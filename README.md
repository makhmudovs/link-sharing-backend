# LinkSharing

LinkSharing is a backend API built with Express and TypeScript that allows users to register, log in, and manage shareable links. The app uses MongoDB for data storage, JWT for authentication, and includes a test suite using Jest and Supertest.

## Features

- **User Authentication**: Register and log in users with email and password, secured with JWT.
- **Link Management**: Authenticated users can create and retrieve links with associated platforms (e.g., YouTube, Twitter).
- **TypeScript**: Fully typed codebase for better maintainability and developer experience.
- **MongoDB**: Persistent storage for users and links.
- **Testing**: Comprehensive test suite using Jest, Supertest, and MongoDB Memory Server.
- **Environment Configuration**: Uses `dotenv` for environment variable management.

## Tech Stack

- **Node.js**: Runtime environment.
- **Express**: Web framework for building the API.
- **TypeScript**: For type safety and better development experience.
- **MongoDB**: NoSQL database for storing users and links.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For user authentication.
- **Zod**: For request validation.
- **Jest & Supertest**: For unit and integration testing.
- **MongoDB Memory Server**: For in-memory database testing.

## Project Structure
