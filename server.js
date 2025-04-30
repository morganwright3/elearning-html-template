/*---------- Created by Lui Rabideau, Xin Lin, Tassia Cocoran, Emma Sharp, and Jessica Bandol ----------*/
/* Incorporated into the design from W3schools: W3.CSS 4.15 December 2020 by Jan Egil and Borge Refsnes */
/*------------------------- Lui Rabideau's F2023 ITM352 Assignment 3 Template --------------------------*/
/*-------------------------------------- UHM ITM354 Final Project --------------------------------------*/

var express = require('express');
var app = express();
var myParser = require("body-parser");
var mysql = require('mysql');
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(session({secret: "MySecretKey", resave: true, saveUninitialized: true}));
app.use(express.static('./public'));
app.use(myParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

let userLoggedin = {};

const fs = require('fs');
const { type } = require('os');

app.use((req, res, next) => {
  if (typeof req.session.reservation === 'undefined') {
    req.session.reservation = {};
  }
  next(); // Move to the next middleware or route handler
});

// monitor all requests and make a reservation
app.all('*', function (request, response, next){// this function also makes reservations
  console.log(request.method + ' to ' + request.path);
  next();
});

/*---------------------------------- DATABASE CONNECTION ----------------------------------*/
console.log("Connecting to localhost..."); 
var con = mysql.createConnection({// Actual DB connection occurs here
  host: '10.211.55.3',
  user: "root",
  port: 3306,
  database: "maryknoll", 
  password: ""
}); 

con.connect(function (err) {// Throws error or confirms connection
  if (err) throw err;
 console.log("Connected!");
});


// VIEW COURSE SEAT STATUS
app.get('/get-classes', (req, res) => {
  const sql = `SELECT CourseID, CourseName, AvailableSeats FROM course`;

  con.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results); // send back all courses + seat numbers
  });
});

/*---------------------------------- GET Transcripts ----------------------------------*/
app.post('/submit-transcript-request', (req, res) => {
  const { studentID, deliveryMethod, notes } = req.body;

  // First, try to find in Alumni table
  const findAlumniQuery = `SELECT AlumniID FROM Alumni WHERE StudentID = ?`;

  con.query(findAlumniQuery, [studentID], (err, alumniResults) => {
    if (err) {
      console.error('Error finding alumni:', err);
      return res.send("Internal error.");
    }

    if (alumniResults.length > 0) {
      // Alumni found, use AlumniID
      const alumniID = alumniResults[0].AlumniID;
      insertTranscriptRequest(alumniID, deliveryMethod, notes, res);
    } else {
      // Alumni not found, create a new Alumni record based on student info
      const findStudentQuery = `SELECT StudentID, Fname, Lname, Email FROM Student WHERE StudentID = ?`;

      con.query(findStudentQuery, [studentID], (err2, studentResults) => {
        if (err2 || studentResults.length === 0) {
          console.error('Error finding student:', err2);
          return res.send("Student not found.");
        }

        const student = studentResults[0];
        const insertAlumniQuery = `
          INSERT INTO Alumni (StudentID, GradYear, Email, PhoneNumber, Address)
          VALUES (?, YEAR(CURDATE()), ?, '', '')
        `;

        con.query(insertAlumniQuery, [student.StudentID, student.Email], (err3, insertResult) => {
          if (err3) {
            console.error('Error inserting new alumni:', err3);
            return res.send("Error creating alumni record.");
          }

          const newAlumniID = insertResult.insertId;
          insertTranscriptRequest(newAlumniID, deliveryMethod, notes, res);
        });
      });
    }
  });
});

function insertTranscriptRequest(alumniID, deliveryMethod, notes, res) {
  const insertRequestQuery = `INSERT INTO TranscriptRequest (AlumniID, DeliveryMethod, Notes) VALUES (?, ?, ?)`;

  con.query(insertRequestQuery, [alumniID, deliveryMethod, notes], (err4) => {
    if (err4) {
      console.error('Error inserting transcript request:', err4);
      return res.send("Error submitting transcript request.");
    }
    res.redirect('/successfulTranscripts.html');
  });
}


