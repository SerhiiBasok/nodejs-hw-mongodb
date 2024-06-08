import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import pinoPretty from 'pino-pretty';
import cors from 'cors';
import { env } from './utils/env.js';
import { getAllContacts, getContactsById } from './services/contacts.js';

const PORT = env('PORT', 3000);

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();

      res.status(200).json({
        status: '200',
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve contacts',
        error: error.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactsById(contactId);

      if (!contact) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found',
        });
      }

      res.status(200).json({
        status: '200',
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(404).json({
        status: 'error',
        message: 'Failed to retrieve contacts',
        error: error.message,
      });
    }
  });

  const pretty = pinoPretty();

  app.use(
    pinoHttp({
      logger: pino(pretty),
    }),
  );

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
