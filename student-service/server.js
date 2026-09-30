const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5001;

const client = new MongoClient("mongodb://127.0.0.1:27017");

const dbName = "StudentMicroserviceDB";


// GET all students
app.get("/students", async (req, res) => {

    try {

        await client.connect();

        const db = client.db(dbName);
        const students = db.collection("students");

        const result = await students.find().toArray();

        res.json(result);

    } catch (error) {

        res.status(500).json({
            message: "Failed to retrieve students",
            error: error.message
        });

    }
});


// POST student
app.post("/students", async (req, res) => {

    try {

        await client.connect();

        const db = client.db(dbName);
        const students = db.collection("students");

        const student = {
            studentId: req.body.studentId,
            name: req.body.name,
            email: req.body.email,
            courseId: req.body.courseId
        };

        const result = await students.insertOne(student);

        res.status(201).json({
            message: "Student added successfully",
            insertedId: result.insertedId
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to add student",
            error: error.message
        });

    }
});


// Student + Course information
app.get("/students/:id/details", async (req, res) => {

    try {

        await client.connect();

        const db = client.db(dbName);
        const students = db.collection("students");

        const student = await students.findOne({
            studentId: Number(req.params.id)
        });

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        // Call Course Service
        const response = await fetch(
            `http://localhost:5002/courses/${student.courseId}`
        );

        const course = await response.json();

        res.json({
            student: student,
            course: course
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to communicate with Course Service",
            error: error.message
        });

    }
});


app.listen(PORT, () => {

    console.log(
        `Student Service running at http://localhost:${PORT}`
    );

});