const express = require("express"),
  cors = require("cors");
userRoutes = require("./routes/user");
ownerNFTRoutes = require("./routes/owner-nft");
inGameRoutes = require("./routes/in-game");
marketplaceRoutes = require("./routes/marketplace");
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
app.use("/in-game", inGameRoutes);
app.use("/owner-nft", ownerNFTRoutes);
app.use("/marketplace", marketplaceRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
