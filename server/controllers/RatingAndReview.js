const RatingAndReview=require('../models/RatingAndReview');
const Course=require('../models/Course');
const mongoose=require('mongoose');

exports.createRating=async(req,res)=>{
    try{
        const userId=req.user.id;

        const {rating,review, courseId}=req.body;

        const courseDetails=await Course.find({_id:courseId, studentEnrolled: {$elemMatch: {$eq: userId}}});

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course'
            });
        }

        const alreadyReviewed=await RatingAndReview.findOne({user:userId, course:courseId});

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:'Course is already reviewed by the student'
            });
        }

        const ratingReview=await RatingAndReview.create({
            rating, review, course:courseId, user:userId
        });

        await Course.findByIdAndUpdate(
            {_id:courseId}, {$push:{ratingAndReviews:ratingReview._id}}, {new:true}
        );

        return res.status(200).json({
            success:true,
            message:'Rating and Review created successfully'
        })
    }catch(error){
        console.log('error in creating rating and review');
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}



exports.getAverageRating=async(req,res)=>{
    try{
        const {courseId}=req.params;
        
        const result = await RatingAndReview.aggregate([
            {
                $match: { course:new mongoose.Types.ObjectId(courseId) }
            },
            {
                $group: { _id: null, averageRating: { $avg: '$rating' } }
            }
        ]);
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating
            });
        }

        return res.status(200).json({
            success:true,
            message:'Average rating is 0, no ratings given till now',
            averageRating: 0
        });
    }catch(error){
        console.log('error in finding average rating');
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}



exports.getAllRatingAndReview=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
                                    .sort({rating:'desc'})
                                    .populate({
                                        path:'user',
                                        select:'firstName lastName email image'
                                    })
                                    .populate({
                                        path:'course',
                                        select:'courseName'
                                    })
                                    .exec();

        return res.status(200).json({
            success:true,
            message:'All reviews fetched successfully',
            data:allReviews
        })
    }catch(error){
        console.log('error in finding average rating');
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}