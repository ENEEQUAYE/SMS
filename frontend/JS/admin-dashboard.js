//CESSTIG/FRONTEND/JS/admin-dashboard.js

// Initiate the sidebar and content switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Sidebar toggle
    sidebarCollapse.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Menu switching
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('data-target'));

            // Switch content sections
            contentSections.forEach(section => section.classList.add('d-none'));
            navLinks.forEach(nav => nav.classList.remove('active'));
            if (target) target.classList.remove('d-none');
            link.classList.add('active');

            // Auto-collapse sidebar on smaller screens
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
// Date and Time (Date format is DD/MM/YYYY and time format is HH:MM:SS AM/PM) something like Thursday, 25th March 2021 12:00:00 PM, the seconds shouls be updating every second
function updateTime() {
    let date = new Date();
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    document.getElementById('current-date').textContent = date.toLocaleDateString('en-US', options);
    document.getElementById('current-time').textContent = date.toLocaleTimeString('en-US', timeOptions);
}
updateTime();
setInterval(updateTime, 1000);
});

// Function to fetch admin profile
document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html"; // Redirect to login
        return;
    }

    function setProfile() {
        if (user) {
            document.querySelector(".profile img").src = user.profilePicture || "https://randomuser.me/api/portraits/men/85.jpg";
            document.querySelector(".profile span").textContent = user.firstName || "Admin";
        }

}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

document.getElementById("logout").addEventListener("click", logout);
setProfile();
});


////////////////////////////////////////////////// Function to fetch and display courses////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html"; // Redirect to login if not authenticated
        return;
    }

    const courseForm = document.getElementById("course-form");
    const courseNameInput = document.getElementById("course-name");
    const courseCodeInput = document.getElementById("course-code");
    const courseDescriptionTextArea = document.getElementById("course-description");
    const coursesTableBody = document.getElementById("courses-table-body");
    const searchInput = document.getElementById("search-courses");

    // Fetch and display courses
    async function fetchCourses() {
        try {
            const response = await fetch("http://localhost:5000/api/courses/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const courses = await response.json();
            displayCourses(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    }

    function displayCourses(courses) {
        coursesTableBody.innerHTML = ""; // Clear table before inserting new data
        courses.forEach((course, index) => {
            const row = `<tr>
                <td>${index + 1}</td>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.description}</td>
                <td>${new Date(course.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-course" data-id="${course._id}" data-name="${course.name}" data-code="${course.code}"><i class="fas fa-edit"></i>Edit</button>
                    <button class="btn btn-danger btn-sm delete-course" data-id="${course._id}"><i class="fas fa-trash"></i>Delete</button>
                </td>
            </tr>`;
            coursesTableBody.innerHTML += row;
        });

        // Attach event listeners for edit and delete buttons
        document.querySelectorAll(".edit-course").forEach(button => {
            button.addEventListener("click", function () {
                editCourse(this.dataset.id, this.dataset.name, this.dataset.code);
            });
        });

        document.querySelectorAll(".delete-course").forEach(button => {
            button.addEventListener("click", function () {
                deleteCourse(this.dataset.id);
            });
        });
    }

    // Add a new course
    courseForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const courseData = {
            name: courseNameInput.value,
            code: courseCodeInput.value,
            description: courseDescriptionTextArea.value,
        };

        try {
            const response = await fetch("http://localhost:5000/api/courses/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(courseData),
            });

            if (!response.ok) throw new Error("Failed to add course");

            $("#addCourseModal").modal("hide");
            courseForm.reset();
            fetchCourses(); // Refresh list
        } catch (error) {
            console.error("Error adding course:", error);
        }
    });

    // Edit course (pre-fill the modal)
    function editCourse(courseId, courseName, courseCode, courseDescription) {
        courseNameInput.value = courseName;
        courseCodeInput.value = courseCode;
        courseDescriptionTextArea.value = courseDescription;  // Set description if available
        $("#addCourseModal").modal("show");

        courseForm.onsubmit = async function (event) {
            event.preventDefault();
            try {
                const response = await fetch(`http://localhost:5000/api/courses/edit/${courseId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: courseNameInput.value, code: courseCodeInput.value, description: courseDescriptionTextArea.value }),
                });

                if (!response.ok) throw new Error("Failed to update course");

                $("#addCourseModal").modal("hide");
                courseForm.reset();
                fetchCourses();
            } catch (error) {
                console.error("Error updating course:", error);
            }
        };
    }

    // Delete course
    async function deleteCourse(courseId) {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/courses/delete/${courseId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Failed to delete course");

            fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    }

    // Search courses
    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll("#courses-table-body tr").forEach(row => {
            const courseName = row.cells[2].textContent.toLowerCase();
            const courseCode = row.cells[1].textContent.toLowerCase();
            row.style.display = (courseName.includes(searchTerm) || courseCode.includes(searchTerm)) ? "" : "none";
        });
    });

    fetchCourses(); // Initial fetch
});

document.addEventListener("DOMContentLoaded", () => {
    loadLecturers();
    loadCourses();
});

// Function to Load Lecturers
function loadLecturers() {
    fetch("http://localhost:5000/api/users/lecturers")
        .then(response => response.json())
        .then(lecturers => {
            const lecturersTable = document.getElementById("lecturers-table");
            lecturersTable.innerHTML = ""; // Clear table before adding data

            lecturers.forEach((lecturer, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${lecturer.lecturerId}</td>
                        <td>${lecturer.firstName} ${lecturer.lastName}</td>
                        <td>${lecturer.email}</td>
                        <td>${lecturer.contactNumber || "N/A"}</td>
                        <td>${lecturer.department || "N/A"}</td>
                        <td>${lecturer.courses.map(course => course.name).join(", ") || "N/A"}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-lecturer" 
                                data-id="${lecturer._id}" 
                                data-firstname="${lecturer.firstName}" 
                                data-lastname="${lecturer.lastName}" 
                                data-email="${lecturer.email}" 
                                data-phone="${lecturer.contactNumber}" 
                                data-course="${lecturer.courses.length > 0 ? lecturer.courses[0]._id : ''}"
                                data-department="${lecturer.department}">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteLecturer('${lecturer._id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `;
                lecturersTable.innerHTML += row;
            });

            // Attach event listeners for Edit buttons
            document.querySelectorAll(".edit-lecturer").forEach(button => {
                button.addEventListener("click", function () {
                    editLecturer(
                        this.dataset.id,
                        this.dataset.firstname,
                        this.dataset.lastname,
                        this.dataset.email,
                        this.dataset.phone,
                        this.dataset.course,
                        this.dataset.department
                    );
                });
            });
        })
        .catch(error => console.error("Error loading lecturers:", error));
}

