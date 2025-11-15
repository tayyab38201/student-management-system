const API_BASE = '/api/students';

// DOM elements
const studentForm = document.getElementById('studentForm');
const editForm = document.getElementById('editForm');
const studentsList = document.getElementById('studentsList');
const loading = document.getElementById('loading');
const noStudents = document.getElementById('noStudents');
const studentCount = document.getElementById('studentCount');
const editModal = document.getElementById('editModal');

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
    loadStatistics();
});

// Load students with filters
async function loadStudents() {
    showLoading();
    
    const params = new URLSearchParams();
    
    const search = document.getElementById('search').value;
    const course = document.getElementById('filterCourse').value;
    const grade = document.getElementById('filterGrade').value;
    
    if (search) params.append('search', search);
    if (course) params.append('course', course);
    if (grade) params.append('grade', grade);

    try {
        const response = await fetch(`${API_BASE}?${params}`);
        const result = await response.json();

        if (result.success) {
            displayStudents(result.data);
            studentCount.textContent = `(${result.count})`;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error loading students:', error);
        showError('Error loading students. Please try again.');
    } finally {
        hideLoading();
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch('/api/statistics');
        const result = await response.json();

        if (result.success) {
            document.getElementById('totalStudents').textContent = result.data.totalStudents;
            document.getElementById('totalCourses').textContent = result.data.totalCourses;
            document.getElementById('gradeA').textContent = result.data.gradeDistribution['A'] || 0;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Display students in the grid
function displayStudents(students) {
    if (students.length === 0) {
        studentsList.style.display = 'none';
        noStudents.style.display = 'block';
        return;
    }

    studentsList.style.display = 'grid';
    noStudents.style.display = 'none';

    studentsList.innerHTML = students.map(student => `
        <div class="student-card">
            <div class="student-header">
                <div class="student-avatar">👨‍🎓</div>
                <div class="student-name">${student.name}</div>
                <div class="student-roll">${student.rollNumber}</div>
            </div>
            <div class="student-content">
                <div class="student-detail">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">${student.age} years</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Grade:</span>
                    <span class="detail-value grade-${student.grade.replace('+', '-plus')}">${student.grade}</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${student.email}</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${student.phone}</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Course:</span>
                    <span class="detail-value">${student.course}</span>
                </div>
                <div class="student-actions">
                    <button class="btn-edit" onclick="openEditModal(${student.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add new student
studentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        rollNumber: document.getElementById('rollNumber').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: document.getElementById('course').value
    };

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            alert('Student added successfully!');
            studentForm.reset();
            loadStudents();
            loadStatistics();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding student. Please try again.');
    }
});

// Open edit modal
async function openEditModal(studentId) {
    try {
        const response = await fetch(`${API_BASE}/${studentId}`);
        const result = await response.json();

        if (result.success) {
            const student = result.data;
            document.getElementById('editId').value = student.id;
            document.getElementById('editName').value = student.name;
            document.getElementById('editRollNumber').value = student.rollNumber;
            document.getElementById('editAge').value = student.age;
            document.getElementById('editGrade').value = student.grade;
            document.getElementById('editEmail').value = student.email;
            document.getElementById('editPhone').value = student.phone;
            document.getElementById('editCourse').value = student.course;
            
            editModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading student:', error);
        alert('Error loading student data.');
    }
}

// Update student
editForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('editId').value;
    const formData = {
        name: document.getElementById('editName').value,
        age: parseInt(document.getElementById('editAge').value),
        grade: document.getElementById('editGrade').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        course: document.getElementById('editCourse').value
    };

    try {
        const response = await fetch(`${API_BASE}/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            alert('Student updated successfully!');
            editModal.style.display = 'none';
            loadStudents();
            loadStatistics();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating student. Please try again.');
    }
});

// Delete student
async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/${studentId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            alert('Student deleted successfully!');
            loadStudents();
            loadStatistics();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting student. Please try again.');
    }
}

// Clear filters
function clearFilters() {
    document.getElementById('search').value = '';
    document.getElementById('filterCourse').value = '';
    document.getElementById('filterGrade').value = '';
    loadStudents();
}

// Modal close functionality
document.querySelector('.close').addEventListener('click', function() {
    editModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Real-time search
let searchTimeout;
document.getElementById('search').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadStudents, 500);
});

// Loading states
function showLoading() {
    loading.style.display = 'block';
    studentsList.style.display = 'none';
    noStudents.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    studentsList.innerHTML = `<div class="error">${message}</div>`;
}