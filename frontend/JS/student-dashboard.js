document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html"; // Redirect to login if no token is found
        return;
    }

    // Set student profile details
    function setProfile() {
        if (user) {
            document.getElementById("student-name").textContent = user.firstName || "Student";
            document.getElementById("profile-name").textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById("profile-pic").src = user.profilePicture 
                ? `http://localhost:5000${user.profilePicture}` 
                : "../img/user.jpg";
        }
    }
    
    setProfile();
    loadDashboardStats();
    loadStudentCourses();
    loadAnnouncements();
});

// Load Dashboard Stats (Courses, Assignments, Tests, Announcements)
async function loadDashboardStats() {
    try {
        const response = await fetch("http://localhost:5000/api/student/metrics", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();

        document.getElementById("total-courses").textContent = data.totalCourses || 0;
        document.getElementById("upcoming-assignments").textContent = data.upcomingAssignments || 0;
        document.getElementById("upcoming-tests").textContent = data.upcomingTests || 0;
        document.getElementById("unread-announcements").textContent = data.unreadAnnouncements || 0;
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
    }
}

// Load Student's Enrolled Courses
async function loadStudentCourses() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html"; // Redirect to login
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/users/student/courses", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        const coursesContainer = document.getElementById("courses-container");

        if (response.ok) {
            coursesContainer.innerHTML = "";
            data.courses.forEach((course) => {
                coursesContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="card p-3">
                            <h5>${course.name}</h5>
                            <p>${course.description}</p>
                            <button class="btn btn-primary enter-classroom" data-course-id="${course._id}">
                                <i class="fas fa-door-open"></i> Go to Classroom
                            </button>
                        </div>
                    </div>
                `;
            });

            // Add event listener for "Go to Classroom" buttons
            document.querySelectorAll(".enter-classroom").forEach(button => {
                button.addEventListener("click", function () {
                    const courseId = this.getAttribute("data-course-id");
                    window.location.href = `student-course-dashboard.html?courseId=${courseId}`;
                });
            });

        } else {
            coursesContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
        }
    } catch (error) {
        console.error("Error loading courses:", error);
    }
}


// Load Announcements
async function loadAnnouncements() {
    try {
        const response = await fetch("http://localhost:5000/api/student/announcements", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        const announcementsList = document.getElementById("announcements-list");

        announcementsList.innerHTML = "";
        if (response.ok && data.announcements.length > 0) {
            data.announcements.forEach(announcement => {
                announcementsList.innerHTML += `
                    <li class="list-group-item">
                        <h6>${announcement.title}</h6>
                        <p>${announcement.message}</p>
                        <small class="text-muted">${new Date(announcement.date).toLocaleString()}</small>
                    </li>
                `;
            });
        } else {
            announcementsList.innerHTML = `<p class="text-muted">No announcements available.</p>`;
        }
    } catch (error) {
        console.error("Error fetching announcements:", error);
    }
}

// Logout Function
document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
});



// document.addEventListener("DOMContentLoaded", async function () {
//     loadStudentProfile();
//     loadStudentCourses();

//     // Logout functionality
//     document.getElementById("logout").addEventListener("click", function (event) {
//         event.preventDefault();
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         window.location.href = "index.html"; // Redirect to login page
//     });
// });

// // Load Student Profile
// function loadStudentProfile() {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user) {
//         document.getElementById("profile-name").textContent = `${user.firstName} ${user.lastName}`;
//         document.getElementById("profile-pic").src = user.profilePicture || "https://randomuser.me/api/portraits/men/85.jpg";
//     }
// }

// // Load Enrolled Courses
// async function loadStudentCourses() {
//     const token = localStorage.getItem("token");
//     if (!token) {
//         window.location.href = "index.html"; // Redirect to login
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:5000/api/users/student/courses", {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await response.json();
//         const coursesContainer = document.getElementById("courses-container");

//         if (response.ok) {
//             coursesContainer.innerHTML = "";
//             data.courses.forEach((course) => {
//                 coursesContainer.innerHTML += `
//                     <div class="col-md-4">
//                         <div class="card p-3">
//                             <h5>${course.name}</h5>
                           
//                             <button class="btn btn-primary enter-classroom" data-course-id="${course._id}">
//                                 <i class="fas fa-door-open"></i> Go to Classroom
//                             </button>
//                         </div>
//                     </div>
//                 `;
//             });

//             // Add event listener for "Go to Classroom" buttons
//             document.querySelectorAll(".enter-classroom").forEach(button => {
//                 button.addEventListener("click", function () {
//                     const courseId = this.getAttribute("data-course-id");
//                     window.location.href = `student-course-dashboard.html?courseId=${courseId}`;
//                 });
//             });

//         } else {
//             coursesContainer.innerHTML = `<p class="text-danger">${data.message}</p>`;
//         }
//     } catch (error) {
//         console.error("Error loading courses:", error);
//     }
// }
