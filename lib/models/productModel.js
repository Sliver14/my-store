import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    sizes: {
        type: Array,
        required: true,
    },
    bestseller: {
        type: Boolean,
    },
    date: {
        type: Number,
        required: true,
    },

})

// Helpful indexes for faster filtering/searching
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ name: "text", description: "text" });

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel;
// export const Product = mongoose.model("product", productSchema)
