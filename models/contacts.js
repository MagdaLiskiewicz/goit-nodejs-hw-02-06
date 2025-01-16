const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "../models/contacts.json");

const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9\-()+ ]+$/)
    .required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9\-()+ ]+$/),
});

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(data);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );

  if (contacts.length === filteredContacts.length) {
    return null;
  }

  await fs.writeFile(contactsPath, JSON.stringify(filteredContacts, null, 2));

  return true;
};

const addContact = async (name, email, phone) => {
  const contacts = await listContacts();

  const isDuplicate = contacts.some(
    (contact) => contact.email === email || contact.phone === phone
  );

  if (isDuplicate) {
    return null;
  }

  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  schema,
  updateSchema,
};
