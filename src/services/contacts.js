import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constans/index.js';
import { parseIsFavourite } from '../utils/parseFilterParams.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  let contactsQuery = ContactsCollection.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  if (filter.isFavourite !== undefined) {
    const parsedIsFavourite = parseIsFavourite(filter.isFavourite);
    if (parsedIsFavourite !== undefined) {
      contactsQuery = contactsQuery
        .where('isFavourite')
        .equals(parsedIsFavourite);
    }
  }

  const contactsCount = await ContactsCollection.countDocuments({ userId });
  const contacts = await contactsQuery.exec();
  const paginationData = calculatePaginationData(contactsCount, limit, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContacts = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  try {
    const rawResult = await ContactsCollection.findOneAndUpdate(
      { _id: contactId, userId },
      payload,
      {
        new: true,
        ...options,
      },
    );

    if (!rawResult) {
      console.log(
        `No document found for contact ID: ${contactId} and user ID: ${userId}`,
      );
      return null;
    }

    return {
      contact: rawResult,
      isNew: options.upsert ? true : false,
    };
  } catch (error) {
    console.error(
      `Error updating contact with ID: ${contactId} for user: ${userId}`,
      error,
    );
    throw error;
  }
};
