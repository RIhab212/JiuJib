const express = require("express")
const app = express()
const mongoose = require("mongoose")
const router = express.Router()
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const http = require("http");
const { Server } = require("socket.io");
app.use(express.json())
const cors = require("cors")
app.use(cors())
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const JWT_SECRET = "ajz&ojozajojdoqjodijaoizjfofoqvnoqsniqosnd17187639217412984OZANOSNCOIU19287931U9DDZJ983J"

const mongoUrl = "mongodb+srv://Sofbt:dofy4mzVHYhdgE43@cluster0.d7u6cqi.mongodb.net/?retryWrites=true&w=majority"

mongoose
.connect(mongoUrl,{
    useNewUrlParser:true,
})
.then(()=>{
    console.log("Connected to database");
})
.catch((e)=>console.log(e))


require("./userDetails")
require("./Products")



const getProducts = require('./getProducts') 
app.use('/api/getproducts', getProducts)
const form = require('./form') 
app.use('/api/form', form)

app.use('/uploads', express.static('./form'));


const User = mongoose.model("UserInfo");
const Product =  mongoose.model("product")

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, gender } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      gender,
    });
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating user" });
  }
});
router.put("server/api/update", async(req ,res) => {
  try {
      const confirmed = await Product.findByIdAndUpdate({_id: req.body._id}, { isConfirmed: true } )
      if (!confirmed) {
          return res.status(404).send('User not found')
      }
      res.send('Product confirmed')
  } catch (error) {
      console.log(error)
      return res.status(500).send('Error updating document')        
  }
  
})


app.post("/signup", async (req, res) => {
    const {fname, lname, email, password,gender} = req.body;
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

app.post("/login-user", async(req,res)=>{
    const { email, password } = req.body

    const user = await User.findOne({email})
    const admin = await User.findOne({email, isAdmin : true})
    

    if (admin) {
        if(await bcrypt.compare(password, admin.password)){
            const token = jwt.sign({email: admin.email}, JWT_SECRET)
            if(res.status(201)){
                return res.json({status : "admin logged in", data:token})
            } else {
                return res.json({error : "error"})
            }
        }
    } else {
        if (!user) {
        return res.json({error : "User Not Found"})
    }
    if ( await bcrypt.compare(password, user.password)){
        const token = jwt.sign({email: user.email}, JWT_SECRET)
        console.log(user);

        if(res.status(201)){
            let avatarUrl;
            if(user.gender === 'male') {
              avatarUrl = '/male-avatar.png';
            } else if(user.gender === 'female') {
              avatarUrl = '/female-avatar.png';
            }
            return res.json({status : "user logged in", data: token, gender: user.gender, avatar: avatarUrl})
          } else {
            return res.json({error : "error"})
          }
    }
    }
    res.json({status : "error",error: "Invalid Password"})
})
app.post("/userData", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
    const { token } = req.body

    try {
        const user = jwt.verify(token, JWT_SECRET)
        const useremail = user.email
        User.findOne({email : useremail}).then((data) => {
            res.send({ status: "ok", data: data })
        }).catch((error) => {
            res.send({status: "error", data: error})
        })
    } catch (error) {
        
    }

})


app.post("/userProducts", async (req, res) => {
    const { token } = req.body

    try {
        const user = jwt.verify(token, JWT_SECRET)
        const ProductName = user.ProductName
        Product.find({ProductName : ProductName})
            .then((data) => {
                res.send({ status: "ok", data: data })
            }).catch((error) => {
            res.send({status: "error", data: error})
        })
    } catch (error) {

    }
})



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message",data);
  });

});
server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));





