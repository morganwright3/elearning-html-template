/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*-------------------------------------- UHM ITM354 Final Project --------------------------------------*/


/*---------------------------------- GENERAL FUNCTIONS USED EVERWHERE ----------------------------------*/

function navBar(mode = "index") {
    let isloggedin = getCookie("loggedIn");

    document.write(`
      <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
        <a href="index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
           <h2 class="-bs-primary"><img src="./img/Maryknoll_Logo.png" height="50px">myMaryknoll</h2>
        </a>
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <div class="navbar-nav ms-auto p-4 p-lg-0">
            <a href="index.html" class="nav-item nav-link">Home</a>

            ${mode === "sportal" ? `
              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Student Services</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="team.html" class="dropdown-item">Register For Class</a>
                  <a href="viewGrades.html" class="dropdown-item">View Grades</a>
                  <a href="viewAttendance.html" class="dropdown-item">View Attendance</a>
                  <a href="downloadReportCard.html" class="dropdown-item">Download Report Card</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Parent Services</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="team.html" class="dropdown-item">Link Student Account</a>
                  <a href="team.html" class="dropdown-item">Sign Permission Slip</a>
                  <a href="paymentStatus.html" class="dropdown-item">View Fee Payment Status</a>
                  <a href="team.html" class="dropdown-item">Schedule Conference</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Forms and Documents</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="team.html" class="dropdown-item">Permission Slips</a>
                  <a href="team.html" class="dropdown-item">Register For A Club</a>
                  <a href="activityWaiver.html" class="dropdown-item">Activity Waiver</a>
                  <a href="team.html" class="dropdown-item">Event Flyers and Downloads</a>                  
                  <a href="transcriptRequest.html" class="dropdown-item">Request Official Transcript</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Schedule and Events</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="team.html" class="dropdown-item">Sign Up For Field Trips</a>
                  <a href="team.html" class="dropdown-item">Volunteer Opportunities</a>
                  <a href="team.html" class="dropdown-item">Activity Calendar</a>
                  <a href="team.html" class="dropdown-item">Search Events By Type</a>
                </div>
              </div>
            ` : ``}
                        ${mode === "tportal" ? `
              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Manages Attendance</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="manageAttendance.html" class="dropdown-item">World History - 001</a>
                  <a href="teacherblank.html" class="dropdown-item">World History - 002</a>
                  <a href="teacherblank.html" class="dropdown-item">AP US History - 004</a>
                  <a href="teacherblank.html" class="dropdown-item">US History - 001</a>
                </div>
              </div>

                <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Manage Grades</a>
                <div class="dropdown-menu fade-down m-0">
                 <a href="manageGrades.html" class="dropdown-item">World History - 001</a>
                  <a href="manageGrades.html" class="dropdown-item">World History - 002</a>
                  <a href="manageGrades.html" class="dropdown-item">AP US History - 004</a>
                  <a href="manageGrades.html" class="dropdown-item">US History - 001</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Academic Reports</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="teacherblank.html" class="dropdown-item">Spring 2025 Semester</a>
                  <a href="teacherblank.html" class="dropdown-item">Fall 2024 Semester</a>
                  <a href="teacherblank.html" class="dropdown-item">2024 - 2025 Academic Year</a>
                  <a href="teacherblank.html" class="dropdown-item">Spring 2024 Semester</a>
                  <a href="teacherblank.html" class="dropdown-item">Fall 2023 Semester</a>
                  <a href="teacherblank.html" class="dropdown-item">2023 - 2024 Academic Year</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Communication</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="teacherblank.html" class="dropdown-item">Announcements</a>
                  <a href="teacherblank.html" class="dropdown-item">Email</a>
                  <a href="teacherblank.html" class="dropdown-item">Private Messages</a>
                  <a href="teacherblank.html" class="dropdown-item">Manage Conferences</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Student List</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="teacherblank.html" class="dropdown-item">Search</a>
                  <a href="teacherblank.html" class="dropdown-item">Class of 2025</a>
                  <a href="teacherblank.html" class="dropdown-item">Class of 2026</a>
                  <a href="teacherblank.html" class="dropdown-item">Class of 2027</a>
                  <a href="teacherblank.html" class="dropdown-item">Class of 2028</a>
                  <a href="teacherblank.html" class="dropdown-item">Class of 2029</a>
                </div>
              </div>
            ` : ``}
                        ${mode === "aportal" ? `
              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Manage Users</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="adminblank.html" class="dropdown-item">Add/Edit/ Delete Users</a>
                  <a href="adminblank.html" class="dropdown-item">Link Student-Parent Accounts</a>
                  <a href="adminblank.html" class="dropdown-item">Reset Passwords</a>
                  <a href="adminblank.html" class="dropdown-item">Assign Roles</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Manage Academics</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="adminblank.html" class="dropdown-item">Upload/Edit Report Cards</a>
                  <a href="adminblank.html" class="dropdown-item">Registerr Students For Classes</a>
                  <a href="adminblank.html" class="dropdown-item">Update Attendance, Grades, Fees</a>
                  <a href="trackTranscriptRequests.html" class="dropdown-item">Track Transcript Requests</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Manage Events</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="adminblank.html" class="dropdown-item">Create/Edit Events and Field Trips</a>
                  <a href="adminblank.html" class="dropdown-item">Handle Permission Slips and Waivers</a>
                  <a href="adminblank.html" class="dropdown-item">Upload Flyers and Documents</a>
                  <a href="adminblank.html" class="dropdown-item">Track Volunteer Sign-Ups</a>
                </div>
              </div>

              <div class="nav-item dropdown">
                <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Communication</a>
                <div class="dropdown-menu fade-down m-0">
                  <a href="adminblank.html" class="dropdown-item">Send Emails and Messages</a>
                  <a href="adminblank.html" class="dropdown-item">Post Announcements</a>
                  <a href="adminblank.html" class="dropdown-item">Activity Calendar</a>
                  <a href="adminblank.html" class="dropdown-item">Message By Class Or Group</a>
                </div>
              </div>
            ` : ``}
          </div>

          ${isloggedin == 1 ? `
            <a href="./logout" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block" onclick="logout()">Logout<i class="fa fa-arrow-right ms-3"></i></a>
          ` : `
            <a href="login.html" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block">Login<i class="fa fa-arrow-right ms-3"></i></a>
          `}
        </div>
      </nav>
    `);
}


