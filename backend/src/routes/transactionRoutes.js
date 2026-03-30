import express from 'express';
import { transactionController } from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// All transaction routes are protected
router.use(authenticateToken);

router.get('/categories', transactionController.getCategories);
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.delete('/:id', transactionController.deleteTransaction);
router.post('/import', transactionController.importTransactions);
router.post('/import-csv', upload.single('file'), transactionController.importCSV);

export default router;
