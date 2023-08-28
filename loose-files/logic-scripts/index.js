const express = require('express');
const app = express();
const serveIndex = require("serve-index");
const path = require('path');;
const ROOT = path.join(__dirname, "static-set");

var port = 4400;




app.use((req, res, next) => {
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// app.get('/', (req, res) => {
//   // Use res.sendFile() to send the HTML file
//   res.sendFile(path.join(__dirname, 'files', 'index.html'));
// });


// Set up static file serving for the 'public' folder
app.use(express.static(ROOT));
app.use("/", serveIndex(ROOT));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





