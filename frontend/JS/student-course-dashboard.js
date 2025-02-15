document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle for Chapters Dropdown
    document.getElementById("chapters-toggle").addEventListener("click", function (event) {
        event.preventDefault();
        document.getElementById("chapters-menu").classList.toggle("active");
    });

    // Navigation switching
    document.querySelectorAll(".nav-link, .dropdown-item").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            // Get target section
            const targetId = this.getAttribute("data-target");
            if (!targetId) return;

            // Hide all sections
            document.querySelectorAll(".content-section").forEach(section => section.classList.add("d-none"));

            // Show the selected section
            document.getElementById(targetId).classList.remove("d-none");

            // Active link styling
            document.querySelectorAll(".nav-link, .dropdown-item").forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            // Auto-collapse sidebar on smaller screens
            if (window.innerWidth <= 768) {
                document.getElementById("sidebar").classList.remove("active");
            }
        });
    });

    // Ensure default section (Dashboard) is visible on load
    document.getElementById("dashboard").classList.remove("d-none");
});

const sidebarCollapse = document.getElementById('sidebarCollapse');
sidebarCollapse.addEventListener('click', () => {
    sidebar.classList.toggle('active');
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
            document.querySelector(".profile span").textContent = user.firstName || "Student";
        }
    }
    

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "index.html";
    }

    document.querySelector("#logout").addEventListener("click", logout);
    setProfile();   
});

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
});

// Load User Profile from Backend or Local Storage

function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getUTCDate()).padStart(2, '0'); // Get day (zero-padded)
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getUTCFullYear(); // Get full year
    return `${day}/${month}/${year}`;
}

function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    const profilePicUrl = user.profilePicture 
                ? `http://localhost:5000${user.profilePicture}` 
                : "https://randomuser.me/api/portraits/men/85.jpg";

    if (!user || !token) {
        window.location.href = "index.html"; // Redirect to login if no user found
        return;
    }

    // Populate profile section
    document.getElementById("profile-pic").src = profilePicUrl;
    document.getElementById("profile-name").textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("profile-email").innerHTML = `${user.email}`;
    document.getElementById("profile-phone").innerHTML = `${user.contactNumber}`;
    document.getElementById("profile-dob").innerHTML = `${formatDate(user.dateOfBirth)}`; 
    document.getElementById("profile-gender").innerHTML = `${user.gender}`;
    document.getElementById("profile-education").innerHTML = `${user.highestEducation}`;
}

// Handle Profile Picture Upload
document.getElementById("upload-pic").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append("profilePicture", file);

        fetch("http://localhost:5000/api/users/upload-profile-pic", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.profilePicture) {
                // ✅ Update the profile picture immediately
                const newProfilePicUrl = `http://localhost:5000${data.profilePicture}`;
                document.getElementById("profile-pic").src = newProfilePicUrl;

                // ✅ Update localStorage with the new image
                let user = JSON.parse(localStorage.getItem("user"));
                user.profilePicture = data.profilePicture; 
                localStorage.setItem("user", JSON.stringify(user));

                alert("Profile picture updated successfully!");

                // ✅ Force refresh of the image (By appending a timestamp)
                document.getElementById("profile-pic").src = newProfilePicUrl + `?timestamp=${new Date().getTime()}`;
            }
        })
        .catch(error => console.error("Error uploading profile picture:", error));
    }
});