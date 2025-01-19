import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

const userSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
  username: z
    .string()
    .min(3, {
      message: "Username must be atleast 3 character long",
    })
    .max(20),
  password: z.string().min(6, {
    message: "password atleast 6 characters long",
  }),
});

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ errors: "Please fill all the fields" });
    }
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errorMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }

    // checking if user is already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: "User already Registered" });
    }
    // pass hash
    const hashPassword = await bcrypt.hash(password, 10);
    // create new user and save to Database
    const newUser = new User({ email, username, password: hashPassword });
    await newUser.save();
    if (newUser) {
      const token = await generateTokenAndSaveInCookies(newUser._id, res);
      res
        .status(201)
        .json({ message: "User Registered successfully", newUser, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// <================login============>
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }
    const token = await generateTokenAndSaveInCookies(user._id, res);
    res.status(200).json({ message: "User logged successfully", user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging user" });
  }
};

// ==============logout==========>>
export const logout = (req, res) => {
  console.log("logout called");
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    res.status(200).json({ message: "User log out successfully" });
  } catch (error) {
    console.log("Error logging out user");
  }
};
