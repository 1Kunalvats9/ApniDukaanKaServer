import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";
import inventoryRoutes from "./routes/inventory.js";
import smsRoutes from "./routes/sms.js";
import checkoutRoutes from "./routes/checkout.js";
import userRoutes from "./routes/user.js"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use('/api/user',userRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options if needed, like connectTimeoutMS, serverSelectionTimeoutMS
    });
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