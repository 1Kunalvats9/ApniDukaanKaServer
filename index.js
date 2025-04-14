// backend/index.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/auth.js"
import uploadRoutes from "./routes/upload.js"
import inventoryRoutes from "./routes/inventory.js"
import smsRoutes from "./routes/sms.js"
import checkoutRoutes from "./routes/checkout.js"

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/upload',uploadRoutes)
app.use('/api/inventory',inventoryRoutes)
app.use("/api/sms",smsRoutes)
app.use("/api/checkout",checkoutRoutes)

app.get('/', (req, res) => {
  res.send('API is running...');
});


const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected ✅');
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('DB connection error ❌:', err);
    process.exit(1);
  }
};

startServer();