function styleStuff(){ //contains favicon and css information
    document.write(`
    <!-- Favicon -->
    <link href="img/favicon.ico" rel="icon">

    <!-- Google Web Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet">

    <!-- Icon Font Stylesheet -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">

    <!-- Libraries Stylesheet -->
    <link href="lib/animate/animate.min.css" rel="stylesheet">
    <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

    <!-- Customized Bootstrap Stylesheet -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Template Stylesheet -->
    <link href="css/style.css" rel="stylesheet">
    `)
}

function footer() {
    document.write(`        
    <div class="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
        <div class="container py-5">
            <div class="row g-5">
                <div class="col-lg-6 col-md-12">
                    <h4 class="text-white mb-3">Contact</h4>
                    <p class="mb-2">1526 Alexander Street</p>
                    <p class="mb-2">Honolulu, Hawaii</p>
                    <p class="mb-2">+1 (808) 952 8400</p>
                    <p class="mb-2">info@maryknollschool.org</p>
                </div>
            </div>
        </div>
    </div>

    `)
}


function getCurrentDate() { // Function to get the current date in the format YYYY-MM-DD
    // Function from ChatGPT using the "make me a function that gets todays date using javascript" prompt
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function logout() { // deletes the logged in cookie and reloads the page
  // Deletes all cookies
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "librarianC=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "totalIC=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =  "address=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // Reload the current page
  location.reload();
}

function loadJSON(service, callback) { // This function asks the server for a "service" and converts the response to text.
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('POST', service, false);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
  };
  xobj.send(null);  
}

function reloadPageFor1Seconds() {
  let seconds = 0;
  const reloadInterval = setInterval(function () {
      if (seconds < 1) {
          location.reload();
          seconds++;
      } else {
          clearInterval(reloadInterval);
      }
  }, 1000); // 1000 milliseconds = 1 second
}

/*------------------------- INVOICE AND SHOPPING CART PAGE SPECIFIC FUNCTIONS --------------------------*/

function updateQuantity(location, productIndex){
  // get the shopping cart data for this user
  loadJSON(`update_cart?location=${location}&productIndex=${productIndex}&value=${document.getElementById(`quantityTextbox${location}_${productIndex}`).value}`, function (response) {
  // Parsing JSON string into object
  shopping_cart = JSON.parse(response);
  reloadPageFor1Seconds();
});
}

function updateFav(location, productIndex){
  console.log(location, productIndex, document.getElementById(`checkbox${location}_${productIndex}`).value);
  // get the shopping cart data for this user
  loadJSON(`update_fav?location=${location}&productIndex=${productIndex}&value=${document.getElementById(`checkbox${location}_${productIndex}`).value}`, function (response) {
  // Parsing JSON string into object
  shopping_cart = JSON.parse(response);
});
}

/*----------------------------------------- COOKIE FUNCTIONs -------------------------------------------*/

function setCookie(name, value, minutesToExpire) {// Function to set a cookie with a specified expiration time
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + (minutesToExpire * 60 * 1000));
  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
}

function getCookie(name){// Function to get the value of a cookie by name
    let cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

function checkCookie(cookieName) {// Function to check if a cookie exists
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(cookieName + "=") === 0) {
          return true; // Cookie found
      }
  }
  return false; // Cookie not found
}

/*------------------------------------------------------------------------------------------------------*/
