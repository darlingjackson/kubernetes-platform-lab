/* =========================================================
   ✨ LAB PULSE
   Kubernetes Platform Lab
   ---------------------------------------------------------
   GOAL:
   Take the instructor's existing Node.js + Express application
   structure and turn it into my own small application.

   This app will:
   - Run with Node.js
   - Use Express as the web server
   - Display my latest technical win
   - Accept a new tech win through a form
   - Store the submitted value while the app is running
   - Serve CSS from the /public folder
   - Listen on port 80 inside the Docker container

   IMPORTANT:
   This app is intentionally simple.

   I am practicing how:
   Browser → Express → Form → POST Request → Updated Output

   works before moving into more complex containerized applications.
   ========================================================= */


/* =========================================================
   1. IMPORT DEPENDENCIES
   ========================================================= */

// Load Express.
//
// Express helps me create the web server and define routes
// such as:
//
// GET /
// POST /store-win
const express = require('express');


// Load body-parser.
//
// body-parser allows the application to read information
// submitted from the HTML form.
//
// Example:
//
// User types:
// Built my first Docker image!
//
// The form submits:
// win=Built my first Docker image!
//
// Then I can access that value with:
//
// req.body.win
const bodyParser = require('body-parser');


/* =========================================================
   2. CREATE THE EXPRESS APPLICATION
   ========================================================= */

// express() creates my Express application.
//
// "app" now represents the web server.
//
// I will use it with:
//
// app.use()
// app.get()
// app.post()
// app.listen()
const app = express();


/* =========================================================
   3. CREATE THE DEFAULT TECH WIN
   ========================================================= */

// This variable stores the tech win currently displayed
// on the webpage.
//
// I use "let" because this value WILL change when the
// user submits a new win.
//
// IMPORTANT:
// This is only stored in the application's memory.
//
// If the container stops or is recreated, this value
// will reset to the default below.
//
// Later, a database could be used for persistent storage.
let techWin = 'Built my first Docker image! 🐳';


/* =========================================================
   4. READ FORM DATA
   ========================================================= */

// Middleware runs between the incoming browser request
// and the final Express route.
//
// Browser
//    ↓
// Middleware
//    ↓
// Express Route
//    ↓
// Response
//
// urlencoded() lets Express understand information
// submitted from a normal HTML form.
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);


/* =========================================================
   5. SERVE STATIC FILES
   ========================================================= */

// Tell Express to serve files from the "public" folder.
//
// This is where my CSS file lives:
//
// public/styles.css
//
// Because of this line, my HTML can simply use:
//
// <link rel="stylesheet" href="styles.css">
app.use(express.static('public'));


/* =========================================================
   6. HOME PAGE
   ========================================================= */

// app.get() handles a GET request.
//
// GET /
// means:
//
// "When someone visits the home page, send them this page."
//
// req = incoming request
// res = outgoing response
app.get('/', (req, res) => {

  // res.send() sends the HTML back to the browser.
  //
  // Backticks create a template literal.
  //
  // This lets me:
  // - write HTML across multiple lines
  // - insert JavaScript values using ${ }
  res.send(`
    <!DOCTYPE html>

    <html lang="en">

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>Lab Pulse | Kubernetes Platform Lab</title>

        <!--
          styles.css is located inside the public folder.

          Express is able to serve it because I configured:

          app.use(express.static('public'));
        -->
        <link rel="stylesheet" href="styles.css">

      </head>


      <body>

        <main class="page-shell">


          <!-- ===============================================
               LAB STATUS
               =============================================== -->

          <div class="lab-status">

            <span class="status-dot"></span>

            Kubernetes Platform Lab

          </div>


          <!-- ===============================================
               MAIN APPLICATION
               =============================================== -->

          <section class="pulse-panel">


            <div class="panel-glow"></div>


            <div class="eyebrow">
              ✦ LAB PULSE
            </div>


            <h1>
              Track the little
              <span>tech wins.</span>
            </h1>


            <p class="intro">
              A tiny containerized app for keeping track of
              what I learned, fixed, built, or finally got working.
            </p>


            <!-- =============================================
                 CURRENT VALUE

                 ${techWin} inserts the current JavaScript
                 variable into the HTML sent to the browser.
                 ============================================= -->

            <section class="current-win">

              <div class="current-win-label">
                Latest Tech Win
              </div>

              <div class="win-icon">
                ✦
              </div>

              <h2>
                ${techWin}
              </h2>

              <p>
                Stored in the running Node.js application
              </p>

            </section>


            <!-- =============================================
                 FORM

                 When submitted:

                 POST /store-win

                 is sent to the Express server.
                 ============================================= -->

            <form
              action="/store-win"
              method="POST"
              class="win-form"
            >

              <label for="win">
                What did I accomplish?
              </label>


              <!--
                name="win" is important.

                This becomes:

                req.body.win

                inside the POST route.
              -->
              <input
                id="win"
                type="text"
                name="win"
                placeholder="Ex: Fixed my container port mapping"
                autocomplete="off"
                required
              >


              <button type="submit">

                <span>Log My Win</span>

                <span class="button-arrow">→</span>

              </button>

            </form>


            <!-- =============================================
                 STACK INFORMATION
                 ============================================= -->

            <div class="stack-row">

              <div class="stack-item">
                <span>Runtime</span>
                <strong>Node.js</strong>
              </div>

              <div class="stack-item">
                <span>Server</span>
                <strong>Express</strong>
              </div>

              <div class="stack-item">
                <span>Platform</span>
                <strong>Docker</strong>
              </div>

              <div class="stack-item">
                <span>Port</span>
                <strong>80</strong>
              </div>

            </div>


          </section>


          <footer>

            Built while learning containers
            <span>•</span>
            Kubernetes Platform Lab

          </footer>


        </main>

      </body>

    </html>
  `);
});


/* =========================================================
   7. HANDLE THE FORM SUBMISSION
   ========================================================= */

// app.post() handles information being SENT to the server.
//
// My HTML form uses:
//
// action="/store-win"
// method="POST"
//
// So when the button is clicked:
//
// Form
//   ↓
// POST /store-win
//   ↓
// Express
//   ↓
// This route runs
app.post('/store-win', (req, res) => {

  // Read the value from:
  //
  // <input name="win">
  //
  // body-parser makes it available through:
  //
  // req.body.win
  const enteredWin = req.body.win;


  // Print the submitted value to the Node.js console.
  //
  // When running inside Docker, I can also see output
  // from the container using Docker logs.
  console.log(`New tech win: ${enteredWin}`);


  // Replace the old value with the newly submitted one.
  //
  // Example:
  //
  // Before:
  // Built my first Docker image!
  //
  // User submits:
  // Fixed my container port mapping
  //
  // After:
  // techWin = "Fixed my container port mapping"
  techWin = enteredWin;


  // Send the browser back to the home page.
  //
  // GET / runs again.
  //
  // The page is rebuilt and now displays the updated
  // value of ${techWin}.
  res.redirect('/');
});


/* =========================================================
   8. START THE WEB SERVER
   ========================================================= */

// Start Express and listen on port 80.
//
// This is port 80 INSIDE the Docker container.
//
// My Dockerfile also documents:
//
// EXPOSE 80
//
// If I run:
//
// docker run -p 3000:80 lab-002
//
// the flow becomes:
//
// Browser
// localhost:3000
//      ↓
// Host Port 3000
//      ↓
// Docker Port Mapping
//      ↓
// Container Port 80
//      ↓
// Express
//      ↓
// Lab Pulse
app.listen(80, () => {

  console.log('Lab Pulse server is running on container port 80');

});