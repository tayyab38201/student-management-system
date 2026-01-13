📘 Student Management System

A simple Student Management API built with Node.js & Express that allows you to perform basic CRUD operations on student records stored in a JSON file. Perfect for learning backend basics.
<img width="1055" height="616" alt="1" src="https://github.com/user-attachments/assets/0b02f23d-322c-4c0e-afd0-623607258bb6" />
<img width="995" height="620" alt="2" src="https://github.com/user-attachments/assets/a278ac66-f6f1-49a2-a40f-b336c174097f" />

🚀 Features

✔ Create new student records
✔ View all students
✔ View a single student by ID
✔ Update student info
✔ Delete student records
✔ Data stored in students.json (no database required)

🛠️ Tech Stack

Node.js

Express

JSON file for storage

📥 Installation

Clone this repo

git clone https://github.com/tayyab38201/student-management-system.git


Go into project

cd student-management-system


Install dependencies

npm install


Run app

node server.js


Server will start on http://localhost:3000
 (by default).

<img width="644" height="597" alt="3" src="https://github.com/user-attachments/assets/8ad57331-9fea-4dfe-a664-8071510ad042" />
<img width="598" height="601" alt="4" src="https://github.com/user-attachments/assets/8fea059e-8e13-46f4-b94d-ee0d64756ff4" />

📡 API Endpoints

✅ Get all students
GET /students

✅ Get student by ID
GET /students/:id

✅ Create new student
POST /students


Body

{
  "name": "John Doe",
  "age": 20,
  "class": "BSCS"
}

✅ Update student
PUT /students/:id


Body (same format as above)

✅ Delete student
DELETE /students/:id

📌 Notes

Data is stored in students.json — no database needed

Basic project for learning Express + file I/O

📞 Contact

Made by Tayyab – practice project 🧠
GitHub: https://github.com/tayyab38201
