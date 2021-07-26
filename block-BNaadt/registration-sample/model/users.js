var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var userSchema = new Schema({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, minlength:5, required: true },
  age: Number,
  phone: Number,
});

userSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified) {
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        return next();
      }else{
          next()
      }
  }catch(err) {
      return next(err);
  }
});

userSchema.methods.verifyPassword = function(password, cb){
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  })
}

module.exports = mongoose.model('User', userSchema);
