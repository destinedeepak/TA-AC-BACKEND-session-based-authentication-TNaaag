var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var adminSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength:5}
})

adminSchema.pre('save', function(next){
 if(this.password && this.isModified('password')){
    bcrypt.hash(this.password, 12, (error, hashed)=>{
        if(error) return next(error);
        this.password = hashed;
        return next();
    })
 }else{
     next();
 }
})

adminSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, (error, result)=>{
        return cb(error, result);
    })
}

module.exports = mongoose.model('Admin', adminSchema);