import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./db.js"; // PostgreSQL pool
import { generateToken } from "../utils/token.util.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists in PostgreSQL
        const email = profile.emails[0].value;
        let result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
          // Insert new user
          const insertQuery = `
            INSERT INTO users (username, email, hash_password)
            VALUES ($1, $2, $3) RETURNING *;
          `;
          result = await pool.query(insertQuery, [
            profile.displayName,
            email,
            profile.id,
          ]);
        }
        console.log(result);
        
        generateToken()
        done(null, result.rows[0]); // User object will be in req.user
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
