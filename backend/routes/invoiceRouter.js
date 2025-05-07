// routes/invoiceRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/Auth.js';
import Invoice from '../models/invoiceModel.js';

const invoiceRouter = express.Router();

// Get all invoices for a user
invoiceRouter.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.params.userId });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invoice by ID
invoiceRouter.get('/:id', authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update invoice status
invoiceRouter.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default invoiceRouter;