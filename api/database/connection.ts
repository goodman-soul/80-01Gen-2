import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'island-energy.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      image_url TEXT NOT NULL,
      room_count INTEGER NOT NULL DEFAULT 0,
      device_count INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      today_electricity REAL NOT NULL DEFAULT 0,
      today_water REAL NOT NULL DEFAULT 0,
      today_solar REAL NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      property_id TEXT NOT NULL,
      room_id TEXT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'online',
      metrics TEXT NOT NULL,
      last_update TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      room_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      guest_name TEXT NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      room_number TEXT NOT NULL,
      precooling TEXT,
      FOREIGN KEY (property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS energy_bills (
      id TEXT PRIMARY KEY,
      booking_id TEXT NOT NULL,
      property_name TEXT NOT NULL,
      room_number TEXT NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      total_electricity REAL NOT NULL,
      total_water REAL NOT NULL,
      electricity_cost REAL NOT NULL,
      water_cost REAL NOT NULL,
      solar_offset REAL NOT NULL,
      total_cost REAL NOT NULL,
      average_daily_cost REAL NOT NULL,
      saving_tips TEXT NOT NULL,
      daily_records TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      severity TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      device_id TEXT,
      property_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      acknowledged INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (property_id) REFERENCES properties(id)
    );

    CREATE TABLE IF NOT EXISTS monthly_trend (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL UNIQUE,
      electricity REAL NOT NULL,
      water REAL NOT NULL,
      cost REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS monthly_property_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      month TEXT NOT NULL,
      property_id TEXT NOT NULL,
      property_name TEXT NOT NULL,
      electricity REAL NOT NULL,
      water REAL NOT NULL,
      solar REAL NOT NULL,
      cost REAL NOT NULL,
      saving_rate REAL NOT NULL,
      UNIQUE(month, property_id)
    );
  `);

  const propCount = db.prepare('SELECT COUNT(*) as cnt FROM properties').get() as { cnt: number };
  if (propCount.cnt === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  const properties = [
    {
      id: 'p1',
      name: '海景壹号别墅',
      address: '海南省三亚市海棠湾',
      image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20beachfront%20villa%20with%20ocean%20view%20tropical%20island&image_size=landscape_16_9',
      room_count: 8,
      device_count: 24,
      status: 'active',
      today_electricity: 156.8,
      today_water: 2.3,
      today_solar: 45.2,
    },
    {
      id: 'p2',
      name: '椰林小筑民宿',
      address: '海南省三亚市亚龙湾',
      image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20tropical%20guesthouse%20surrounded%20by%20palm%20trees%20beach&image_size=landscape_16_9',
      room_count: 6,
      device_count: 18,
      status: 'active',
      today_electricity: 89.5,
      today_water: 1.8,
      today_solar: 32.1,
    },
    {
      id: 'p3',
      name: '日出海景公寓',
      address: '海南省陵水县清水湾',
      image_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20seaside%20apartment%20building%20sunrise%20view%20tropical&image_size=landscape_16_9',
      room_count: 12,
      device_count: 36,
      status: 'maintenance',
      today_electricity: 203.4,
      today_water: 3.1,
      today_solar: 67.8,
    },
  ];

  const insertProp = db.prepare(
    'INSERT INTO properties (id, name, address, image_url, room_count, device_count, status, today_electricity, today_water, today_solar) VALUES (@id, @name, @address, @image_url, @room_count, @device_count, @status, @today_electricity, @today_water, @today_solar)'
  );
  const insertProps = db.transaction((props: typeof properties) => {
    for (const p of props) insertProp.run(p);
  });
  insertProps(properties);

  const devices = [
    {
      id: 'd1', property_id: 'p1', room_id: 'r1', type: 'ac', name: '主卧空调', status: 'online',
      metrics: JSON.stringify({ power: 1200, setTemperature: 24, currentTemperature: 25, mode: 'cool', fanSpeed: 2 }),
      last_update: '2024-01-15T10:30:00Z',
    },
    {
      id: 'd2', property_id: 'p1', room_id: 'r1', type: 'water_heater', name: '主卧热水器', status: 'online',
      metrics: JSON.stringify({ power: 2000, temperature: 45, waterLevel: 80 }),
      last_update: '2024-01-15T10:28:00Z',
    },
    {
      id: 'd3', property_id: 'p1', room_id: null, type: 'pv', name: '屋顶光伏阵列', status: 'online',
      metrics: JSON.stringify({ power: 3500, dailyGeneration: 24.5, totalGeneration: 15680, efficiency: 92 }),
      last_update: '2024-01-15T10:35:00Z',
    },
    {
      id: 'd4', property_id: 'p1', room_id: null, type: 'water_tank', name: '主蓄水箱', status: 'online',
      metrics: JSON.stringify({ waterLevel: 65, dailyUsage: 2.3, inflowRate: 15 }),
      last_update: '2024-01-15T10:32:00Z',
    },
    {
      id: 'd5', property_id: 'p1', room_id: 'r2', type: 'ac', name: '客厅空调', status: 'warning',
      metrics: JSON.stringify({ power: 2500, setTemperature: 18, currentTemperature: 22, mode: 'cool', fanSpeed: 3 }),
      last_update: '2024-01-15T10:25:00Z',
    },
    {
      id: 'd6', property_id: 'p1', room_id: 'r3', type: 'ac', name: '次卧空调', status: 'online',
      metrics: JSON.stringify({ power: 0, setTemperature: 26, currentTemperature: 27, mode: 'auto', fanSpeed: 1 }),
      last_update: '2024-01-15T10:20:00Z',
    },
    {
      id: 'd7', property_id: 'p2', room_id: 'r4', type: 'ac', name: '海景房空调', status: 'error',
      metrics: JSON.stringify({ power: 0, setTemperature: 25, currentTemperature: 30, mode: 'cool', fanSpeed: 2 }),
      last_update: '2024-01-15T09:15:00Z',
    },
    {
      id: 'd8', property_id: 'p2', room_id: null, type: 'pv', name: '庭院光伏', status: 'online',
      metrics: JSON.stringify({ power: 1800, dailyGeneration: 12.3, totalGeneration: 8920, efficiency: 88 }),
      last_update: '2024-01-15T10:30:00Z',
    },
    {
      id: 'd9', property_id: 'p2', room_id: null, type: 'water_tank', name: '副蓄水箱', status: 'warning',
      metrics: JSON.stringify({ waterLevel: 25, dailyUsage: 1.8, inflowRate: 8 }),
      last_update: '2024-01-15T10:15:00Z',
    },
    {
      id: 'd10', property_id: 'p2', room_id: 'r5', type: 'water_heater', name: '花园房热水器', status: 'online',
      metrics: JSON.stringify({ power: 1500, temperature: 52, waterLevel: 90 }),
      last_update: '2024-01-15T10:28:00Z',
    },
    {
      id: 'd11', property_id: 'p3', room_id: null, type: 'pv', name: '楼顶光伏系统', status: 'online',
      metrics: JSON.stringify({ power: 5200, dailyGeneration: 35.8, totalGeneration: 24500, efficiency: 94 }),
      last_update: '2024-01-15T10:35:00Z',
    },
    {
      id: 'd12', property_id: 'p3', room_id: null, type: 'water_tank', name: '地下蓄水池', status: 'online',
      metrics: JSON.stringify({ waterLevel: 78, dailyUsage: 3.1, inflowRate: 22 }),
      last_update: '2024-01-15T10:32:00Z',
    },
  ];

  const insertDevice = db.prepare(
    'INSERT INTO devices (id, property_id, room_id, type, name, status, metrics, last_update) VALUES (@id, @property_id, @room_id, @type, @name, @status, @metrics, @last_update)'
  );
  const insertDevices = db.transaction((devs: typeof devices) => {
    for (const d of devs) insertDevice.run(d);
  });
  insertDevices(devices);

  const bookings = [
    {
      id: 'b1', room_id: 'r1', property_id: 'p1', guest_name: '张先生',
      check_in: '2024-01-15T14:00:00Z', check_out: '2024-01-20T12:00:00Z',
      status: 'checked-in', room_number: '101',
      precooling: JSON.stringify({ enabled: true, targetTemp: 24, currentTemp: 24, progress: 100, startTime: '2024-01-15T12:00:00Z' }),
    },
    {
      id: 'b2', room_id: 'r2', property_id: 'p1', guest_name: '李女士',
      check_in: '2024-01-15T16:00:00Z', check_out: '2024-01-18T12:00:00Z',
      status: 'upcoming', room_number: '102',
      precooling: JSON.stringify({ enabled: false, targetTemp: 24, currentTemp: 31, progress: 0, startTime: null }),
    },
    {
      id: 'b3', room_id: 'r3', property_id: 'p1', guest_name: '王先生一家',
      check_in: '2024-01-15T18:00:00Z', check_out: '2024-01-22T12:00:00Z',
      status: 'upcoming', room_number: '201',
      precooling: JSON.stringify({ enabled: true, targetTemp: 25, currentTemp: 29, progress: 40, startTime: '2024-01-15T14:00:00Z' }),
    },
    {
      id: 'b4', room_id: 'r4', property_id: 'p2', guest_name: '陈小姐',
      check_in: '2024-01-15T15:00:00Z', check_out: '2024-01-17T12:00:00Z',
      status: 'upcoming', room_number: '301',
      precooling: JSON.stringify({ enabled: true, targetTemp: 24, currentTemp: 27, progress: 57, startTime: '2024-01-15T13:00:00Z' }),
    },
    {
      id: 'b5', room_id: 'r5', property_id: 'p2', guest_name: '刘先生',
      check_in: '2024-01-14T14:00:00Z', check_out: '2024-01-15T12:00:00Z',
      status: 'checked-out', room_number: '302',
      precooling: null,
    },
  ];

  const insertBooking = db.prepare(
    'INSERT INTO bookings (id, room_id, property_id, guest_name, check_in, check_out, status, room_number, precooling) VALUES (@id, @room_id, @property_id, @guest_name, @check_in, @check_out, @status, @room_number, @precooling)'
  );
  const insertBookings = db.transaction((items: typeof bookings) => {
    for (const b of items) insertBooking.run(b);
  });
  insertBookings(bookings);

  const bills = [
    {
      id: 'bill1',
      booking_id: 'b1',
      property_name: '海景壹号别墅',
      room_number: '101',
      check_in: '2024-01-10',
      check_out: '2024-01-15',
      total_electricity: 78.5,
      total_water: 1.2,
      electricity_cost: 62.8,
      water_cost: 8.4,
      solar_offset: 15.6,
      total_cost: 55.6,
      average_daily_cost: 11.12,
      saving_tips: JSON.stringify([
        { id: 't1', title: '调高空调温度', description: '将空调温度从22°C调高到26°C，每晚可节省约3度电', savingAmount: 12.5, icon: 'thermometer' },
        { id: 't2', title: '缩短淋浴时间', description: '淋浴时间从15分钟减少到10分钟，每次可节水约30升', savingAmount: 5.2, icon: 'shower-head' },
        { id: 't3', title: '利用自然光', description: '白天拉开窗帘使用自然光，减少照明用电', savingAmount: 3.8, icon: 'sun' },
      ]),
      daily_records: JSON.stringify([
        { date: '01-10', electricity: 12.5, water: 0.2, cost: 10.5 },
        { date: '01-11', electricity: 18.2, water: 0.3, cost: 14.8 },
        { date: '01-12', electricity: 15.8, water: 0.25, cost: 12.9 },
        { date: '01-13', electricity: 16.5, water: 0.22, cost: 13.4 },
        { date: '01-14', electricity: 15.5, water: 0.23, cost: 11.0 },
      ]),
    },
  ];

  const insertBill = db.prepare(
    'INSERT INTO energy_bills (id, booking_id, property_name, room_number, check_in, check_out, total_electricity, total_water, electricity_cost, water_cost, solar_offset, total_cost, average_daily_cost, saving_tips, daily_records) VALUES (@id, @booking_id, @property_name, @room_number, @check_in, @check_out, @total_electricity, @total_water, @electricity_cost, @water_cost, @solar_offset, @total_cost, @average_daily_cost, @saving_tips, @daily_records)'
  );
  const insertBills = db.transaction((items: typeof bills) => {
    for (const b of items) insertBill.run(b);
  });
  insertBills(bills);

  const alerts = [
    {
      id: 'a1', type: 'high_consumption', severity: 'warning',
      title: '空调耗电异常',
      description: '海景壹号别墅 102 室空调连续运行超过4小时，功率2500W，建议检查是否忘关',
      device_id: 'd5', property_id: 'p1',
      timestamp: '2024-01-15T10:00:00Z', acknowledged: 0,
    },
    {
      id: 'a2', type: 'device_error', severity: 'error',
      title: '空调故障',
      description: '椰林小筑民宿 301 室空调通讯中断，无法远程控制',
      device_id: 'd7', property_id: 'p2',
      timestamp: '2024-01-15T09:15:00Z', acknowledged: 0,
    },
    {
      id: 'a3', type: 'maintenance', severity: 'info',
      title: '光伏板清洁提醒',
      description: '日出海景公寓光伏板效率下降5%，建议安排清洁维护',
      device_id: null, property_id: 'p3',
      timestamp: '2024-01-15T08:00:00Z', acknowledged: 1,
    },
    {
      id: 'a4', type: 'precooling', severity: 'info',
      title: '今日待预冷房间',
      description: '今日有3间房间需要预冷，请提前安排',
      device_id: null, property_id: 'p1',
      timestamp: '2024-01-15T08:30:00Z', acknowledged: 1,
    },
    {
      id: 'a5', type: 'high_consumption', severity: 'warning',
      title: '蓄水箱水位偏低',
      description: '椰林小筑民宿副蓄水箱水位降至25%，请关注供水情况',
      device_id: 'd9', property_id: 'p2',
      timestamp: '2024-01-15T10:15:00Z', acknowledged: 0,
    },
  ];

  const insertAlert = db.prepare(
    'INSERT INTO alerts (id, type, severity, title, description, device_id, property_id, timestamp, acknowledged) VALUES (@id, @type, @severity, @title, @description, @device_id, @property_id, @timestamp, @acknowledged)'
  );
  const insertAlerts = db.transaction((items: typeof alerts) => {
    for (const a of items) insertAlert.run(a);
  });
  insertAlerts(alerts);

  const trends = [
    { month: '2023-08', electricity: 2890, water: 52.3, cost: 2345 },
    { month: '2023-09', electricity: 2650, water: 48.1, cost: 2156 },
    { month: '2023-10', electricity: 2480, water: 45.2, cost: 2012 },
    { month: '2023-11', electricity: 2350, water: 42.8, cost: 1908 },
    { month: '2023-12', electricity: 2520, water: 46.5, cost: 2045 },
    { month: '2024-01', electricity: 3220, water: 59.2, cost: 2620 },
  ];

  const insertTrend = db.prepare(
    'INSERT INTO monthly_trend (month, electricity, water, cost) VALUES (@month, @electricity, @water, @cost)'
  );
  const insertTrends = db.transaction((items: typeof trends) => {
    for (const t of items) insertTrend.run(t);
  });
  insertTrends(trends);

  const monthlyProps = [
    { month: '2024-01', property_id: 'p1', property_name: '海景壹号别墅', electricity: 3256, water: 58.2, solar: 892, cost: 2684.5, saving_rate: 18.5 },
    { month: '2024-01', property_id: 'p2', property_name: '椰林小筑民宿', electricity: 1892, water: 42.5, solar: 528, cost: 1524.3, saving_rate: 22.1 },
    { month: '2024-01', property_id: 'p3', property_name: '日出海景公寓', electricity: 4521, water: 76.8, solar: 1256, cost: 3652.8, saving_rate: 15.8 },
  ];

  const insertMonthlyProp = db.prepare(
    'INSERT INTO monthly_property_stats (month, property_id, property_name, electricity, water, solar, cost, saving_rate) VALUES (@month, @property_id, @property_name, @electricity, @water, @solar, @cost, @saving_rate)'
  );
  const insertMonthlyProps = db.transaction((items: typeof monthlyProps) => {
    for (const m of items) insertMonthlyProp.run(m);
  });
  insertMonthlyProps(monthlyProps);

  console.log('✅ 数据库初始化完成，已插入种子数据');
}

export default db;
