const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const authPath = require("./routers/auth")
dotenv.config()
const app = express();
app.use(express.json())
app.use(cors())

const { User } = require("./modules/Users")



const connectionParams = {
    useNewUrlParser: true, useUnifiedTopology: true


}

mongoose.connect(process.env.DBURI)
    .then(() => {
        console.log("connection successful")
    })
    .catch((e) => {
        console.log("error", e)
    })
app.post("/", async (req, res) => {
    try {
        const user = new User({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Nationality: req.body.Nationality,
            Image: req.body.Image
        });
        const newUser = await user.save();
        res.status(201).json(newUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "somthing went wrong " })
    }
})

// rotes

app.use("/api/auth", authPath)


// error handler middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message })
})






app.listen(process.env.Port || 8000, () => {
    console.log(`server work on ${process.env.Port}`)
})