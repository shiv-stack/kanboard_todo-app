import Todo from "../model/todo.model.js";

// am using zod for validating my schema

// create todo
export const createTodo = async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    user: req.user._id, //associate tdo with loggedin user
  });

  try {
    const newtodo = await todo.save();
    res.status(201).json({ message: "todo created successfully", newtodo });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error occured in todo creation" });
  }
};

//fetch todos
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({user: req.user._id,}); //fetch todos inly for logged in users
    res.status(201).json({ message: "Todo Fetched Successfully", todos });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error occuring in  fetching todo" });
  }
};
//update todos
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json({ message: "Todo updated Successfully", todo });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error occuring updating todo " });
  }
};

// Delete todos
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(201).json({ message: "Todo deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error occuring in todo deletion  " });
  }
};
