const express = require('express');
const mongoose = require("mongoose");

const router = express.Router();

const app = express();
const Product = mongoose.model("product");
const User = mongoose.model("UserInfo","product");


app.use(express.json());

router.get("/", async(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const products = await Product.find({ isConfirmed : false })
        return res.json(products)
    } catch (error) {
        return res.status(400).json({message : error})
    }

});


router.put("/confirm", async(req ,res) => {
    try {
        const confirmed = await Product.findByIdAndUpdate({_id: req.body._id}, { status: 'ORDER_ACCEPTED', isConfirmed: true} )
        if (!confirmed) {
            return res.status(404).send('User not found')
        }
        
        res.send('Product confirmed')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error updating document')        
    }
    
})

router.put("/pickUp", async(req ,res) => {

    try {
        const confirmed = await Product.findByIdAndUpdate({_id: req.body._id}, { status: 'ORDER_PICKUP', isConfirmed: true } )
        if (!confirmed) {
            return res.status(404).send('User not found')
        }
        
      

        res.send('Product to be picked up')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error updating document')        
    }
    
})

router.put("/deliver", async(req ,res) => {
    try {
        const confirmed = await Product.findByIdAndUpdate({_id: req.body._id}, { status: "ORDER_DELIVERED" } )
        if (!confirmed) {
            return res.status(404).send('User not found')
        }
        
      

        res.send('Product delivered')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error updating document')        
    }
    
})
app.post("/userProducts", async (req, res) => {
    const { token } = req.body
  
    try {
        const user = jwt.verify(token, JWT_SECRET)
        const usermail = user.email
        Product.find({email : usermail})
        .then((data) => {
            res.send({ status: "ok", data: data })
        }).catch((error) => {
            res.send({status: "error", data: error})
        })
    } catch (error) {
        
    }
  })

router.put("/update_notif", async(req ,res) => {
    try {
        const confirmed = await Product.findByIdAndUpdate({_id: req.body._id}, { Notif: false } )
        if (!confirmed) {
            return res.status(404).send('User not found')
        }
        res.send('Notification removed')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error removing notification from document')        
    }
    
})


router.post("/api/phonesignup", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const phonesignup = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        password: req.body.password,
        ph: req.body.ph,
      });
  
      await phonesignup.save();
      res.status(200).json({ message: "Phone number saved successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.put("/updatesuiv", async(req ,res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const confirmed = await Product.findByIdAndUpdate({ _id: req.body._id }, { Delivred : true } )
        if (!confirmed) {
            return res.status(404).send('User not found')
        }

        res.send('Product confirmed')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error updating document')
    }
});
router.get("/getPlacedOrders", async(req, res) => {
    try {
        const products = await Product.find({status : "ORDER_ACCEPTED", isConfirmed: true})
        return res.json(products)
    } catch (error) {
        return res.status(400).json({message : error})
    }

}) 

router.get("/getToPickUpOrders", async(req, res) => {
    try {
        const products = await Product.find({status : "ORDER_PICKUP"})
        return res.json(products)
    } catch (error) {
        return res.status(400).json({message : error})
    }

}) 

router.get("/getDeliveredOrders", async(req, res) => {
    try {
        const products = await Product.find({status : "ORDER_PICKUP"})
        return res.json(products)
    } catch (error) {
        return res.status(400).json({message : error})
    }

}) 
module.exports = router;
