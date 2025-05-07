// models/Invoice.js
import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  invoiceNumber: { type: String, required: true, unique: true },
  items: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], 
    default: 'draft' 
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Invoice', invoiceSchema);