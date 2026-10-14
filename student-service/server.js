require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL;

const dbName = "StudentMicroserviceDB";

let client;
let students;

// Connect to MongoDB
async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is missing");
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(dbName);
    students = db.collection("students");

    console.log("Student Service connected to MongoDB");
}

// Home route
app.get("/", (req, res) => {
    res.send("Student Service is running!");
});

// GET all students
app.get("/students", async (req, res) => {
    try {
        const result = await students.find().toArray();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve students",
            error: error.message
        });
    }
});

// POST a student
app.post("/students", async (req, res) => {
    try {
        const { studentId, name, email, courseId } = req.body;

        if (
            studentId === undefined ||
            !name ||
            !email ||
            courseId === undefined
        ) {
            return res.status(400).json({
                message: "studentId, name, email and courseId are required"
            });
        }

        const student = {
            studentId: Number(studentId),
            name,
            email,
            courseId: Number(courseId)
        };

        const result = await students.insertOne(student);

        res.status(201).json({
            message: "Student added successfully",
            insertedId: result.insertedId,
            student
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add student",
            error: error.message
        });
    }
});

// GET student with course details
app.get("/students/:id/details", async (req, res) => {
    try {
        const student = await students.findOne({
            studentId: Number(req.params.id)
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!COURSE_SERVICE_URL) {
            return res.status(500).json({
                message: "COURSE_SERVICE_URL environment variable is missing"
            });
        }

        const response = await fetch(
            `${COURSE_SERVICE_URL.replace(/\/$/, "")}/courses/${student.courseId}`
        );

        if (!response.ok) {
            return res.status(502).json({
                message: "Course Service could not retrieve course details",
                status: response.status
            });
        }

        const course = await response.json();

        res.json({
            student,
            course
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to communicate with Course Service",
            error: error.message
        });
    }
});

// Start after database connection succeeds
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Student Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Student Service:", error.message);
        process.exit(1);
    }
}

startServer();