// Get Transcript Requests for a Specific Student
app.get('/get-transcript-requests', (req, res) => {
  const studentID = req.query.studentID;

  const findStudentQuery = `SELECT StudentID, Fname AS FirstName, Lname AS LastName FROM Student WHERE StudentID = ?`;
  con.query(findStudentQuery, [studentID], (err, results) => {
      if (err || results.length === 0) {
          console.error('Error finding student:', err);
          return res.json([]);
      }

      const student = results[0];
      const alumniID = student.StudentID;
      const requestQuery = `
          SELECT RequestDate, DeliveryMethod, Status
          FROM TranscriptRequest
          WHERE AlumniID = ?
          ORDER BY RequestDate DESC
      `;

      con.query(requestQuery, [alumniID], (err2, requestResults) => {
          if (err2) {
              console.error('Error fetching transcript requests:', err2);
              return res.json([]);
          }

          // Format the dates and include student name
          const formattedRequests = requestResults.map(request => {
              const formattedDate = new Date(request.RequestDate).toLocaleDateString();
              return {
                  ...request,
                  RequestDate: formattedDate,
                  StudentID: student.StudentID,
                  StudentName: `${student.FirstName} ${student.LastName}`,
              };
          });

          res.json(formattedRequests);
      });
  });
});

app.get('/admin/get-transcript-requests', (req, res) => {
  const query = `
      SELECT 
          tr.RequestID,
          a.StudentID,
          CONCAT(s.Fname, ' ', s.Lname) AS StudentName,
          tr.RequestDate,
          tr.DeliveryMethod,
          tr.Status
      FROM TranscriptRequest tr
      JOIN Alumni a ON tr.AlumniID = a.AlumniID
      JOIN Student s ON a.StudentID = s.StudentID
ORDER BY tr.RequestID DESC
  `;

  con.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching admin transcript requests:', err);
          return res.status(500).send('Failed to fetch transcript requests.');
      }
      res.json(results);
  });
});




/*---------------------------------- GET ATTENDANCE ----------------------------------*/
app.get('/get-student-attendance', (req, res) => {
  const studentId = req.query.student_id;

  const sql = `
    SELECT 
      a.StudentID,
      s.Fname,
      s.Lname,
      c.CourseName,
      a.Date,
      a.Status
    FROM attendance a
    JOIN student s ON a.StudentID = s.StudentID
    JOIN course c ON a.CourseID = c.CourseID
    WHERE a.StudentID = ?
    ORDER BY a.Date DESC
  `;

  con.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error('Error fetching attendance:', err.message);
      return res.status(500).send('Failed to fetch attendance.');
    }
    res.json(results);
  });
});



