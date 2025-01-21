// const fs = require("fs").promises;
// const { nanoid } = require("nanoid");
// const path = require("path");

// const contactsPath = path.join(__dirname, "../models/contacts.json");

const Contact = require("../models/contacts");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9\-()+ ]+$/)
    .required(),
  favorite: Joi.boolean(),
});

// // const updateSchema = Joi.object({
// //   name: Joi.string().min(3).max(30),
// //   email: Joi.string().email(),
// //   phone: Joi.string().pattern(/^[0-9\-()+ ]+$/),
// // });

const listContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing required fields" });
    }
    const { name, email, phone, favorite } = req.body;

    const existingContact = await Contact.findOne({ email, phone });
    // console.log("Existing contact:", existingContact);
    if (existingContact) {
      return res
        .status(409)
        .json({ message: "Contact with this email or phone already exists." });
    }

    const newContact = await Contact.create({ name, email, phone, favorite });
    // console.log("New contact added:", newContact);

    res.status(201).json(newContact);
  } catch (error) {
    // console.error("Error adding contact:", error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { favorite = false } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { favorite },
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
