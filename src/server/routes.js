import express from "express";
import User from "./user.js";
import crypto from "crypto";

const router = express.Router();

// Create new user
router.post("/create", async (req, res) => {
  const user = new User({
    id: crypto.randomUUID(),
    name: req.body.name,
    internYear: req.body.internYear,
    order: req.body.order,
  });

  try {
    const userToSave = await user.save();
    res.status(200).json(userToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Find user
router.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({id: req.params.id});
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user reply
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await User.findOneAndUpdate({id: id}, updatedData, options);
    res.json(result)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user
router.delete('/delete/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const user = await User.findOneAndDelete({id: id})
      res.send(`${user.name} has been deleted.`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

router.delete('/delete', async (req, res) => {
  try {
      await User.deleteMany()
      res.send("All users have been deleted.")
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
})

export default router;
