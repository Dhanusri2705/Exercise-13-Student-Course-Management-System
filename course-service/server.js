require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5002;

// MongoDB Atlas connection
const client = new MongoClient(process.env.MONGODB_URI);

const dbName = "CourseMicroserviceDB";

// GET all courses
app.get("/courses", async (req, res) => {
    try {
        await client.connect();

        const db = client.db(dbName);
        const courses = db.collection("courses");

        const result = await courses.find().toArray();

        res.json(result);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve courses",
            error: error.message
        });
    }
});

// GET course by ID
app.get("/courses/:id", async (req, res) => {
    try {
        await client.connect();

        const db = client.db(dbName);
        const courses = db.collection("courses");

        const course = await courses.findOne({
            courseId: Number(req.params.id)
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.json(course);

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve course",
            error: error.message
        });
    }
});

// POST course
app.post("/courses", async (req, res) => {
    try {
        await client.connect();

        const db = client.db(dbName);
        const courses = db.collection("courses");

        const course = {
            courseId: req.body.courseId,
            courseName: req.body.courseName,
            credits: req.body.credits
        };

        const result = await courses.insertOne(course);

        res.status(201).json({
            message: "Course added successfully",
            insertedId: result.insertedId
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to add course",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Course Service running on port ${PORT}`);
});