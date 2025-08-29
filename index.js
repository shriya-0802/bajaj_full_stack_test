// index.js
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// === EDIT THESE ===
const FULL_NAME = "john_doe";   // <-- lowercase full name
const DOB = "17091999";         // <-- ddmmyyyy
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";
// ===================

app.post("/bfhl", (req, res) => {
  try {
    const { data } = req.body || {};

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid input. 'data' must be an array."
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    data.forEach((item) => {
      // treat anything as string for testing patterns
      const s = String(item);

      // integer test (allows optional leading minus)
      if (/^-?\d+$/.test(s)) {
        const num = parseInt(s, 10);
        sum += num;
        if (num % 2 === 0) even_numbers.push(s);
        else odd_numbers.push(s);
      } else if (/^[a-zA-Z]+$/.test(s)) {
        // purely alphabetical -> keep uppercase in alphabets array
        alphabets.push(s.toUpperCase());
      } else {
        // else treat as special character(s)
        special_characters.push(s);
      }
    });

    // Build concat_string:
    //  - join all alphabets in array -> single string
    //  - reverse characters
    //  - apply alternating caps starting with UPPER at index 0
    const concat_string = alphabets
      .join("")
      .split("")
      .reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      message: "Internal Server Error",
      error: err.message
    });
  }
});

app.get("/", (_req, res) => res.send("bfhl API running. POST /bfhl"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
