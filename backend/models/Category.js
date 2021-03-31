import mongoose from 'mongoose'
import slugify from "slugify";


const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

categorySchema.pre("validate", function (next) {
    if (this.name) {
        this.slug = slugify(this.name, {lower: true, strict: true})
    }

    next();
});

const Category = mongoose.model('category', categorySchema)

export default Category
