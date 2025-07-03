const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // ✅ Required for password hashing
const { PrismaClient } = require("./generated/prisma"); // Or '@prisma/client' if using default
const prisma = new PrismaClient();
const bodyParser = require("body-parser")
const SECRET_KEY = "your_secret_key"; // Use environment variable in production

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Basic check route
app.get("/", (req, res) => {
  res.send("hello world.........");
});

// 👤 Sign up
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error(err);

    if (err.code === "P2002") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  }
});

// 🔐 Sign in
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // 4. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

app.post("/category",async function(req,res){
  const {id,name} = req.body;
  const add_category =  await prisma.category.create({
    data:{
      id,
      name
    }
  })
  res.send(add_category);
})

app.get("/categories",async function(req,res){
  const get_categories = await prisma.category.findMany({
    select:{
      name:true,
      id:true
    }
  })
  res.send(get_categories);
})

  app.post("/add_subcategories", async function (req, res) {
    const { name, description, categoryId } = req.body;

    try {
      const subcategory = await prisma.subcategory.create({
        data: {
          name,
          description,
          categoryId,
        },
      });

      res.status(201).json({
        message: "Subcategory created successfully",
        subcategory,
      });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ error: "Failed to create subcategory" });
  }
});

app.get("/get_subcategory", async (req, res) => {
  const { categoryId } = req.query; 
  try {
    const allSubCategories = await prisma.subcategory.findMany({
      where: {
        categoryId: Number(categoryId), 
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.json(allSubCategories);
  } catch (err) {
    console.error("Error fetching subcategories:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/add_questions/:subcategoryId", async function (req, res) {
  const { subcategoryId } = req.params;
  const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;

  try {
    const add_question = await prisma.question.create({
      data: {
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        subcategoryId: Number(subcategoryId), // Ensure it's a number
      },
      select: {
        question_text: true,
        option_a: true,
        option_b: true,
        option_c: true,
        option_d: true,
        correct_option: true,
        subcategoryId: true,
      },
    });

    res.status(201).json(add_question);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/add_questions_bulk/:subcategoryId", async function (req, res) {
  const { subcategoryId } = req.params;
  const questions = req.body; // Expecting an array of question objects

  try {
    const formattedQuestions = questions.map((q) => ({
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option,
      subcategoryId: Number(subcategoryId),
    }));

    const addedQuestions = await prisma.question.createMany({
      data: formattedQuestions,
      skipDuplicates: true, // Optional: prevents duplicate insertions
    });

    res.status(201).json({
      message: "Questions added successfully",
      count: addedQuestions.count,
    });
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
 
app.get("/get_questions/:subcategoryId", async function (req, res) {
  const { subcategoryId } = req.params;

  try {
    const get_questions = await prisma.question.findMany({
      where: {
        subcategoryId: Number(subcategoryId), // ensure it's a number
      },
      select: {
        id: true,
        question_text: true,
        option_a: true,
        option_b: true,
        option_c: true,
        option_d: true,
        correct_option: true,
      },
    });

    res.json(get_questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/submit-test", async (req, res) => {
  const { user_id, subcategory_id, answers } = req.body;

  try {
    // 1. Validate user existence
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Validate subcategory and get categoryId
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: subcategory_id },
      include: { category: true },
    });

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // 3. Calculate score
    let score = 0;

    for (let answer of answers) {
      const question = await prisma.question.findUnique({
        where: { id: answer.question_id },
      });

      if (!question) {
        console.warn(`Question ID ${answer.question_id} not found.`);
        continue;
      }

      if (question.correct_option === answer.selected_option) {
        score += 1;
      }
    }

    const feedback =
      score === answers.length
        ? "Perfect score!"
        : score >= answers.length / 2
        ? "Good job!"
        : "Keep practicing!";

    // 4. Save score entry to the DB
    const submission = await prisma.score.create({
      data: {
        userId: user.id,
        subcategoryId: subcategory.id,
        categoryId: subcategory.category.id,
        score,
        total_questions: answers.length,
        feedback,
      },
    });

    // 5. Send success response
    return res.status(200).json({
      score,
      feedback,
      submission,
    });
  } catch (error) {
    console.error("Error submitting test:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Backend (Express) - Dashboard Route

app.get("/dashboard/:userId", async function (req, res) {
  const { userId } = req.params;

  try {
    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        username: true,
        email: true, // Add more fields as necessary
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's score history
    const scores = await prisma.score.findMany({
      where: { userId: parseInt(userId) },
      select: {
        category: {
          select: {
            name: true,
          },
        },
        score: true,
        total_questions: true,
      },
    });

    // Get latest feedback for the user (you can adjust based on your schema)
    const latestFeedback = scores.length > 0 ? scores[scores.length - 1].category.name : "";

    // Return user data and score history
    return res.status(200).json({
      profile: user,
      scores,
      feedback: latestFeedback,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});
