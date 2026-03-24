import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import musicRoutes from './routes/music';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Thorn Music Backend API');
});

app.use('/api/music', musicRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
