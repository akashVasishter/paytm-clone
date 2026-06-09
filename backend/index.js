const express = require("express");
const cors = require("cors");
const mainRouter = require("./routes/index");

app.use(cors());
app.use(express.json());
const app = express();

app.use("api/v1/",mainRouter);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});