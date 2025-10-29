const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Import routes
const routes = require("./routes/routes");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Mount routes
app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});