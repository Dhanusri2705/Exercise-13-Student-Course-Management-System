# Student-Course Management System

A MERN-based Student-Course Management System built using a **Microservices Architecture**. The application manages student and course information through separate backend services and integrates them with a React frontend.

## Project Overview

The Student-Course Management System demonstrates how microservices communicate to provide student and course details. The Student Service manages student records, while the Course Service manages course information. The React frontend communicates with the backend APIs to display the combined information.

## Technologies Used

- **Frontend:** React.js, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Architecture:** Microservices
- **API Communication:** REST APIs
- **Environment Configuration:** dotenv

## Project Structure

```text
Exercise-13/
├── student-service/
│   ├── server.js
│   ├── package.json
│   └── .env
├── course-service/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

**Note:** Environment files (`.env`) and `node_modules` folders are excluded from GitHub.

## Features

- Manage student information through the Student Service.
- Retrieve course information through the Course Service.
- Fetch student details along with the corresponding course details.
- Communicate between independent microservices using REST APIs.
- Display student and course information through a React frontend.
- Configure service URLs and database settings using environment variables.

## Microservices Architecture

### 1. Student Service

Runs on port `5001`.

Responsibilities:
- Manage student records.
- Retrieve student information.
- Request course details from the Course Service.
- Combine student and course information in a single API response.

### 2. Course Service

Runs on port `5002`.

Responsibilities:
- Manage course records.
- Retrieve course details using the course ID.
- Provide course information to the Student Service.

### 3. React Frontend

Runs on port `3000`.

Responsibilities:
- Provide the user interface.
- Send requests to the Student Service.
- Display student and course details.

## Installation and Setup

### Prerequisites

Install the following:

- Node.js and npm
- MongoDB
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/Dhanusri2705/Exercise-13-Student-Course-Management-System.git
cd Exercise-13-Student-Course-Management-System
```

### Step 2: Install Backend Dependencies

Open a terminal for each service.

**Student Service**

```bash
cd student-service
npm install
```

**Course Service**

```bash
cd course-service
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside each backend service folder.

For `student-service/.env`:

```env
MONGODB_URI=mongodb://localhost:27017
COURSE_SERVICE_URL=http://localhost:5002
PORT=5001
```

For `course-service/.env`, configure the MongoDB connection and port according to the Course Service code.

Do not upload `.env` files to GitHub.

### Step 4: Start the Backend Services

Start MongoDB first.

In the Student Service terminal:

```bash
npm start
```

In the Course Service terminal:

```bash
npm start
```

If `npm start` is not configured in a service's `package.json`, use:

```bash
node server.js
```

### Step 5: Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

Open the application at:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students/:id/details` | Retrieves student details along with course details |
| GET | `/courses` | Retrieves available courses |
| GET | `/courses/:id` | Retrieves a course using its ID |
| POST | `/courses` | Creates a course, if supported by the service |

The Student Service also supports the student-related routes defined in its backend implementation.

## Example

Request:

```http
GET http://localhost:5001/students/1/details
```

The response contains student information and the associated course information retrieved from the Course Service.

## Advantages of Microservices

- Independent services for student and course management.
- Easier maintenance and debugging.
- Clear separation of responsibilities.
- Independent development and deployment of services.
- REST API-based communication between services.

## Conclusion

The Student-Course Management System demonstrates the implementation of a microservices-based application using the MERN technology stack. It shows how independent backend services communicate through REST APIs and how a React frontend presents the combined data to users.
