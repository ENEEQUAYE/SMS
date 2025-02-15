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
                // ✅ Ensure absolute URL
                const profilePicUrl = user.profilePicture 
                    ? `http://localhost:5000${user.profilePicture}` 
                    : "https://randomuser.me/api/portraits/men/85.jpg";
        
                document.querySelector(".profile img").src = profilePicUrl;
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

    document.addEventListener("DOMContentLoaded", () => {
        loadDashboardMetrics();
    });
    
    // Load Dashboard Metrics
    function loadDashboardMetrics() {
        fetch("http://localhost:5000/api/lecturer/metrics", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("total-courses").textContent = data.totalCourses || 0;
                document.getElementById("total-students").textContent = data.totalStudents || 0;
                document.getElementById("pending-assignments").textContent = data.pendingAssignments || 0;
            })
            .catch(error => console.error("Error fetching metrics:", error));
    }

    document.addEventListener("DOMContentLoaded", async () => {
        loadLecturerCourses();
    });
    
    async function loadLecturerCourses() {
        const token = localStorage.getItem("token");
    
        const response = await fetch("http://localhost:5000/api/users/lecturer/courses", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
    
        const data = await response.json();
        const coursesContainer = document.getElementById("courses-container");
    
        if (response.ok) {
            coursesContainer.innerHTML = "";
            data.courses.forEach((course) => {
                coursesContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="card p-3 mb-3">
                            <h5>${course.name} (${course.code})</h5>
                            <p>${course.description || "No description available."}</p>
                            <button class="btn btn-primary view-course" data-id="${course._id}">View Course</button>
                        </div>
                    </div>
                `;
            });
    
            // Attach event listeners to the "View Course" buttons
            document.querySelectorAll(".view-course").forEach(button => {
                button.addEventListener("click", function () {
                    const courseId = this.dataset.id;
                    localStorage.setItem("selectedCourseId", courseId);
                    window.location.href = "lecturer-course-dashboard.html";
                });
            });
    
        } else {
            coursesContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
        }
    }
    
    // Load courses when the page loads
    document.addEventListener("DOMContentLoaded", () => {
        loadLecturerCourses();
    });
    
    
    document.addEventListener("DOMContentLoaded", async () => {
        loadLecturerCourses();
        loadEnrolledStudents();
    });
    
    async function loadEnrolledStudents() {
        const token = localStorage.getItem("token");
    
        const response = await fetch("http://localhost:5000/api/users/lecturer/students", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
    
        const data = await response.json();
        const studentsContainer = document.getElementById("lecturer-students");
    
        if (response.ok) {
            studentsContainer.innerHTML = "";
            data.students.forEach((student, index) => {
                studentsContainer.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.firstName} ${student.lastName}</td>
                        <td>${student.email}</td>
                        <td>${student.coursesEnrolled.map(c => c.courseId.name).join(", ")}</td>
                    </tr>
                `;
            });
        } else {
            studentsContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
        }
    }
    

    // document.addEventListener("DOMContentLoaded", () => {
    //     loadLecturerCourses();
    // });
    
    // async function loadLecturerCourses() {
    //     const token = localStorage.getItem("token");
    
    //     try {
    //         const response = await fetch("http://localhost:5000/api/users/lecturer/courses", {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    
    //         const data = await response.json();
    //         const coursesContainer = document.getElementById("lecturer-courses");
    
    //         if (response.ok) {
    //             coursesContainer.innerHTML = "";
    //             data.courses.forEach((course) => {
    //                 coursesContainer.innerHTML += `
    //                     <div class="col-md-4">
    //                         <div class="card p-3 mb-3">
    //                             <h5>${course.name} (${course.code})</h5>
    //                             <p><strong>Department:</strong> ${course.department || "N/A"}</p>
    //                             <p><strong>Students Enrolled:</strong> ${course.students.length}</p>
    //                         </div>
    //                     </div>
    //                 `;
    //             });
    //         } else {
    //             coursesContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
    //         }
    //     } catch (error) {
    //         console.error("Error loading courses:", error);
    //     }
    // }
    