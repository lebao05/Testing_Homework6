const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

function initDatabase() {
    db.serialize(() => {
        db.run('DROP TABLE IF EXISTS coupon_usage');
        db.run('DROP TABLE IF EXISTS coupons');
        db.run('DROP TABLE IF EXISTS users');
        db.run('DROP TABLE IF EXISTS products');
        db.run('DROP TABLE IF EXISTS categories');
        db.run('DROP TABLE IF EXISTS orders');

        // Create Categories Table
        db.run(`CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )`);

        // Create Coupons Table
        db.run(`CREATE TABLE coupons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            type TEXT DEFAULT 'percent',
            discount_value INTEGER,
            min_order_amount INTEGER DEFAULT 0,
            expired_at DATETIME,
            is_active INTEGER DEFAULT 1,
            max_uses_per_user INTEGER DEFAULT 1
        )`);

        // Create Coupon Usage Table
        db.run(`CREATE TABLE coupon_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coupon_id INTEGER,
            user_id INTEGER,
            used_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Create Users Table
        // Added columns for Phase 2 & 3: login_attempts, locked_until, reset_token, shipping_address, phone
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            password TEXT,
            role TEXT DEFAULT 'user',
            login_attempts INTEGER DEFAULT 0,
            locked_until DATETIME,
            reset_token TEXT,
            shipping_address TEXT,
            phone TEXT
        )`);

        // Create Products Table
        db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price INTEGER,
            description TEXT,
            imageUrl TEXT,
            category_id INTEGER
        )`);

        // Create Orders Table
        db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount INTEGER,
            status TEXT DEFAULT 'pending',
            shipping_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Categories
        const insertCategory = db.prepare('INSERT INTO categories (name) VALUES (?)');
        insertCategory.run('Điện thoại');
        insertCategory.run('Laptop');
        insertCategory.run('Phụ kiện');
        insertCategory.finalize();

        // Seed Users
        const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
        insertUser.run('Admin User', 'admin@eshop.com', 'Admin123!', 'admin');
        insertUser.run('User', 'lgbao23@clc.fitus.edu.vn', 'Admin123!', 'admin');
        insertUser.run('Test User', 'test@eshop.com', 'Test1234!', 'user');
        insertUser.finalize();

        // Seed Products
        const insertProduct = db.prepare('INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)');
        insertProduct.run('iPhone 15 Pro Max', 30000000, 'Điện thoại cao cấp của Apple', 'https://placehold.co/300x300/png?text=iPhone+15', 1);
        insertProduct.run('Samsung Galaxy S24 Ultra', 28000000, 'Màn hình hiển thị xuất sắc, camera siêu zoom', 'https://placehold.co/300x300/png?text=Samsung+S24', 1);
        insertProduct.run('MacBook Pro M3', 45000000, 'Laptop chuyên nghiệp mạnh mẽ', 'https://placehold.co/300x300/png?text=Macbook+Pro', 2);
        insertProduct.run('Tai nghe AirPods Pro 2', 6000000, 'Chống ồn chủ động xuất sắc', 'https://placehold.co/300x300/png?text=AirPods+Pro', 3);
        insertProduct.run('Bàn phím cơ Keychron Q1', 4000000, 'Gõ cực sướng, thiết kế kim loại', 'https://placehold.co/300x300/png?text=Keychron+Q1', 3);
        insertProduct.finalize();

        // Seed Coupons
        const insertCoupon = db.prepare('INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?, ?)');
        insertCoupon.run('SAVE10', 'percent', 10, 300000, '2099-12-31', 1, 1);   // 10% off, min 300k, valid
        insertCoupon.run('BIGBUY', 'fixed', 50000, 500000, '2099-12-31', 1, 1);  // 50k off, min 500k, valid
        insertCoupon.run('VIP100', 'fixed', 100000, 300000, '2099-12-31', 1, 2); // 100k off, min 300k, max 2 uses
        insertCoupon.run('EXPIRED', 'percent', 20, 100000, '2020-01-01', 1, 1);  // 20% off, EXPIRED
        insertCoupon.finalize();
        // Seed Orders
        // Seed Orders for BVA-FR11-05
        // Seed Orders for DT-FR13-01
        const insertOrder = db.prepare(`
    INSERT INTO orders (
        user_id,
        total_amount,
        status,
        shipping_address,
        created_at
    ) VALUES (?, ?, ?, ?, ?)
`);

        const address = '123 Nguyen Hue, District 1, Ho Chi Minh City';

        // 1 Delivered order (counts toward revenue)
        insertOrder.run(
            2,
            600000,
            'delivered',
            address,
            '2026-07-01 10:00:00'
        );

        // 1 Pending order
        insertOrder.run(
            2,
            100000,
            'pending',
            address,
            '2026-07-02 10:00:00'
        );

        // 1 Processing / Confirmed order
        insertOrder.run(
            2,
            100000,
            'shipping',      // change to 'confirmed' if your system uses confirmed
            address,
            '2026-07-03 10:00:00'
        );

        insertOrder.run(
            2,
            100000,
            'confirmed',         // change to 'shipping' if your system uses shipping
            address,
            '2026-07-04 10:00:00'
        );

        // 1 Cancelled order
        insertOrder.run(
            2,
            100000,
            'canceled',       // change to 'canceled' if your system uses canceled
            address,
            '2026-07-05 10:00:00'
        );

        // Additional orders for cancel_order testing (to avoid mutation conflict between test cases)
        // Order ID 6: pendingOrderIdXSS (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-06 10:00:00');
        // Order ID 7: pendingOrderIdExtra (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-07 10:00:00');
        // Order ID 8: pendingOrderIdInvalidJSON (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-08 10:00:00');
        // Order ID 9: pendingOrderIdMissingCT (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-09 10:00:00');
        // Order ID 10: pendingOrderIdExpiredSession (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-10 10:00:00');
        // Order ID 11: rateLimitOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-11 10:00:00');
        // Order ID 12: concurrentOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-12 10:00:00');
        // Order ID 13: transitionOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-13 10:00:00');
        // Order ID 14: schemaOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-14 10:00:00');
        // Order ID 15: verificationOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-15 10:00:00');
        // Order ID 16: concurrentUpdateOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-16 10:00:00');
        // Order ID 17: timestampOrderId (mutates)
        insertOrder.run(2, 100000, 'pending', address, '2026-07-17 10:00:00');
        // Order ID 18: refundedOrderId (does not mutate because status is delivered, causing 400 Bad Request)
        insertOrder.run(2, 100000, 'delivered', address, '2026-07-18 10:00:00');
        // Order ID 19: expiredWindowOrderId (does not mutate because status is delivered, causing 400 Bad Request)
        insertOrder.run(2, 100000, 'delivered', address, '2026-07-19 10:00:00');
        // Order ID 20: otherUserOrderId (belongs to user 3, causing 404/403 when user 2 accesses it)
        insertOrder.run(3, 100000, 'pending', address, '2026-07-20 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-21 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-22 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-23 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-24 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-25 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-26 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-27 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-28 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-29 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-30 10:00:00');
        insertOrder.run(3, 100000, 'pending', address, '2026-07-31 10:00:00');


        // const insertOrder = db.prepare(`
        //     INSERT INTO orders (
        //         user_id,
        //         total_amount,
        //         status,  
        //         shipping_address,
        //         created_at
        //     ) VALUES (?, ?, ?, ?, ?)
        // `);

        // insertOrder.run(
        //     2,
        //     30000000,
        //     'pending',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-01 09:30:00'
        // );

        // insertOrder.run(
        //     2,
        //     34000000,
        //     'processing',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-02 14:15:00'
        // );

        // insertOrder.run(
        //     2,
        //     45000000,
        //     'shipped',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-03 10:45:00'
        // );

        // insertOrder.run(
        //     2,
        //     6000000,
        //     'delivered',
        //     '123 Nguyen Hue, District 1, Ho Chi Minh City',
        //     '2026-07-04 18:20:00'
        // );

        // insertOrder.run(
        //     1,
        //     28000000,
        //     'cancelled',
        //     '456 Le Loi, District 3, Ho Chi Minh City',
        //     '2026-07-05 11:00:00'
        // );

        insertOrder.finalize();
        console.log('Database initialized and seeded (Phase 2).');
    });
}

initDatabase();

module.exports = db;