// Function to Load Courses
function loadCourses() {
    fetch("http://localhost:5000/api/courses")
        .then(response => response.json())
        .then(courses => {
            const courseDropdown = document.getElementById("course");
            courseDropdown.innerHTML = '<option value="" selected disabled>Select Course</option>';
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course._id;
                option.textContent = course.name;
                courseDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading courses:", error));
}

// Function to Handle Add/Edit Lecturer
document.getElementById("lecturer-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const lecturerId = document.getElementById("lecturer-id").value; // Check if it's an edit
    const firstName = document.getElementById("lecturer-first-name").value;
    const lastName = document.getElementById("lecturer-last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const department = document.getElementById("department").value;
    const course = document.getElementById("course").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!lecturerId && (password !== confirmPassword)) {
        alert("Passwords do not match!");
        return;
    }

    const lecturerData = {
        firstName,
        lastName,
        email,
        contactNumber: phone,
        department,
        courses: [course]
    };

    if (!lecturerId) {
        // Only include password for new lecturer
        lecturerData.password = password;
    }

    try {
        let response;
        if (lecturerId) {
            // Update Lecturer
            response = await fetch(`http://localhost:5000/api/users/edit-lecturer/${lecturerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lecturerData),
            });
        } else {
            // Add New Lecturer
            response = await fetch("http://localhost:5000/api/users/add-lecturer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lecturerData),
            });
        }

        if (response.ok) {
            alert(lecturerId ? "Lecturer updated successfully" : "Lecturer added successfully");
            new bootstrap.Modal(document.getElementById("addLecturerModal")).hide(); // Close Modal
            loadLecturers(); // Refresh List
            document.getElementById("lecturer-form").reset();
            document.getElementById("lecturer-id").value = ""; // Reset edit mode
        } else {
            alert("Failed to save lecturer");
        }
    } catch (error) {
        console.error("Error saving lecturer:", error);
    }
});

// Function to Edit Lecturer
function editLecturer(lecturerId, firstName, lastName, email, phone, course, department) {
    document.getElementById("lecturer-id").value = lecturerId;
    document.getElementById("lecturer-first-name").value = firstName;
    document.getElementById("lecturer-last-name").value = lastName;
    document.getElementById("email").value = email;
    document.getElementById("phone").value = phone;
    document.getElementById("department").value = department;
    document.getElementById("course").value = course;

    // Hide Password Fields for Editing
    document.getElementById("password-section").style.display = "none";

    // Show Modal
    new bootstrap.Modal(document.getElementById("addLecturerModal")).show();
}

// Function to Delete Lecturer
function deleteLecturer(lecturerId) {
    if (!confirm("Are you sure you want to delete this lecturer?")) return;

    fetch(`http://localhost:5000/api/users/delete-lecturer/${lecturerId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadLecturers(); // Refresh table
        })
        .catch(error => console.error("Error deleting lecturer:", error));
}

// Load Courses Initially
loadCourses();





////////////////////////////////////////////////Manage Users///////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});

// Function to load users
function loadUsers() {
    fetch("http://localhost:5000/api/users/all")
        .then(response => response.json())
        .then(users => {
            const usersTable = document.getElementById("users-table-body");
            usersTable.innerHTML = ""; // Clear table before adding data

            users.forEach((user, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.firstName} ${user.lastName}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.contactNumber || "N/A"}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                        </td>
                    </tr>
                `;
                usersTable.innerHTML += row;
            });
        })
        .catch(error => console.error("Error loading users:", error));
}

document.getElementById("search-user").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll("#users-table-body tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();

        if (name.includes(searchValue) || email.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    fetch(`http://localhost:5000/api/users/delete/${userId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadUsers(); // Refresh table
        })
        .catch(error => console.error("Error deleting user:", error));
}
loadUsers(); // Load users on page load

///////////////////////////////////////////Manage Students///////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    loadStudents();
    loadCourses();
});

// Function to load students
function loadStudents() {
    fetch("http://localhost:5000/api/users/students")
        .then(response => response.json())
        .then(students => {
            const studentsTable = document.getElementById("students-table-body");
            studentsTable.innerHTML = ""; // Clear table before adding new data

            students.forEach((student, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${student.studentID}</td>
                        <td>${student.courses.map(course => course.name).join(", ") || "N/A"}</td>
                        <td>${new Date(student.enrollmentDate).toLocaleDateString()}</td>
                        <td>${student.contactNumber || "N/A"}</td>
                        <td>
                            <button class="btn btn-primary" onclick="editStudent(${student.studentID})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
                        </td>
                    </tr>
                `;
                studentsTable.innerHTML += row;
            });
        })
        .catch(error => console.error("Error loading students:", error));
}

document.getElementById("search-students").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const rows = document.querySelectorAll("#students-table-body tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const studentID = row.cells[2].textContent.toLowerCase();
        const course = row.cells[3].textContent.toLowerCase();

        if (name.includes(searchValue) || studentID.includes(searchValue) || course.includes(searchValue)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});


document.getElementById("student-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const studentData = {
        firstName: document.getElementById("student-first-name").value,
        lastName: document.getElementById("student-last-name").value,
        studentID: document.getElementById("student-id").value,
        course: document.getElementById("course-enrolled").value,
        email: document.getElementById("email").value,
        contact: document.getElementById("phone").value,
        dateOfBirth: document.getElementById("date-of-birth").value,
        gender: document.getElementById("gender").value,
        country: document.getElementById("country").value,
        state: document.getElementById("state").value,
        highestEducation: document.getElementById("highest-education").value,
        emergencyContact: document.getElementById("emergency-contact").value,
        password: document.getElementById("password").value
    };

    fetch("http://localhost:5000/api/users/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadStudents(); // Refresh student list
        document.getElementById("student-form").reset();
        new bootstrap.Modal(document.getElementById("addStudentModal")).hide();
    })
    .catch(error => console.error("Error adding student:", error));
});

function deleteStudent(studentId) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    fetch(`http://localhost:5000/api/users/delete-student/${studentId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadStudents(); // Refresh student list
        })
        .catch(error => console.error("Error deleting student:", error));
}