// Get all courses
app.get('/get-courses', (req, res) => {
  const sql = `SELECT CourseID, CourseName FROM course`;
  con.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get students in a course
app.get('/get-students-in-course', (req, res) => {
  const courseID = req.query.course_id;
  const sql = `
    SELECT s.StudentID, s.Fname, s.Lname
    FROM student s
    JOIN enrollment e ON s.StudentID = e.StudentID
    WHERE e.CourseID = ?
  `;
  con.query(sql, [courseID], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/submit-attendance', (req, res) => {
  const { courseID } = req.body;
  const records = req.body.attendanceRecords;

  for (const studentID in records) {
    const status = records[studentID];

    if (!studentID || !status || !courseID) {
      console.error('Missing data:', { studentID, status, courseID });
      continue; // Skip if invalid
    }

    const sql = `
      INSERT INTO attendance (StudentID, CourseID, Date, Status)
      VALUES (?, ?, CURDATE(), ?)
    `;

    con.query(sql, [studentID, courseID, status], (err) => {
      if (err) console.error('Error inserting attendance:', err.message);
    });
  }

  res.redirect('/successfulAttendance.html');
});

/*---------------------------------- Manage Grades ----------------------------------*/
app.get('/get-students-and-grades', (req, res) => {
  const courseID = req.query.classID;
  const sql = `
SELECT 
  s.StudentID, 
  CONCAT(s.Fname, ' ', s.Lname) AS FullName,
  ROUND(AVG(g.Grade), 2) AS Grade,
  COUNT(g.Grade) AS GradeCount,
  MAX(g.DateGraded) AS DateGraded
FROM student s
JOIN enrollment e ON s.StudentID = e.StudentID
LEFT JOIN grade g ON g.StudentID = s.StudentID AND g.CourseID = e.CourseID
WHERE e.CourseID = ?
GROUP BY s.StudentID

  `;

  con.query(sql, [courseID], (err, results) => {
    if (err) {
      console.error('Error retrieving grades:', err.message);
      return res.status(500).send('Failed to retrieve grades.');
    }
    res.json(results);
  });
});

app.post('/update-grade', (req, res) => {
  const { StudentID, ClassID, Grade } = req.body;

  const sql = `INSERT INTO grade (Grade, StudentID, CourseID, DateGraded) VALUES (?, ?, ?, CURDATE())`;

  con.query(sql, [Grade, StudentID, ClassID], (err) => {
    if (err) {
      console.error('Error inserting grade:', err.message);
      return res.status(500).json({ success: false });
    }

    // ✅ Only send one response here
    res.json({ success: true });
  });
});

//get grades (student)
app.get('/get-my-grades', (req, res) => {
  const studentEmail = req.cookies.username;
  console.log("Student email cookie:", studentEmail);
  const courseID = req.query.courseID || null;

  let sql = `
  SELECT s.StudentID, CONCAT(s.Fname, ' ', s.Lname) AS FullName, 
         c.CourseID, c.CourseName, g.Grade, g.DateGraded
  FROM student s
  JOIN grade g ON s.StudentID = g.StudentID
  JOIN course c ON g.CourseID = c.CourseID
WHERE LOWER(s.Email) = LOWER(?)
`;

  const params = [studentEmail];

  if (courseID) {
    sql += " AND c.CourseID = ?";
    params.push(courseID);
  }
  con.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error fetching filtered grades:', err.message);
      return res.status(500).send("Failed to fetch grades.");
    }
  
    // Format DateGraded
    const formatted = results.map(row => {
      return {
        ...row,
        DateGraded: row.DateGraded
        ? new Date(row.DateGraded + 'T00:00:00').toLocaleDateString('en-US')
        : "N/A"
      };
    });
  
    res.json(formatted);
  });
});


/*---------------------------------- GET PAYMENTS ----------------------------------*/
app.get('/get-payments', (req, res) => {
  const email = req.cookies.username;
  console.log("/get-payments: email from cookie:", email);

  if (!email) return res.status(400).send("Missing email");

  const sql = `
    SELECT 
      p.StudentID,
      s.Fname AS FirstName,
      s.Lname AS LastName,
      p.PaymentID,
      p.PaymentDate,
      p.Amount,
      p.Method,
      p.Status
    FROM payment p
    JOIN student s ON p.StudentID = s.StudentID
    WHERE LOWER(s.Email) = LOWER(?)
    ORDER BY p.Status DESC, p.PaymentDate DESC;
  `;

  con.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err.message);
      return res.status(500).send('Failed to fetch payments.');
    }
    res.json(results);
  });
});


app.get('/student/outstanding-balance', (req, res) => {
  const email = req.query.email;
  console.log("/student/outstanding-balance email:", email);

  if (!email) {
    console.error("Missing email in request.");
    return res.status(400).json({ error: "Missing student email" });
  }

  const sql = `
    SELECT 
      s.StudentID,
      CONCAT(s.Fname, ' ', s.Lname) AS FullName,
      10000 AS TotalTuition,
      IFNULL(SUM(CASE WHEN p.Status = 'Paid' THEN p.Amount ELSE 0 END), 0) AS TotalPaid,
      10000 - IFNULL(SUM(CASE WHEN p.Status = 'Paid' THEN p.Amount ELSE 0 END), 0) AS OutstandingBalance
    FROM student s
    LEFT JOIN payment p ON s.StudentID = p.StudentID
    WHERE LOWER(s.Email) = LOWER(?)
    GROUP BY s.StudentID
  `;

  con.query(sql, [email], (err, results) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ error: "SQL error" });
    }

    if (results.length === 0) {
      console.warn("No student found with email:", email);
      return res.status(404).json({});
    }

    res.json(results[0]);
  });
});

