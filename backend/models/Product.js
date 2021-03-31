import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'
import slugify from 'slugify'

const Schema = mongoose.Schema;

const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        // slug: {
        //     type: String,
        //     slug: 'name'
        // },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        category: {type: Schema.Types.ObjectId, ref: 'category', required: true},
        images: [
            {
                type: String,
            }
        ],
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

productSchema.pre("validate", function (next) {
    if (this.name) {
        this.slug = slugify(this.name, {lower: true, strict: true})
    }
    // this.slug = this.name
    //     .toLowerCase()
    //     .replace(/\s+/g, "-")
    //     .replace(".", "");
    // this.slug = this.name.split(" ").join("-");
    next();
});


const Product = mongoose.model('product', productSchema)

export default Product
