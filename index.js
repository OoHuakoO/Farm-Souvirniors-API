const express = require("express"),
  cors = require("cors");
  userRoutes = require("./routes/user")
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/user", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