// SUBMIT PAYMENT
app.post('/submit-payment', (req, res) => {
  const { student_id, amount, billing_name, method, fee_type } = req.body;

  let properMethod = method;
  if (method === 'credit_card') properMethod = 'Credit Card';
  if (method === 'paypal') properMethod = 'PayPal';
  if (method === 'cash') properMethod = 'Cash';

  const sql = `
    INSERT INTO payment (StudentID, PaymentDate, Amount, Method, Status, FeeType)
    VALUES (?, NOW(), ?, ?, 'Paid', ?)
  `;

  con.query(sql, [student_id, amount, properMethod, fee_type || 'Tuition'], (err, result) => {
    if (err) {
      console.error('Error inserting payment:', err.message);
      return res.status(500).send('Failed to submit payment.');
    }
    console.log('Payment inserted successfully.');
    res.redirect('/successfulPayment.html');
  });
});

/*---------------------------------- Admin Enrollment Status ----------------------------------*/

app.get('/admin/enrollment-stats', (req, res) => {
  const sql = `
SELECT 
  c.CourseID,
  c.CourseName,
  COUNT(e.StudentID) AS EnrolledCount,
  c.AvailableSeats,
  (COUNT(e.StudentID) + c.AvailableSeats) AS MaxCapacity
FROM course c
LEFT JOIN enrollment e ON c.CourseID = e.CourseID
GROUP BY c.CourseID, c.CourseName, c.AvailableSeats
  `;

  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching enrollment stats:", err);
      return res.status(500).send("Error fetching enrollment stats.");
    }
    res.json(results);
  });
});


/*---------------------------------- REGISTER FOR COURSE ----------------------------------*/
app.post('/register', (req, res) => {
  const { first_name, last_name, email, phone, class: course_id } = req.body;

  const sql = `
    UPDATE course
    SET AvailableSeats = AvailableSeats - 1
    WHERE CourseID = ? AND AvailableSeats > 0
  `;

  con.query(sql, [course_id], (err, result) => {
    if (err) throw err;

    if (result.affectedRows > 0) {
      res.redirect('/successfulRegistration.html');
    } else {
      res.send('Sorry, no seats available for this class.');
    }
  });
});

/*---------------------------------- Outstanding Balances ----------------------------------*/

app.get('/admin/outstanding-balances', (req, res) => {
  const sql = `
    SELECT 
      s.StudentID,
      CONCAT(s.Fname, ' ', s.Lname) AS FullName,
      10000 AS TotalTuition,
      IFNULL(SUM(CASE WHEN p.Status = 'Paid' THEN p.Amount ELSE 0 END), 0) AS TotalPaid,
      10000 - IFNULL(SUM(CASE WHEN p.Status = 'Paid' THEN p.Amount ELSE 0 END), 0) AS OutstandingBalance
    FROM student s
    LEFT JOIN payment p ON s.StudentID = p.StudentID
    GROUP BY s.StudentID
  `;

  con.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching outstanding balances:', err.message);
      return res.status(500).send('Failed to load tuition report.');
    }
    res.json(results);
  });
});


/*---------------------------------- LOGIN/LOGOUT/REGISTER ----------------------------------*/

