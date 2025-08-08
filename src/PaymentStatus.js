const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

// Serve main payment overlay page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Payment Confirmed</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          font-family: 'Arial', sans-serif;
        }

        body {
          background: #000;
        }

        .stars {
          width: 100%;
          height: 100%;
          background: black url('https://raw.githubusercontent.com/JulianLaval/canvas-space/master/stars.png') repeat;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 0;
          animation: moveStars 60s linear infinite;
        }

        @keyframes moveStars {
          from { background-position: 0 0; }
          to { background-position: -10000px 5000px; }
        }

        #payment-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.85);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          text-align: center;
        }

        #payment-overlay h1 {
          font-size: 32px;
          margin-bottom: 40px;
        }

        #start-button {
          font-size: 40px;
          background: none;
          border: none;
          color: #00ffcc;
          cursor: pointer;
          animation: pulse 2s infinite;
          user-select: none;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        #start-button:focus {
          outline: none;
        }
      </style>
    </head>
    <body>
      <div class="stars"></div>
      <div id="payment-overlay">
        <h1>✅ Payment Confirmed!</h1>
        <button id="start-button">🚀</button>
      </div>

      <script>
        document.getElementById("start-button").addEventListener("click", function () {
          fetch("/api/payment-confirmed", {
            method: "POST"
          })
            .then((response) => {
              if (response.ok) {
                window.location.href = "/game";
              } else {
                alert("Something went wrong. Try again.");
              }
            })
            .catch((error) => {
              console.error(error);
              alert("Server error. Please check your connection.");
            });
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoint to confirm payment (called when 🚀 is clicked)
app.post('/api/payment-confirmed', (req, res) => {
  console.log("✅ Payment confirmed by user. Starting game session...");
  // Burda DB yaddaşa verə bilərsən, log yaza bilərsən
  res.sendStatus(200);
});

// Fake game route
app.get('/game', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Game Started</title>
        <style>
          body {
            background: black;
            color: white;
            font-family: Arial;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-size: 24px;
          }
        </style>
      </head>
      <body>
        🎮 The Game Has Started! (Dummy Page)
      </body>
    </html>
  `);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
