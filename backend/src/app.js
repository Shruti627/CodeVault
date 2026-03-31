const express= require('express')
const cors = require("cors");
const aiSearchRoutes = require("./routes/aiSearchRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes=require("./routes/paymentRoutes")
const chatRoutes = require("./routes/chatRoutes");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/admin", adminRoutes)
app.use("/api/payments", paymentRoutes);

app.use("/api/chat", chatRoutes);
app.use("/api/ai-search", aiSearchRoutes);
app.get('/',(req,res)=>{
    res.send("project on")
})

module.exports=app;