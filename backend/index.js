import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";

const app = express();

app.use(bodyParser.urlencoded());
const port = 3000;
const saltRounds = 10;
env.config();

app.use(bodyParser.urlencoded());

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", async (req, res) => {
  const regData = req.body;

  try {
    const data = await db.query("SELECT * FROM users WHERE email = $1", [
      regData.email,
    ]);

    if (data.rows.length === 0) {
      bcrypt.hash(regData.password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const user = await db.query(
            "INSERT INTO users (email,hash_password,userName) VALUES ($1,$2,$3) RETURNING *",
            [regData.email, hash, regData.userName]
          );
          console.log(user.rows);
        }
      });
    } else {
      console.log(data.rows);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const logData = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      logData.email,
    ]);
    console.log(user.rows[0]);

    if (user.rows.length > 0) {
      bcrypt.compare(
        logData.password,
        user.rows[0].hash_password,
        (err, valid) => {
          if (err) {
            console.error(err);
          } else {
            if (valid) {
              res.send("Login sucsess");
            } else {
              res.send("Password incorect");
            }
          }
        }
      );
    } else {
      res.send("user not found");
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