app.post('/login', (request, response) => {
  const the_username = request.body.username.toLowerCase();
  const the_password = request.body.password;

  const query = `
    (SELECT Email, Password, Role
     FROM student
     WHERE Email = ?)
     UNION
    (SELECT Email, Password, Role
     FROM teacher
     WHERE Email = ?);
  `;

  con.query(query, [the_username, the_username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return response.status(500).send('Internal Server Error');
    }

    if (results.length === 0) {
      return response.status(401).send('Invalid username or password');
    }

    const user = results[0];

    if (user.Password !== the_password) {
      return response.status(401).send('Invalid username or password');
    }

    // ✅ This is where you correctly set the cookie with the actual email
    response.cookie("loggedIn", 1, { maxAge: 1800000 });
    response.cookie("username", user.Email, { maxAge: 1800000 }); // store actual email

    // Set role cookie and redirect
    if (user.Role === 'student') {
      response.cookie("role", 1, { maxAge: 1800000 });
      return response.redirect('/studentPortal.html');
    } else if (user.Role === 'teacher') {
      response.cookie("role", 2, { maxAge: 1800000 });
      return response.redirect('/teacherPortal.html');
    } else if (user.Role === 'principal') {
      response.cookie("role", 3, { maxAge: 1800000 });
      return response.redirect('/adminPortal.html');
    }
  });
});



app.post('/register', function (request, response) { 
  let the_username = request.body.username.toLowerCase(); // Account_Email
  let the_password = request.body.password;              // Account_Password
  let lname = request.body.lastname;                     // Last name
  let fname = request.body.firstname;                    // First name
  let fullname = fname + ' ' + lname;                    // User_Name

  // Query to insert data into the `account` table
  const queryAccount = `
    INSERT INTO account (Account_Email, Account_Password) 
    VALUES (?, ?);
  `;

  // Query to insert data into the `user` table
  const queryUser = `
    INSERT INTO user (User_ID, User_Name, Account_Email) 
    VALUES (?, ?, ?);
  `;

  // Generate a unique User_ID
  let userID = generateUniqueUserID();

  // Insert into the `account` table
  con.query(queryAccount, [the_username, the_password], (err) => {
    if (err) {
      console.error('Database error in account table:', err); 
      return response.status(500).send('Error creating account.');
    }

    // Insert into the `user` table
    con.query(queryUser, [userID, fullname, the_username], (err) => {
      if (err) {
        console.error('Database error in user table:', err);
        return response.status(500).send('Error creating user.');
      }
      // Store Account_ID and Name in the session
      request.session.Name = fullname;
      request.session.Account_ID = userID;

      console.log(`User created successfully with User_ID: ${userID}`);

      // Set logged-in cookie and redirect
      response.cookie("loggedIn", 1, { expire: Date.now() + 30 * 60 * 1000 });
      return response.redirect('/account.html');
    });
  });
});

app.get('/logout', function (req, res) {
  res.clearCookie("loggedIn");
  res.clearCookie("username");
  res.clearCookie("role");
  res.redirect('./index.html');
});

/*---------------------------------- ROOMS SQL ----------------------------------*/

app.get("/searchRooms", (req, res) => {
  const start = request.body.in;
  const end = request.body.out;
  const room = request.body.room;
  const persons = request.body.persons;

  if (!search) {
      return res.status(400).send("Search term is required.");
  }

  const query = `
      SELECT * 
      FROM rooms 
      INNER JOIN Department d ON r.Department_ID = d.Department_ID
      WHERE Geo_Location LIKE '%${search}%';
  `;

  con.query(query, (err, result) => {
      if (err) throw err;
      // Store results in session
      req.session.results = result;
      req.session.search = search;
      req.session.what = 'geo';
      // Redirect to geo.html with the query parameters
      res.redirect(`/results.html?search=${encodeURIComponent(search)}&page=${page}`);
  });
});

app.get("/get-session-data", (req, res) => {
  if (!req.session.results || !req.session.search) {
      return res.status(404).json({ error: "No session data available." });
  }
  res.json({
      results: req.session.results, 
      search: req.session.search
  });
  console.log(req.session);
});

app.get('/get-session-details', (req, res) => {
  if (req.session.Account_ID) {
      res.json({ Account_ID: req.session.Account_ID, Account_Name: req.session.Account_Name });
  } else {
      res.status(401).json({ error: "Account number not found in session." });
  }
});

/*---------------------------------- SEARCH SQL ----------------------------------*/

