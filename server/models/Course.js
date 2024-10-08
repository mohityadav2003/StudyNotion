const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    whatYouWillLearn:{
        type:String,
        required:true
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section"
        }
    ],
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview"
        }
    ],
    price:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String
    },
    tag:{
        type:[String],
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        }
    ],
    status:{
        type:String,
        default:'Drafted',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    instructions:{
        type:[String]
    }
});

module.exports=mongoose.model("Course",courseSchema);