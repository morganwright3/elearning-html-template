/*---------- Created by Lui Rabideau, Xin Lin, Tassia Cocoran, Emma Sharp, and Jessica Bandol ----------*/
/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*------------------------- Lui Rabideau's F2023 ITM352 Assignment 3 Template --------------------------*/
/*-------------------------------------- UHM ITM354 Final Project --------------------------------------*/



/*---------------------------------- GENERAL FUNCTIONS USED EVERWHERE ----------------------------------*/

function navBar() { // the function that generates the nav bar
let isloggedin = getCookie("loggedIn");
let role1 = getCookie("role");
if (isloggedin == 1) {
    if (role1 == 1) { // STUDENT ONLY NAVBAR ------------------------------------------------------
        document.write(`
            <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
               <a href="index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
                   <h2 class="m-0 text-primary"><i class="fa fa-book me-3"></i>eLEARNING</h2>
               </a>
               <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                   <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarCollapse">
                   <div class="navbar-nav ms-auto p-4 p-lg-0">
                       <a href="index.html" class="nav-item nav-link active">Home</a>
                       <a href="about.html" class="nav-item nav-link">About</a>
                       <a href="courses.html" class="nav-item nav-link">Courses</a>
                       <div class="nav-item dropdown">
                           <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                           <div class="dropdown-menu fade-down m-0">
                               <a href="team.html" class="dropdown-item">Student</a>
                               <a href="testimonial.html" class="dropdown-item">Testimonial</a>
                               <a href="404.html" class="dropdown-item">404 Page</a>
                           </div>
                       </div>
                       <a href="contact.html" class="nav-item nav-link">Contact</a>
                   </div>
                   <a href="./logout" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block" onclick="logout()">Logout<i class="fa fa-arrow-right ms-3"></i></a>
               </div>
           </nav>
       `);
    } else if (role1 == 2) { // TEACHER ONLY NAVBAR ------------------------------------------------------
        document.write(`
            <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
               <a href="index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
                   <h2 class="m-0 text-primary"><i class="fa fa-book me-3"></i>eLEARNING</h2>
               </a>
               <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                   <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarCollapse">
                   <div class="navbar-nav ms-auto p-4 p-lg-0">
                       <a href="index.html" class="nav-item nav-link active">Home</a>
                       <a href="about.html" class="nav-item nav-link">About</a>
                       <a href="courses.html" class="nav-item nav-link">Courses</a>
                       <div class="nav-item dropdown">
                           <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                           <div class="dropdown-menu fade-down m-0">
                               <a href="team.html" class="dropdown-item">Teacher</a>
                               <a href="testimonial.html" class="dropdown-item">Testimonial</a>
                               <a href="404.html" class="dropdown-item">404 Page</a>
                           </div>
                       </div>
                       <a href="contact.html" class="nav-item nav-link">Contact</a>
                   </div>
                   <a href="./logout" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block" onclick="logout()">Logout<i class="fa fa-arrow-right ms-3"></i></a>
               </div>
           </nav>
       `);
    } else if (role1 == 3) { // ADMIN ONLY NAVBAR ------------------------------------------------------
        document.write(`
            <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
               <a href="index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
                   <h2 class="m-0 text-primary"><i class="fa fa-book me-3"></i>eLEARNING</h2>
               </a>
               <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                   <span class="navbar-toggler-icon"></span>
               </button>
               <div class="collapse navbar-collapse" id="navbarCollapse">
                   <div class="navbar-nav ms-auto p-4 p-lg-0">
                       <a href="index.html" class="nav-item nav-link active">Home</a>
                       <a href="about.html" class="nav-item nav-link">About</a>
                       <a href="courses.html" class="nav-item nav-link">Courses</a>
                       <div class="nav-item dropdown">
                           <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                           <div class="dropdown-menu fade-down m-0">
                               <a href="team.html" class="dropdown-item">Admin</a>
                               <a href="testimonial.html" class="dropdown-item">Testimonial</a>
                               <a href="404.html" class="dropdown-item">404 Page</a>
                           </div>
                       </div>
                       <a href="contact.html" class="nav-item nav-link">Contact</a>
                   </div>
                   <a href="./logout" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block" onclick="logout()">Logout<i class="fa fa-arrow-right ms-3"></i></a>
               </div>
           </nav>
       `);
    }
} else {
        document.write(`
     <nav class="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
        <a href="index.html" class="navbar-brand d-flex align-items-center px-4 px-lg-5">
            <h2 class="m-0 text-primary"><i class="fa fa-book me-3"></i>eLEARNING</h2>
        </a>
        <button type="button" class="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <div class="navbar-nav ms-auto p-4 p-lg-0">
                <a href="index.html" class="nav-item nav-link active">Home</a>
                <a href="about.html" class="nav-item nav-link">About</a>
                <a href="courses.html" class="nav-item nav-link">Courses</a>
                <div class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                    <div class="dropdown-menu fade-down m-0">
                        <a href="team.html" class="dropdown-item">Our Team</a>
                        <a href="testimonial.html" class="dropdown-item">Testimonial</a>
                        <a href="404.html" class="dropdown-item">404 Page</a>
                    </div>
                </div>
                <a href="contact.html" class="nav-item nav-link">Contact</a>
            </div>
            <a href="login.html" class="btn btn-primary py-4 px-lg-5 d-none d-lg-block">Login<i class="fa fa-arrow-right ms-3"></i></a>
        </div>
    </nav>
`);
}
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
                <div class="col-lg-3 col-md-6">
                    <h4 class="text-white mb-3">Quick Link</h4>
                    <a class="btn btn-link" href="">About Us</a>
                    <a class="btn btn-link" href="">Contact Us</a>
                    <a class="btn btn-link" href="">Privacy Policy</a>
                    <a class="btn btn-link" href="">Terms & Condition</a>
                    <a class="btn btn-link" href="">FAQs & Help</a>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h4 class="text-white mb-3">Contact</h4>
                    <p class="mb-2"><i class="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                    <p class="mb-2"><i class="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                    <p class="mb-2"><i class="fa fa-envelope me-3"></i>info@example.com</p>
                    <div class="d-flex pt-2">
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-twitter"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-facebook-f"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-youtube"></i></a>
                        <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h4 class="text-white mb-3">Gallery</h4>
                    <div class="row g-2 pt-2">
                        <div class="col-4">
                            <img class="img-fluid bg-light p-1" src="img/course-1.jpg" alt="">
                        </div>
                        <div class="col-4">
                            <img class="img-fluid bg-light p-1" src="img/course-2.jpg" alt="">
                        </div>
                        <div class="col-4">
                            <img class="img-fluid bg-light p-1" src="img/course-3.jpg" alt="">
                        </div>
                        <div class="col-4">
                            <img class="img-fluid bg-light p-1" src="img/course-2.jpg" alt="">
                        </div>
                        <div class="col-4">
                            <img class="img-fluid bg-light p-1" src="img/course-3.jpg" alt="">
                        </div>
                        <div class="col-4">
                            <img class="img-fluid bg-light p-1" src="img/course-1.jpg" alt="">
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <h4 class="text-white mb-3">Newsletter</h4>
                    <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
                    <div class="position-relative mx-auto" style="max-width: 400px;">
                        <input class="form-control border-0 w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email">
                        <button type="button" class="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="copyright">
                <div class="row">
                    <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        &copy; <a class="border-bottom" href="#">Your Site Name</a>, All Right Reserved.

                        <!--/*** This template is free as long as you keep the footer author’s credit link/attribution link/backlink. If you'd like to use the template without the footer author’s credit link/attribution link/backlink, you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". Thank you for your support. ***/-->
                        Designed By <a class="border-bottom" href="https://htmlcodex.com">HTML Codex</a>
                    </div>
                    <div class="col-md-6 text-center text-md-end">
                        <div class="footer-menu">
                            <a href="">Home</a>
                            <a href="">Cookies</a>
                            <a href="">Help</a>
                            <a href="">FQAs</a>
                        </div>
                    </div>
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
