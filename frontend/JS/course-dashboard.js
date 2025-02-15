document.addEventListener("DOMContentLoaded", async () => {
    const courseId = localStorage.getItem("selectedCourseId");
    if (!courseId) {
        alert("No course selected!");
        window.location.href = "lecturer-dashboard.html";
        return;
    }

    const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById("course-title").textContent = data.name;
        document.getElementById("course-description").textContent = data.description;
        document.getElementById("total-chapters").textContent = data.totalChapters;
        document.getElementById("enrolled-students").textContent = data.enrolledStudents.length;
    } else {
        alert("Error loading course details.");
        window.location.href = "lecturer-dashboard.html";
    }

    // ✅ Handle Navigation Tab Switching
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            // Remove active class from all tabs
            document.querySelectorAll(".nav-link").forEach(nav => nav.classList.remove("active"));
            this.classList.add("active");

            // Hide all sections
            document.querySelectorAll(".content-section").forEach(section => section.classList.add("d-none"));

            // Show the selected section
            const targetId = this.getAttribute("data-target");
            document.querySelector(targetId).classList.remove("d-none");
        });
    });
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

    setProfile();
    document.querySelector(".logout").addEventListener("click", logout);
});

document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile();
});

// Load User Profile from Backend or Local Storage
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        window.location.href = "index.html"; // Redirect to login if no user found
        return;
    }

    // Populate profile section
    document.getElementById("profile-pic").src = user.profilePic || "img/user.jpg";
    document.getElementById("profile-name").textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById("profile-email").innerHTML = `<i class="fas fa-envelope"></i>Email: ${user.email}`;
    document.getElementById("profile-phone").innerHTML = `<i class="fas fa-phone"></i>Phone: ${user.contactNumber}`;
    document.getElementById("profile-address").innerHTML = `<i class="fas fa-map-marker-alt"></i>Address: ${user.address}`;
    document.getElementById("profile-dob").innerHTML = `<i class="fas fa-calendar"></i>Date of Birth: ${user.dateOfBirth}`;
    document.getElementById("profile-gender").innerHTML = `<i class="fas fa-venus-mars"></i>Gender: ${user.gender}`;
    document.getElementById("profile-education").innerHTML = `<i class="fas fa-graduation-cap"></i>Highest Education: ${user.highestEducation}`;
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