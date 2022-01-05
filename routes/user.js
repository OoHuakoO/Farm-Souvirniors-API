const express = require('express')

const router = express.Router()

router.get('/',(req,res)=>{
    res.json({'title':100})
})

module.exports = router;