const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const app = express();

const dbConnection = require("./common/dbConnection");

dotenv.config();
app.use(cors());

app.use((req, res) => {
  res.send("<h1>Hello</h1>");
});


dbConnection();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server running on http://localhost:${port} 🚀 `);
});
