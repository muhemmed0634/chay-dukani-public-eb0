// Vercel Serverless Function: /api/orders
// Vercel bu faylı avtomatik /api/orders endpoint-i kimi tanıyır
const fs = require('fs');
const path = require('path');

const IS_VERCEL = Boolean(
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NOW_REGION
);

// Vercel-də /tmp yeganə yazıla bilən qovluqdur
// Lokal inkişafda orders.json kök qovluqdadır
const SEED_FILE = path.join(__dirname, '..', 'orders.json');
const DB_FILE = IS_VERCEL
    ? '/tmp/orders.json'
    : (fs.existsSync(SEED_FILE) ? SEED_FILE : path.join(process.cwd(), 'orders.json'));

const SEED_ORDERS = [
    {
        id: "ORD-4848",
        fullName: "Elvin Qasımov",
        phone: "+994 50 712 51 01",
        location: "Bakı şəhəri",
        product: "Saf Təbii Zeytun Yağı (Soyuq Sıxım)",
        quantity: "2 litr",
        notes: "Təcili çatdırılma",
        status: "Yeni",
        createdAt: "2026-08-19T17:43:14.602Z"
    },
    {
        id: "ORD-1001",
        fullName: "Rəşad Əliyev",
        phone: "+994 50 123 45 67",
        location: "Bakı şəhəri",
        product: "Təbii Lənkəran Qara Çayı (May yığımı)",
        quantity: "2 kq",
        notes: "Nəsimi rayonuna saat 18:00-dan sonra çatdırılsın",
        status: "Yeni",
        createdAt: "2026-08-19T13:41:59.016Z"
    },
    {
        id: "ORD-1002",
        fullName: "Leyla Məmmədova",
        phone: "+994 55 987 65 43",
        location: "Sumqayıt şəhəri",
        product: "Saf Təbii Zeytun Yağı (Soyuq Sıxım)",
        quantity: "3 litr",
        notes: "Zəhmət olmasa şüşə qablaşdırmada olsun",
        status: "Çatdırıldı",
        createdAt: "2026-08-18T17:41:59.017Z"
    }
];

let inMemoryOrders = null;

function initDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const seedData = fs.existsSync(SEED_FILE)
                ? fs.readFileSync(SEED_FILE, 'utf-8')
                : JSON.stringify(SEED_ORDERS, null, 2);
            fs.writeFileSync(DB_FILE, seedData, 'utf-8');
        }
    } catch (err) {
        console.warn('DB init warning:', err.message);
    }
}

function getOrders() {
    try {
        initDB();
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, 'utf-8');
            const parsed = JSON.parse(raw || '[]');
            if (Array.isArray(parsed)) {
                inMemoryOrders = parsed;
                return inMemoryOrders;
            }
        }
    } catch (err) {
        console.warn('Read error, falling back to memory:', err.message);
    }
    if (!inMemoryOrders) inMemoryOrders = [...SEED_ORDERS];
    return inMemoryOrders;
}

function saveOrders(orders) {
    inMemoryOrders = orders;
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf-8');
        return true;
    } catch (err) {
        console.warn('Write error, memory only:', err.message);
        return false;
    }
}

function parseBody(body) {
    if (!body) return {};
    if (typeof body === 'object' && !Buffer.isBuffer(body)) return body;
    try { return JSON.parse(body.toString()); } catch { return {}; }
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    }

    const sendJson = (code, data) => {
        if (typeof res.status === 'function' && typeof res.json === 'function') {
            return res.status(code).json(data);
        }
        res.statusCode = code;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify(data));
    };

    try {
        if (req.method === 'GET') {
            const orders = getOrders();
            return sendJson(200, { success: true, count: orders.length, data: orders });
        }

        if (req.method === 'POST') {
            const body = parseBody(req.body);
            const { fullName, phone, location, product, quantity, notes } = body;

            if (!fullName || !String(fullName).trim())
                return sendJson(400, { success: false, error: 'Ad, soyad mütləq qeyd olunmalıdır.' });
            if (!phone || !String(phone).trim())
                return sendJson(400, { success: false, error: 'Telefon nömrəsi mütləq qeyd olunmalıdır.' });

            const orders = getOrders();
            const newOrder = {
                id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
                fullName: String(fullName).trim(),
                phone: String(phone).trim(),
                location: location ? String(location).trim() : 'Bakı',
                product: product ? String(product).trim() : 'Təbii Lənkəran Çayı & Zeytun Yağı',
                quantity: quantity ? String(quantity).trim() : '1 ədəd / 1 kq',
                notes: notes ? String(notes).trim() : '',
                status: 'Yeni',
                createdAt: new Date().toISOString()
            };
            orders.unshift(newOrder);
            saveOrders(orders);
            return sendJson(201, { success: true, message: 'Sifarişiniz uğurla qəbul edildi!', data: newOrder });
        }

        if (req.method === 'PATCH' || req.method === 'PUT') {
            const body = parseBody(req.body);
            const { id, status } = body;
            if (!id || !status)
                return sendJson(400, { success: false, error: 'Sifariş ID-si və yeni status tələb olunur.' });

            const orders = getOrders();
            const idx = orders.findIndex(o => o.id === id);
            if (idx === -1)
                return sendJson(404, { success: false, error: 'Sifariş tapılmadı.' });

            orders[idx].status = status;
            orders[idx].updatedAt = new Date().toISOString();
            saveOrders(orders);
            return sendJson(200, { success: true, message: 'Sifariş statusu yeniləndi.', data: orders[idx] });
        }

        if (req.method === 'DELETE') {
            const id = (req.query || {}).id || parseBody(req.body).id;
            if (!id)
                return sendJson(400, { success: false, error: 'Silinəcək sifarişin ID-si tələb olunur.' });

            let orders = getOrders();
            const before = orders.length;
            orders = orders.filter(o => o.id !== id);
            if (orders.length === before)
                return sendJson(404, { success: false, error: 'Sifariş tapılmadı.' });

            saveOrders(orders);
            return sendJson(200, { success: true, message: 'Sifariş uğurla silindi.' });
        }

        res.setHeader('Allow', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        return sendJson(405, { success: false, error: 'Method Not Allowed' });

    } catch (error) {
        console.error('API error:', error);
        return sendJson(500, { success: false, error: 'Server xətası baş verdi.', details: error.message });
    }
};
