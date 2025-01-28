const express = require("express");
const router = express.Router();
const ctrlContact = require("../../controllers/contactsController");

router.get("/", ctrlContact.listContacts);

router.get("/:contactId", ctrlContact.getContactById);

router.post("/", ctrlContact.addContact);

router.delete("/:contactId", ctrlContact.removeContact);

router.put("/:contactId", ctrlContact.updateContact);

router.patch("/:contactId/favorite", ctrlContact.updateStatusContact);

module.exports = router;
