const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone is required"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
