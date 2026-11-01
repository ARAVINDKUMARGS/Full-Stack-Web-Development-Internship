import { Router } from 'express';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import { validateObjectId } from '../middleware/errorHandler.js';

const router = Router();

router.route('/').post(createContact).get(getContacts);
router
  .route('/:id')
  .all(validateObjectId)
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

export default router;
