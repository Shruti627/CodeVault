require("dotenv").config(); // ✅ MUST BE FIRST

const database = require("./config/db");
const app = require("./app");

database();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
