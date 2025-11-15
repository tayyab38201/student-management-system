const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'students.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Read students from file
const readStudents = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (error) {
        console.log('Creating new data file...');
    }
    
    // Default sample data
    const defaultStudents = [
        {
            id: 1,
            name: "Ali Ahmed",
            rollNumber: "ST001",
            age: 20,
            grade: "A",
            email: "ali.ahmed@example.com",
            phone: "0300-1234567",
            course: "Computer Science",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: "Sara Khan",
            rollNumber: "ST002",
            age: 22,
            grade: "A+",
            email: "sara.khan@example.com",
            phone: "0312-7654321",
            course: "Software Engineering",
            createdAt: new Date().toISOString()
        }
    ];
    writeStudents(defaultStudents);
    return defaultStudents;
};

// Write students to file
const writeStudents = (students) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
};

let students = readStudents();

// ========== API ROUTES ==========

// GET - Get all students
app.get('/api/students', (req, res) => {
    const { search, course, grade } = req.query;
    
    let filteredStudents = [...students];

    // Search by name or roll number
    if (search) {
        filteredStudents = filteredStudents.filter(student => 
            student.name.toLowerCase().includes(search.toLowerCase()) ||
            student.rollNumber.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Filter by course
    if (course) {
        filteredStudents = filteredStudents.filter(student => 
            student.course.toLowerCase().includes(course.toLowerCase())
        );
    }

    // Filter by grade
    if (grade) {
        filteredStudents = filteredStudents.filter(student => student.grade === grade);
    }

    res.json({
        success: true,
        data: filteredStudents,
        count: filteredStudents.length
    });
});

// GET - Get student by ID
app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }
    res.json({
        success: true,
        data: student
    });
});

// POST - Add new student
app.post('/api/students', (req, res) => {
    const { name, rollNumber, age, grade, email, phone, course } = req.body;
    
    // Validation
    if (!name || !rollNumber || !age || !grade || !email || !course) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required except phone'
        });
    }

    // Check if roll number already exists
    if (students.find(s => s.rollNumber === rollNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Roll number already exists'
        });
    }

    const newStudent = {
        id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
        name,
        rollNumber,
        age: parseInt(age),
        grade,
        email,
        phone: phone || 'N/A',
        course,
        createdAt: new Date().toISOString()
    };

    students.push(newStudent);
    writeStudents(students);
    
    res.status(201).json({
        success: true,
        message: 'Student added successfully',
        data: newStudent
    });
});

// PUT - Update student
app.put('/api/students/:id', (req, res) => {
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    
    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }

    const updatedStudent = {
        ...students[studentIndex],
        ...req.body,
        id: students[studentIndex].id // Preserve original ID
    };

    students[studentIndex] = updatedStudent;
    writeStudents(students);
    
    res.json({
        success: true,
        message: 'Student updated successfully',
        data: updatedStudent
    });
});

// DELETE - Remove student
app.delete('/api/students/:id', (req, res) => {
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    
    if (studentIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];
    writeStudents(students);
    
    res.json({
        success: true,
        message: 'Student deleted successfully',
        data: deletedStudent
    });
});

// GET - Statistics
app.get('/api/statistics', (req, res) => {
    const totalStudents = students.length;
    const courses = [...new Set(students.map(s => s.course))];
    const grades = students.reduce((acc, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
        return acc;
    }, {});

    res.json({
        success: true,
        data: {
            totalStudents,
            totalCourses: courses.length,
            gradeDistribution: grades
        }
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎓 Student Management System running on http://localhost:${PORT}`);
    console.log(`📊 Total students: ${students.length}`);
});