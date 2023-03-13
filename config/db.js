const mongoose = require('mongoose')

module.exports.mong = mongoose.connect(process.env.URL).then(()=>console.log("db connected")).catch((err)=>console.log("db not connected"))