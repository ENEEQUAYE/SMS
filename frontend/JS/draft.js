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

    // Mock Data
    const students = 120;
    const lecturers = 15;
    const enrollments = 80;
    const events = 3;

    // const courses = [
    //     { id: 1, name: 'Sterile Processing', description: 'Basic and advanced sterile techniques.', duration: '6 months'},
    //     { id: 2, name: 'Surgical Technologist', description: 'Comprehensive surgical training.', duration: '8 months'}
    // ];

    const activities = [
        'New student enrolled: John Doe',
        'Course updated: Surgical Technologist',
        'Event created: Annual Career Day'
    ];

    // Populate Stats
    document.getElementById('total-students').textContent = students;
    document.getElementById('total-lecturers').textContent = lecturers;
    document.getElementById('current-enrollments').textContent = enrollments;
    document.getElementById('upcoming-events').textContent = events;

    // Populate Courses
    const courseOverview = document.getElementById('course-overview');
    courses.forEach((course, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${course.name}</td>
            <td>${course.description}</td>
            <td>${course.duration}</td>
            <td>${course.status}</td>
        `;
        courseOverview.appendChild(row);
    });

    // Populate Activities
    const recentActivities = document.getElementById('recent-activities');
    activities.forEach(activity => {
        const item = document.createElement('li');
        item.classList.add('list-group-item');
        item.textContent = activity;
        recentActivities.appendChild(item);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const profilePicInput = document.getElementById('upload-pic');
    const profilePic = document.getElementById('profile-pic');

    // Handle Profile Picture Upload
    profilePicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Profile Form Submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        // Mock save logic
        alert(`Profile updated successfully! 
Full Name: ${fullName}
Email: ${email}
Phone: ${phone}
Password: ${password ? 'Updated' : 'Unchanged'}`);
    });
});


// Dummy data for demonstration
let courses = [
    { id: 1, name: "Sterile Processing", code: "SP101", description: "Introduction to sterile processing." },
    { id: 2, name: "Surgical Technology", code: "ST202", description: "Comprehensive surgical technology course." },
];

// Load courses into the table
function loadCourses() {
    const tableBody = document.getElementById("courses-table-body");
    tableBody.innerHTML = "";

    courses.forEach((course, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${course.name}</td>
                <td>${course.code}</td>
                <td>${course.description}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-2 edit-course" data-id="${course.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-course" data-id="${course.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

// Handle course form submission
document.getElementById("course-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("course-name").value;
    const code = document.getElementById("course-code").value;
    const description = document.getElementById("course-description").value;

    courses.push({ id: Date.now(), name, code, description });
    loadCourses();
    document.querySelector("#addCourseModal .btn-close").click();
});

// Initial load
loadCourses();


