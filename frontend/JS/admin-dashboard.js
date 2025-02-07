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


/////////////////////////////////////////////////////////////Manage Lecturer Functionalities////////////////////////////////////////////
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
                    openEditModal(
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
function loadLecturerCourses() {
    fetch("http://localhost:5000/api/courses")
        .then(response => response.json())
        .then(courses => {
            // Populate Add Lecturer Modal Dropdown
            const courseDropdown = document.getElementById("course");
            courseDropdown.innerHTML = '<option value="" selected disabled>Select Course</option>';
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course._id;
                option.textContent = course.name;
                courseDropdown.appendChild(option);
            });

            // Populate Edit Lecturer Modal Dropdown
            const editCourseDropdown = document.getElementById("edit-course");
            editCourseDropdown.innerHTML = '<option value="" selected disabled>Select Course</option>';
            courses.forEach(course => {
                const option = document.createElement("option");
                option.value = course._id;
                option.textContent = course.name;
                editCourseDropdown.appendChild(option);
            });

        })
        .catch(error => console.error("Error loading courses:", error));
}
// Function to Handle Adding a Lecturer
document.getElementById("add-lecturer-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("lecturer-first-name").value;
    const lastName = document.getElementById("lecturer-last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const department = document.getElementById("department").value;
    const course = document.getElementById("course").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const lecturerData = {
        firstName,
        lastName,
        email,
        contactNumber: phone,
        department,
        courses: [course],
        password
    };

    try {
        const response = await fetch("http://localhost:5000/api/users/add-lecturer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lecturerData),
        });

        if (response.ok) {
            alert("Lecturer added successfully");
            new bootstrap.Modal(document.getElementById("addLecturerModal")).hide();
            loadLecturers();
            document.getElementById("add-lecturer-form").reset();
        } else {
            alert("Failed to add lecturer");
        }
    } catch (error) {
        console.error("Error adding lecturer:", error);
    }
});

// Function to Open Edit Lecturer Modal
function openEditModal(id, firstName, lastName, email, phone, course, department) {
    document.getElementById("edit-lecturer-id").value = id;
    document.getElementById("edit-lecturer-first-name").value = firstName;
    document.getElementById("edit-lecturer-last-name").value = lastName;
    document.getElementById("edit-email").value = email;
    document.getElementById("edit-phone").value = phone;
    document.getElementById("edit-department").value = department;
    document.getElementById("edit-course").value = course;

    new bootstrap.Modal(document.getElementById("editLecturerModal")).show();
}

// Function to Handle Editing a Lecturer
document.getElementById("edit-lecturer-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const lecturerId = document.getElementById("edit-lecturer-id").value;
    const firstName = document.getElementById("edit-lecturer-first-name").value;
    const lastName = document.getElementById("edit-lecturer-last-name").value;
    const email = document.getElementById("edit-email").value;
    const phone = document.getElementById("edit-phone").value;
    const department = document.getElementById("edit-department").value;
    const course = document.getElementById("edit-course").value;

    const updatedLecturerData = {
        firstName,
        lastName,
        email,
        contactNumber: phone,
        department,
        courses: [course]
    };

    try {
        const response = await fetch(`http://localhost:5000/api/users/edit-lecturer/${lecturerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedLecturerData),
        });

        if (response.ok) {
            alert("Lecturer updated successfully");
            new bootstrap.Modal(document.getElementById("editLecturerModal")).hide();
            loadLecturers();
        } else {
            alert("Failed to update lecturer");
        }
    } catch (error) {
        console.error("Error updating lecturer:", error);
    }
});

// Function to Delete Lecturer
function deleteLecturer(lecturerId) {
    if (!confirm("Are you sure you want to delete this lecturer?")) return;

    fetch(`http://localhost:5000/api/users/delete-lecturer/${lecturerId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadLecturers();
        })
        .catch(error => console.error("Error deleting lecturer:", error));
}

// Function to Search Lecturers
document.getElementById("search-lecturers").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll("#lecturers-table tr").forEach(row => {
        const name = row.cells[2].textContent.toLowerCase();
        row.style.display = name.includes(searchValue) ? "" : "none";
    });
});

// Load Courses Initially
loadLecturerCourses();





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

// Load students from backend
function loadStudents() {
    fetch("http://localhost:5000/api/users/students")
        .then(response => response.json())
        .then(students => {
            const studentsTable = document.getElementById("students-table-body");
            studentsTable.innerHTML = ""; // Clear table before adding data

            students.forEach((student, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.studentId}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${student.email}</td>
                        <td>${student.coursesEnrolled.map(course => course.courseId.name).join(", ") || "N/A"}</td>
                        <td>${new Date(student.enrollmentDate).toLocaleDateString()}</td>
                        <td>${student.contactNumber}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-student" data-id="${student._id}" data-name="${student.firstName} ${student.lastName}" data-email="${student.email}" data-phone="${student.contactNumber}" data-course="${student.coursesEnrolled.map(course => course.courseId._id)}"><i class="fas fa-edit"></i>Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')"><i class="fas fa-trash"></i>Delete</button>
                        </td>
                    </tr>
                `;
                studentsTable.innerHTML += row;
            });

            // Attach event listeners to Edit buttons
            document.querySelectorAll(".edit-student").forEach(button => {
                button.addEventListener("click", function () {
                    editStudent(this.dataset.id, this.dataset.name, this.dataset.email, this.dataset.phone, this.dataset.course);
                });
            });
        })
        .catch(error => console.error("Error loading students:", error));
}
// Load courses from backend
function loadCourses() {
    fetch("http://localhost:5000/api/courses")
    .then(response => response.json())
    .then(courses => {
        const coursesSelect = document.getElementById("student-course");
        coursesSelect.innerHTML = '<option value="" selected disabled>Select Course</option>';
        courses.forEach(course => {
            const option = `<option value="${course._id}">${course.name}</option>`;
            coursesSelect.innerHTML += option;
        }
    );
    })
    .catch(error => console.error("Error loading courses:", error));
}

// Function to add a new student
document.getElementById("add-student-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const studentData = {
        firstName: document.getElementById("student-first-name").value,
        lastName: document.getElementById("student-last-name").value,
        email: document.getElementById("student-email").value,
        password: document.getElementById("student-password").value,
        contactNumber: document.getElementById("student-phone").value,
        dateOfBirth: document.getElementById("student-dob").value,
        gender: document.getElementById("student-gender").value,
        highestEducation: document.getElementById("highest-education").value,
        address: document.getElementById("student-address").value,
        emergencyContact: {
            name: document.getElementById("emergency-contact-name").value,
            phone: document.getElementById("emergency-contact-phone").value,
        },
        coursesEnrolled: [{ courseId: document.getElementById("student-course").value }]
    };

    fetch("http://localhost:5000/api/users/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadStudents();
        bootstrap.Modal.getInstance(document.getElementById("addStudentModal")).hide();
    })
    .catch(error => console.error("Error adding student:", error));
});

// Function to delete student
function deleteStudent(studentId) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    fetch(`http://localhost:5000/api/users/delete-student/${studentId}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadStudents();
        })
        .catch(error => console.error("Error deleting student:", error));
}