app.post("/executeSearch", (req, res) => {
  const search = req.body.searchInput;
  const type = req.body.searchType;
  const format = req.body.format;

  console.log(format);

  const query = `
    SELECT Record_ID, Title, D_name, Date, Subject, Description, Medium, Language 
    FROM record r 
    INNER JOIN Department d ON r.Department_ID = d.Department_ID
    WHERE ${type} LIKE '%${search}%' AND Medium = '${format}';
    `;

  con.query(query, (err, result) => {
    if (err) throw err;
    // Store results in session
    req.session.results = result;
    req.session.search = search;
    req.session.type = type;
    req.session.format = format;
    req.session.what = 'ser';
    // Redirect to results.html with the query parameters
    res.redirect(`/results.html?search=${encodeURIComponent(search)}`);
  });
});

/*----------------------------------- REQUESTING -----------------------------------*/

app.post("/nextPage", (req, res) => {
  const search = req.session.search;
  const what = req.session.what;
  let page = parseInt(req.body.page) || 1; // Parse the page number as an integer, default to 1
  page += 1; // Correct increment

  const limit = 10; // Default to 10 records per page
  const offset = (page - 1) * limit; // Calculate offset for SQL query

  let query; // Declare the query variable in a broader scope

  if (what === 'geo') {
    query = `
      SELECT Record_ID, Title, Department_Name, Year_Range, Subject, Description, Medium, Language 
      FROM RECORDS 
      WHERE Geo_Location LIKE '%${search}%'
      LIMIT ${limit} OFFSET ${offset};
    `;
  } else {
    const type = req.session.type;
    const format = req.session.format;
    query = `
      SELECT Record_ID, Title, Department_Name, Year_Range, Subject, Description, Medium, Language 
      FROM RECORDS 
      WHERE ${type} LIKE '%${search}%' AND Medium = '${format}' 
      LIMIT ${limit} OFFSET ${offset};
    `;
  }

  // Execute the query
  con.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal Server Error");
    }
    req.session.results = result;// Store results in session
    // Redirect to results.html with updated query parameters
    res.redirect(`/results.html?search=${encodeURIComponent(search)}&page=${page}`);
  });
});

app.post("/request", (req) => {
  let data = req.body;

  // Extract all keys (RecordIDs) from the incoming request body
  const recordIDs = Object.keys(data);

  console.log("Extracted RecordIDs:", recordIDs);

  // SQL query to insert a RecordID into the Contains table
  const query = `INSERT INTO contains (Record_ID) VALUES (?)`;

  // Loop through each RecordID and insert it into the database
  recordIDs.forEach((recordID) => {
    con.query(query, [recordID], (err) => {
      if (err) {
        console.error(`Error inserting RecordID '${recordID}':`, err);
      } else {
        console.log(`Inserted RecordID '${recordID}' successfully.`);
      }
    });
  });
});

app.get('/get-user-reservations', (req, res) => {
  // Retrieve Account_Name or Account_ID from the user session
  const accountId = req.session.Account_ID;

  if (!accountId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Query to fetch records linked to the user's Account_ID
  const query = `
    SELECT r.Record_ID, r.Title, d.D_name, r.Date, r.Subject, r.Description, r.Medium, r.Language, res.Reservation_Status 
    FROM record r
    JOIN department d ON r.Department_ID = d.Department_ID
    JOIN reserves res ON r.Record_ID = res.Record_ID
    WHERE res.User_ID = '${accountId}';
  `;

  // Execute the query with Account_ID as a parameter
  con.query(query, [accountId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }

    // Send the fetched data to the client
    res.json({ records: results });
  });
});

