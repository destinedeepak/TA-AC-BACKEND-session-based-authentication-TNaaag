var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var articleSchema = new Schema({
    title: {type: String, required:true},
    description: String,
    tags: [String],
    author: {type: String, required:true},
    address:String,
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    slug: {type: String, unique: true},
    comments:[{type: Schema.Types.ObjectId, ref:"Comment"}]
}, {timestamps: true});

articleSchema.pre('save', function (next){
    this.slug = this.title.toLowerCase().split(' ').filter(ele=>{
        if(ele.trim()) return ele;
    }).join('-')
})

module.exports = mongoose.model('Article', articleSchema);