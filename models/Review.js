const mongoose = require("mongoose");
const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "please provide rating"],
      default: 0,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "please provide review title"],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "please provide review text"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
//unqiue sets it up such that each object has it's own index
//limit to 1 review per product per user
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  //result returns an array of the follow items
  const result = await this.aggregate([
    //first stage matching product id
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        //if we have no review then rating will be 0
        averageRating: Math.ceil(result[0]?.numOfReviews || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.productId);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.productId);
});

module.exports = mongoose.model("Review", ReviewSchema);
