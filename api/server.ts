import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database/connection';
import { notFoundHandler, errorHandler, sendSuccess } from './middleware/response';

import propertyRoutes from './routes/propertyRoutes';
import deviceRoutes from './routes/deviceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import billRoutes from './routes/billRoutes';
import alertRoutes from './routes/alertRoutes';
import statsRoutes from './routes/statsRoutes';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

initializeDatabase();

app.get('/api/health', (_req, res) => {
  sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: '海岛民宿能耗托管系统 API',
    version: '1.0.0',
  });
});

app.use('/api/properties', propertyRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🏝️  海岛民宿能耗托管系统 - 后端服务已启动                  ║
╠════════════════════════════════════════════════════════════╣
║  🚀 服务地址:  http://localhost:${PORT}                        ║
║  📊 健康检查:  http://localhost:${PORT}/api/health              ║
║  🗄️  数据库:    SQLite (data/island-energy.db)              ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
