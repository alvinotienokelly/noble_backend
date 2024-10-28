# Noblestride

Noblestride is a Node.js application that provides APIs for user management and deal management. The project uses Express.js for routing, Sequelize for ORM, and JWT for authentication.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/noblestride.git
    cd noblestride
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables in a `.env` file:
    ```env
    secretKey=ydwygyegyegcveyvcyegc
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage

The server will start on the port specified in the `.env` file or default to port 8080. You can access the APIs using a tool like Postman or via your frontend application.

## API Endpoints

### User Routes

- **POST** `/api/users/signup` - Register a new user
- **POST** `/api/users/login` - Login a user
- **GET** `/api/users/profile` - Get the profile of the logged-in user

### Deal Routes

- **POST** `/api/deals` - Create a new deal
- **GET** `/api/deals` - Get all deals
- **GET** `/api/deals/:id` - Get a deal by ID
- **PUT** `/api/deals/:id` - Update a deal by ID
- **DELETE** `/api/deals/:id` - Delete a deal by ID

### Document Routes

- **POST** `/api/documents` - Create a new document
- **GET** `/api/documents` - Get all documents
- **GET** `/api/documents/:id` - Get a document by ID
- **PUT** `/api/documents/:id` - Update a document by ID
- **DELETE** `/api/documents/:id` - Delete a document by ID

### Transaction Routes

- **POST** `/api/transactions` - Create a new transaction
- **GET** `/api/transactions` - Get all transactions
- **GET** `/api/transactions/:id` - Get a transaction by ID
- **PUT** `/api/transactions/:id` - Update a transaction by ID
- **DELETE** `/api/transactions/:id` - Delete a transaction by ID

## Environment Variables

The following environment variables are used in the project:

- `secretKey`: The secret key used for JWT authentication.

## Project Structure