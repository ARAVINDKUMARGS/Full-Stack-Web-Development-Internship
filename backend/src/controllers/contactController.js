import { Contact } from '../models/Contact.js';
import { asyncHandler, HttpError } from '../middleware/errorHandler.js';

const FIELDS = ['name', 'email', 'phone', 'company', 'notes'];

// Whitelist fields so clients can never set _id, timestamps, etc.
const pick = (body = {}) =>
  Object.fromEntries(FIELDS.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createContact = asyncHandler(async (req, res) => {
  const contact = await Contact.create(pick(req.body));
  res.status(201).json({ success: true, data: contact });
});

export const getContacts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const search = String(req.query.search || '').trim().slice(0, 100);

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { phone: rx }, { company: rx }];
  }

  const [data, total] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Contact.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  });
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new HttpError(404, 'Contact not found');
  res.json({ success: true, data: contact });
});

export const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, pick(req.body), {
    new: true,
    runValidators: true,
  });
  if (!contact) throw new HttpError(404, 'Contact not found');
  res.json({ success: true, data: contact });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) throw new HttpError(404, 'Contact not found');
  res.json({ success: true, message: 'Contact deleted', data: { _id: contact._id } });
});
