const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// create an instance of express
const app = express();

// enable cors middleware to allow communication between different domains
app.use(cors());
app.use(express.json());

// defining the port number where the server will listen
const PORT = process.env.PORT || 8080;

// schema
const schemaData = mongoose.Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

// model
const todoModel = mongoose.model("todo", schemaData);

//read data
// url: http://localhost:8080/
app.get("/", async (req, res) => {
  const data = await todoModel.find({});
  res.json({ success: true, data: data });
});

// create data or save data in mongo db
app.post("/create", async (req, res) => {
  console.log(req.body);
  const data = new todoModel(req.body);
  await data.save();

  res.send({ success: true, message: "data save successfully", data:data });
});

// update data
app.put("/update/:id", async (req, res) => {
  const todoId = req.params.id;
  console.log(req.body);
  const { title, description } = req.body;

  try {
    const data = await todoModel.findByIdAndUpdate(
      todoId,
      { title, description },
      { new: true }
    );
    res.send({ success: true, message: "data updated successfully", data });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});


// delete data
app.delete("/delete/:id", async(req,res)=>{
  const id = req.params.id
  console.log(id)
  const data = await todoModel.deleteOne({_id : id})
  res.send({ success: true, message: "data deleted successfully", data:data });
})



//connecting the database and running the server
mongoose
  .connect("mongodb://127.0.0.1:27017/todoCrudOperation")
  .then(() => {
    console.log("connect to DB");
    app.listen(PORT, () => console.log("Server is running")); // starting the server and listen on the speified port
  })
  .catch((err) => console.log(err));
