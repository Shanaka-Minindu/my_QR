import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Auth server running on port ${port}`);
});
