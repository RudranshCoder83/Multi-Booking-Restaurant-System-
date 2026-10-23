import { model, Schema } from "mongoose";
const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, minlength: 6 },
    phone: { type: String, trim: true, minlength: 10 },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" }
}, { timestamps: true });
UserSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});
export const User = model("User", UserSchema);
