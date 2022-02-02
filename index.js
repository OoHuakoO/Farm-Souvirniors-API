const express = require("express"),
  cors = require("cors");
userRoutes = require("./routes/user");
nftRoutes = require("./routes/nft");
mongoose = require("mongoose");
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
mongoose.connect(
  "mongodb+srv://komsak:promix02.@farm-souvirniors.1q0o6.mongodb.net/Farm-Souvirniors",
  { useNewUrlParser: true }
);
app.use("/user", userRoutes);
app.use("/nft", nftRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