// Endpoint to finalize the request
app.post('/finalizeRequest', (req, res) => {
  const reservationID = generateUniqueReservationID();
  const date = getCurrentDate();
  const accountID = req.body.accountNumber;

  // Query 0: Insert into Reservation
  const query0 = `
    INSERT INTO Reservation 
    (Reservation_ID, Account_ID, Reservation_Start_Date, Reservation_Status, Reservation_Fulfilled_Date) 
    VALUES (?, ?, ?, 'Submitted', NULL)
  `;

  // Query 1: Update contains table
  const query1 = `
    UPDATE contains 
    SET Reservation_ID = ? 
    WHERE Reservation_ID IS NULL OR Reservation_ID = '';
  `;

  // Run Query 0 (INSERT)
  con.query(query0, [reservationID, accountID, date], (err, result) => {
    if (err) {
      console.error('Error inserting into Reservation:', err.message);
      return res.status(500).send('Failed to finalize request: INSERT failed.');
    }

    console.log('Reservation created successfully.');

    // Run Query 1 (UPDATE) only after Query 0 succeeds
    con.query(query1, [reservationID], (err, updateResult) => {
      if (err) {
        console.error('Error updating contains table:', err.message);
        return res.status(500).send('Failed to finalize request: UPDATE failed.');
      }

      console.log(`Assigned Reservation_ID: ${reservationID} to ${updateResult.affectedRows} record(s).`);

      // Redirect to account.html after success
      res.redirect('/account.html');
    });
  });
});

app.post('/update-reservation-status', (req, res) => {
  const input = req.body;
  console.log(input);

  // Normalize input: ensure it's always an array
  const reservations = Array.isArray(input) ? input : [input];

  // Loop through each reservation
  reservations.forEach(reservation => {
    const userID = reservation.user_id;          // Updated to User_ID
    const recordID = reservation.record_id;      // Updated to Record_ID
    const reservationStat = reservation.status;  // Updated to Reservation_Status

    console.log(`Updating User_ID: ${userID}, Record_ID: ${recordID} with Status: ${reservationStat}`);

    const query = `
        UPDATE reserves
        SET Reservation_Status = ?
        WHERE User_ID = ? AND Record_ID = ?;
    `;

    // Execute the query for each reservation
    con.query(query, [reservationStat, userID, recordID], (err) => {
      if (err) {
        console.error(`Error updating User_ID ${userID}, Record_ID ${recordID}:`, err);
      } else {
        console.log(`Successfully updated User_ID: ${userID}, Record_ID: ${recordID}`);
      }
    });
  });

  // Redirect back to advanced.html
  res.redirect('/advanced.html');
});

/*----------------------------------- REPORTS -----------------------------------*/

// API endpoint for dynamic report generation
app.get("/api/reports", (req, res) => {
  const { reportType } = req.query; // Get reportType from query params

  let query = "";

  // Determine the SQL query to run based on reportType
  switch (reportType) {
    case "1": // Location Frequency Report
      query = `
SELECT Location, COUNT(*) AS Record_Count
FROM record
GROUP BY Location
ORDER BY Record_Count DESC;
      `;
      break;
    case "2": // Government Agency Report
      query = `
SELECT d.D_name AS Department_Name, r.Title AS Record_Title, r.Subject
FROM record r
JOIN department d ON r.Department_ID = d.Department_ID
WHERE d.D_name LIKE '%Department%'
ORDER BY d.D_name, r.Title;

      `;
      break;
    case "3": // Distribution Report
      query = `
SELECT Medium, COUNT(*) AS Record_Count
FROM record
GROUP BY Medium
ORDER BY Record_Count DESC;
      `;
      break;
    case "4": // Monthly Document Report
      query = `
SELECT Record_ID, Title, Date, Subject, Medium
FROM record
WHERE Date LIKE '2024-01%' 
ORDER BY Date ASC;
      `;
      break;
    default:
      return res.status(400).send("Invalid report type");
  }

  // Execute the selected query
  con.query(query, (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results); // Send JSON response
  });
});

// API endpoint to execute custom SQL
app.get("/api/run-query", (req, res) => {
  const sqlQuery = req.query.sqlCode;

  // Basic validation to prevent dangerous queries
  if (!sqlQuery || sqlQuery.toLowerCase().includes("drop") || sqlQuery.toLowerCase().includes("delete")) {
      return res.status(400).json({ error: "Unsafe SQL query detected!" });
  }

  con.query(sqlQuery, (err, results) => {
      if (err) {
          console.error("SQL Query Error:", err);
          return res.status(500).json({ error: err.message });
      }

      res.json(results);
  });
});

