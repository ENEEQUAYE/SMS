document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle
    document.getElementById("sidebarCollapse").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("active")
    })
  
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelectorAll(".content-section").forEach((section) => {
          section.classList.add("d-none")
        })
        document.querySelector(this.getAttribute("data-target")).classList.remove("d-none")
      })
    })
  
    // Logout
    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  
    // Load initial data
    loadDashboardData()
    loadUserInfo()
    loadStudents()
    loadLecturers()
    loadCourses()
    loadUsers()
    initializeCalendar()
  
    // Form submissions
    document.getElementById("student-form").addEventListener("submit", addStudent)
    document.getElementById("lecturer-form").addEventListener("submit", addLecturer)
    document.getElementById("course-form").addEventListener("submit", addCourse)
    document.getElementById("event-form").addEventListener("submit", addEvent)
  })
  
  async function loadDashboardData() {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const data = await response.json()
      document.getElementById("total-students").textContent = data.totalStudents
      document.getElementById("total-lecturers").textContent = data.totalLecturers
      document.getElementById("total-courses").textContent = data.totalCourses
      document.getElementById("upcoming-events").textContent = data.upcomingEvents
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }
  
  function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      document.getElementById("user-name").textContent = `${user.firstName} ${user.lastName}`
    }
  }
  
  async function loadStudents() {
    try {
      const response = await fetch('http://localhost:I'll continue the text stream from the cut-off point:
  
  loadStudents() {
      try {
          const response = await fetch('http://localhost:5000/api/users/students', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
      const students = await response.json()
      const tableBody = document.getElementById("students-table-body")
      tableBody.innerHTML = ""
      students.forEach((student, index) => {
        const row = `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${student.firstName} ${student.lastName}</td>
                      <td>${student.email}</td>
                      <td>${student.studentId}</td>
                      <td>
                          <button class="btn btn-sm btn-primary" onclick="editStudent('${student._id}')">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
                      </td>
                  </tr>
              `
        tableBody.innerHTML += row
      })
    } catch (error) {
      console.error("Error loading students:", error)
    }
  }
  
  async function loadLecturers() {
    try {
      const response = await fetch("http://localhost:5000/api/users/lecturers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const lecturers = await response.json()
      const tableBody = document.getElementById("lecturers-table-body")
      tableBody.innerHTML = ""
      lecturers.forEach((lecturer, index) => {
        const row = `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${lecturer.firstName} ${lecturer.lastName}</td>
                      <td>${lecturer.email}</td>
                      <td>${lecturer.department}</td>
                      <td>
                          <button class="btn btn-sm btn-primary" onclick="editLecturer('${lecturer._id}')">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteLecturer('${lecturer._id}')">Delete</button>
                      </td>
                  </tr>
              `
        tableBody.innerHTML += row
      })
    } catch (error) {
      console.error("Error loading lecturers:", error)
    }
  }
  
  async function loadCourses() {
    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const courses = await response.json()
      const tableBody = document.getElementById("courses-table-body")
      tableBody.innerHTML = ""
      courses.forEach((course, index) => {
        const row = `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${course.name}</td>
                      <td>${course.code}</td>
                      <td>${course.department}</td>
                      <td>${course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "N/A"}</td>
                      <td>
                          <button class="btn btn-sm btn-primary" onclick="editCourse('${course._id}')">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course._id}')">Delete</button>
                      </td>
                  </tr>
              `
        tableBody.innerHTML += row
      })
    } catch (error) {
      console.error("Error loading courses:", error)
    }
  }
  
  async function loadUsers() {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const users = await response.json()
      const tableBody = document.getElementById("users-table-body")
      tableBody.innerHTML = ""
      users.forEach((user, index) => {
        const row = `
                  <tr>
                      <td>${index + 1}</td>
                      <td>${user.firstName} ${user.lastName}</td>
                      <td>${user.email}</td>
                      <td>${user.role}</td>
                      <td>
                          <button class="btn btn-sm btn-primary" onclick="editUser('${user._id}')">Edit</button>
                          <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                      </td>
                  </tr>
              `
        tableBody.innerHTML += row
      })
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }
  
  function initializeCalendar() {
    const calendarEl = document.getElementById("events-calendar")
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: "http://localhost:5000/api/events",
      eventClick: (info) => {
        // Handle event click
        console.log("Event clicked:", info.event)
      },
    })
    calendar.render()
  }
  
  async function addStudent(e) {
    e.preventDefault()
    const studentData = {
      email: document.getElementById("student-email").value,
      password: document.getElementById("student-password").value,
      firstName: document.getElementById("student-first-name").value,
      lastName: document.getElementById("student-last-name").value,
      dateOfBirth: document.getElementById("student-dob").value,
      gender: document.getElementById("student-gender").value,
      contactNumber: document.getElementById("student-contact").value,
      address: document.getElementById("student-address").value,
      emergencyContact: {
        name: document.getElementById("student-emergency-name").value,
        phone: document.getElementById("student-emergency-phone").value,
      },
      department: document.getElementById("student-department").value,
      studentId: document.getElementById("student-id").value,
      enrollmentDate: document.getElementById("student-enrollment-date").value,
      academicYear: document.getElementById("student-academic-year").value,
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/users/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(studentData),
      })
  
      if (!response.ok) {
        throw new Error("Failed to add student")
      }
  
      const result = await response.json()
      alert(result.message)
      $("#addStudentModal").modal("hide")
      loadStudents()
    } catch (error) {
      console.error("Error adding student:", error)
      alert("Failed to add student. Please try again.")
    }
  }
  
  async function addLecturer(e) {
    e.preventDefault()
    const lecturerData = {
      email: document.getElementById("lecturer-email").value,
      password: document.getElementById("lecturer-password").value,
      firstName: document.getElementById("lecturer-first-name").value,
      lastName: document.getElementById("lecturer-last-name").value,
      department: document.getElementById("lecturer-department").value,
      employeeId: document.getElementById("lecturer-employee-id").value,
      hireDate: document.getElementById("lecturer-hire-date").value,
      specialization: document.getElementById("lecturer-specialization").value,
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/users/add-lecturer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(lecturerData),
      })
  
      if (!response.ok) {
        throw new Error("Failed to add lecturer")
      }
  
      const result = await response.json()
      alert(result.message)
      $("#addLecturerModal").modal("hide")
      loadLecturers()
    } catch (error) {
      console.error("Error adding lecturer:", error)
      alert("Failed to add lecturer. Please try again.")
    }
  }
  
  async function addCourse(e) {
    e.preventDefault()
    const courseData = {
      name: document.getElementById("course-name").value,
      code: document.getElementById("course-code").value,
      department: document.getElementById("course-department").value,
      description: document.getElementById("course-description").value,
      instructor: document.getElementById("course-instructor").value,
      credits: document.getElementById("course-credits").value,
      startDate: document.getElementById("course-start-date").value,
      endDate: document.getElementById("course-end-date").value,
      capacity: document.getElementById("course-capacity").value,
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(courseData),
      })
  
      if (!response.ok) {
        throw new Error("Failed to add course")
      }
  
      const result = await response.json()
      alert(result.message)
      $("#addCourseModal").modal("hide")
      loadCourses()
    } catch (error) {
      console.error("Error adding course:", error)
      alert("Failed to add course. Please try again.")
    }
  }
  
  async function addEvent(e) {
    e.preventDefault()
    const eventData = {
      title: document.getElementById("event-title").value,
      description: document.getElementById("event-description").value,
      startDate: document.getElementById("event-start-date").value,
      endDate: document.getElementById("event-end-date").value,
      location: document.getElementById("event-location").value,
      organizer: document.getElementById("event-organizer").value,
      isPublic: document.getElementById("event-is-public").checked,
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData),
      })
  
      if (!response.ok) {
        throw new Error("Failed to add event")
      }
  
      const result = await response.json()
      alert(result.message)
      $("#addEventModal").modal("hide")
      initializeCalendar() // Refresh the calendar
    } catch (error) {
      console.error("Error adding event:", error)
      alert("Failed to add event. Please try again.")
    }
  }
  
  function editStudent(studentId) {
    // Implement edit student functionality
    console.log("Edit student:", studentId)
  }
  
  function deleteStudent(studentId) {
    if (confirm("Are you sure you want to delete this student?")) {
      // Implement delete student functionality
      console.log("Delete student:", studentId)
    }
  }
  
  function editLecturer(lecturerId) {
    // Implement edit lecturer functionality
    console.log("Edit lecturer:", lecturerId)
  }
  
  function deleteLecturer(lecturerId) {
    if (confirm("Are you sure you want to delete this lecturer?")) {
      // Implement delete lecturer functionality
      console.log("Delete lecturer:", lecturerId)
    }
  }
  
  function editCourse(courseId) {
    // Implement edit course functionality
    console.log("Edit course:", courseId)
  }
  
  function deleteCourse(courseId) {
    if (confirm("Are you sure you want to delete this course?")) {
      // Implement delete course functionality
      console.log("Delete course:", courseId)
    }
  }
  
  function editUser(userId) {
    // Implement edit user functionality
    console.log("Edit user:", userId)
  }
  
  function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
      // Implement delete user functionality
      console.log("Delete user:", userId)
    }
  }
  
  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "login.html"
  }
  
  // Add any additional functions or event listeners as needed
  
  