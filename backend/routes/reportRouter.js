// routes/reportRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/Auth.js';
import Invoice from '../models/invoiceModel.js';
import Payment from '../models/paymentModel.js';

const reportRouter = express.Router();

// Fetch payment and invoice data
reportRouter.get('/data', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const payments = await Payment.find(query);
    const invoices = await Invoice.find(query);
    
    res.json({ payments, invoices });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate summary reports
reportRouter.get('/summary', authMiddleware, async (req, res) => {
  try {
    // Total payments by status
    const paymentsByStatus = await Payment.aggregate([
      { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    // Total invoices by status
    const invoicesByStatus = await Invoice.aggregate([
      { $group: { _id: '$status', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
    ]);
    
    // Monthly payment trends
    const monthlyTrends = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      paymentsByStatus,
      invoicesByStatus,
      monthlyTrends
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export reports
reportRouter.get('/export', authMiddleware, async (req, res) => {
  try {
    const { type, format, startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    let data;
    if (type === 'payments') {
      data = await Payment.find(query).populate('user', 'name email');
    } else if (type === 'invoices') {
      data = await Invoice.find(query).populate('user', 'name email');
    } else {
      return res.status(400).json({ message: 'Invalid report type' });
    }
    
    // In a real application, you would format the data based on the requested format
    // For simplicity, we're just returning JSON
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default reportRouter;