/*----------------------------------- STAFF VIEW -----------------------------------*/

app.get('/get-submitted-reservations', (req, res) => {// API endpoint to get submitted reservations. i changed this because we want to see all reservations, not just submitted ones
  const query = `
    SELECT User_ID, Record_ID, Librarian_ID, Reservation_Start_Date, Reservation_Status, Returned_Time 
    FROM reserves;
  `;

  con.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching submitted reservations:', err.message);
      return res.status(500).send('Failed to fetch reservations');
    }
    res.json({ reservations: results }); // Send results as JSON
  });
});

app.post('/modifyRecords', (req, res) => {
  const action = req.body.action || null; // the dropdown
  const Record_ID = req.body.Record_ID || null;
  const Author_ID = req.body.Author_ID || null;
  const Publisher_ID = req.body.Publisher_ID || null;
  const Department_ID = req.body.Department_ID || null;
  const ISBN = req.body.ISBN || null;
  const Location = req.body.Location || null;
  const Rights = req.body.Rights || null;
  const Title = req.body.Title || null;
  const Description = req.body.Description || null;
  const Language = req.body.Language || null;
  const Geo_Location = req.body.Geo_Location || null;
  const Date = req.body.Date || null;
  const Metadata = req.body.Metadata || null;
  const Medium = req.body.Medium || null;
  const Subject = req.body.Subject || null;

  // Handle based on action
  if (action === 'add') { // Logic to add a record
    console.log("Adding new record...");
    const query = `
      INSERT INTO record (Record_ID, Author_ID, Publisher_ID, Department_ID, ISBN, Location, Rights, Title, Description, Language, Geo_Location, Date, Metadata, Medium, Subject) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    con.query(
      query,
      [
        Record_ID, Author_ID, Publisher_ID, Department_ID, ISBN, Location, Rights, 
        Title, Description, Language, Geo_Location, Date, Metadata, Medium, Subject
      ],
      (err) => {
        if (err) {
          console.error('Error adding record:', err.message);
          return res.status(500).send('Failed to add record.');
        }
        console.log("Record added successfully!");
        return res.redirect('/modify.html');
      }
    );
  } else if (action === 'delete') { // Logic to delete a record
    console.log("Deleting record...");
    const query = `DELETE FROM record WHERE Record_ID = ?;`;

    con.query(query, [Record_ID], (err) => {
      if (err) {
        console.error('Error deleting record:', err.message);
        return res.status(500).send('Failed to delete record.');
      }
      console.log("Record deleted successfully!");
      return res.redirect('/modify.html');
    });
  } else {
    console.log("Unknown action received.");
    return res.status(400).send("Invalid action specified.");
  }
});

/*----------------------------------- Unique ID Generation and Date -----------------------------------*/

const generatedAccountIDs = new Set(); // To ensure unique Account_IDs
function generateUniqueUserID() {// Function to generate a unique random Account_ID
  let accountID;
  do {
    accountID = `U${Math.floor(100000 + Math.random() * 900000)}`; // e.g., "A123456"
  } while (generatedAccountIDs.has(accountID)); // Ensure it's not a duplicate
  generatedAccountIDs.add(accountID); // Add to the set
  return accountID;
}

const generatedReservationIDs = new Set(); // To ensure unique Account_IDs
function generateUniqueReservationID() {// Function to generate a unique random Reservation_ID
  let reservationID;
  do {
    reservationID = `R${Math.floor(100000 + Math.random() * 900000)}`; // e.g., "R123456"
  } while (generatedReservationIDs.has(reservationID)); // Ensure it's not a duplicate
  generatedReservationIDs.add(reservationID); // Add to the set
  return reservationID;
}

function getCurrentDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/*----------------------------------- ROUTING -----------------------------------*/
app.all('*', function (request, response, next) {// This must be at the end!
  console.log(request.method + ' to ' + request.path);
  next();
});

app.listen(8080, () => console.log(`listening on port 8080`));
