import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// Middleware to check admin status - basic version
// In a real app, verify a secure token (JWT or session) instead of relying on frontend trust
router.use((req, res, next) => {
  // Add authentication check here later
  next();
});

// --- DASHBOARD ---
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await prisma.orders.count();
    const totalCustomers = await prisma.users.count({ where: { is_admin: false } });
    const totalProducts = await prisma.products.count();
    const revenueAggr = await prisma.orders.aggregate({
      _sum: { total: true },
      where: { payment_status: 'verified' }
    });

    const recentOrders = await prisma.orders.findMany({
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const serializedOrders = recentOrders.map(order => ({
      ...order,
      id: order.id.toString(),
      total: Number(order.total)
    }));

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue: Number(revenueAggr._sum.total || 0),
        revenueTrend: '+12%',
        ordersTrend: '+5%',
      },
      recentOrders: serializedOrders
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to load stats' });
  }
});

// --- PRODUCTS ---
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [total, products] = await Promise.all([
      prisma.products.count({ where }),
      prisma.products.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' }
      })
    ]);

    res.json({
      success: true,
      products: products.map(p => ({
        ...p,
        id: p.id.toString(),
        price: Number(p.price),
        mrp: p.mrp ? Number(p.mrp) : null
      })),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ success: false, message: 'Failed to load products' });
  }
});

router.post('/products', async (req, res) => {
  try {
    const data = req.body;
    const product = await prisma.products.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        mrp: data.mrp,
        category: data.category,
        badge: data.badge,
        image: data.image,
        description: data.description,
        sizes: data.sizes,
        is_wholesale: data.is_wholesale,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    res.json({ success: true, product: { ...product, id: product.id.toString(), price: Number(product.price) } });
  } catch (error) {
    console.error('Admin create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;
    const product = await prisma.products.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        mrp: data.mrp,
        category: data.category,
        badge: data.badge,
        image: data.image,
        description: data.description,
        sizes: data.sizes,
        is_wholesale: data.is_wholesale,
        updated_at: new Date()
      }
    });
    res.json({ success: true, product: { ...product, id: product.id.toString(), price: Number(product.price) } });
  } catch (error) {
    console.error('Admin update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    await prisma.products.delete({ where: { id: BigInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

// --- ORDERS ---
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '', status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { order_number: { contains: search, mode: 'insensitive' } },
        { customer_name: { contains: search, mode: 'insensitive' } },
        { customer_email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.orders.count({ where }),
      prisma.orders.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' }
      })
    ]);

    res.json({
      success: true,
      orders: orders.map(o => ({
        ...o,
        id: o.id.toString(),
        total: Number(o.total)
      })),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load orders' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await prisma.orders.update({
      where: { id: BigInt(req.params.id) },
      data: { status, updated_at: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

// --- CUSTOMERS ---
router.get('/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [total, customers] = await Promise.all([
      prisma.users.count({ where }),
      prisma.users.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        select: { id: true, name: true, email: true, phone: true, is_admin: true, created_at: true }
      })
    ]);

    res.json({
      success: true,
      customers: customers.map(c => ({ ...c, id: c.id.toString() })),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load customers' });
  }
});

// --- CATEGORIES ---
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({ orderBy: { id: 'desc' } });
    res.json({ success: true, categories: categories.map(c => ({ ...c, id: c.id.toString() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load categories' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const data = req.body;
    const category = await prisma.categories.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        is_active: data.is_active,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    res.json({ success: true, category: { ...category, id: category.id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;
    const category = await prisma.categories.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        is_active: data.is_active,
        updated_at: new Date()
      }
    });
    res.json({ success: true, category: { ...category, id: category.id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await prisma.categories.delete({ where: { id: BigInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// --- COLLECTIONS ---
router.get('/collections', async (req, res) => {
  try {
    const collections = await prisma.collections.findMany({ orderBy: { id: 'desc' } });
    res.json({ success: true, collections: collections.map(c => ({ ...c, id: c.id.toString() })) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load collections' });
  }
});

router.post('/collections', async (req, res) => {
  try {
    const data = req.body;
    const collection = await prisma.collections.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        is_active: data.is_active,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    res.json({ success: true, collection: { ...collection, id: collection.id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create collection' });
  }
});

router.put('/collections/:id', async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;
    const collection = await prisma.collections.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        is_active: data.is_active,
        updated_at: new Date()
      }
    });
    res.json({ success: true, collection: { ...collection, id: collection.id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update collection' });
  }
});

router.delete('/collections/:id', async (req, res) => {
  try {
    await prisma.collections.delete({ where: { id: BigInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete collection' });
  }
});

// --- COUPONS ---
router.get('/coupons', async (req, res) => {
  try {
    const coupons = await prisma.coupons.findMany({ orderBy: { id: 'desc' } });
    res.json({
      success: true,
      coupons: coupons.map(c => ({
        ...c,
        id: c.id.toString(),
        value: Number(c.value),
        min_order_amount: Number(c.min_order_amount)
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load coupons' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const data = req.body;
    const coupon = await prisma.coupons.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        min_order_amount: data.min_order_amount,
        usage_limit: data.usage_limit,
        expires_at: data.expires_at ? new Date(data.expires_at) : null,
        is_active: data.is_active,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
    res.json({
      success: true,
      coupon: { ...coupon, id: coupon.id.toString(), value: Number(coupon.value), min_order_amount: Number(coupon.min_order_amount) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const id = BigInt(req.params.id);
    const data = req.body;
    const coupon = await prisma.coupons.update({
      where: { id },
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        min_order_amount: data.min_order_amount,
        usage_limit: data.usage_limit,
        expires_at: data.expires_at ? new Date(data.expires_at) : null,
        is_active: data.is_active,
        updated_at: new Date()
      }
    });
    res.json({
      success: true,
      coupon: { ...coupon, id: coupon.id.toString(), value: Number(coupon.value), min_order_amount: Number(coupon.min_order_amount) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update coupon' });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    await prisma.coupons.delete({ where: { id: BigInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
});

// --- REVIEWS ---
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [total, reviews] = await Promise.all([
      prisma.reviews.count(),
      prisma.reviews.findMany({
        skip,
        take: Number(limit),
        orderBy: { created_at: 'desc' },
        include: {
          users: { select: { name: true } },
          products: { select: { name: true } }
        }
      })
    ]);

    res.json({
      success: true,
      reviews: reviews.map(r => ({
        ...r,
        id: r.id.toString(),
        user_id: r.user_id.toString(),
        product_id: r.product_id.toString(),
        user_name: r.users?.name,
        product_name: r.products?.name
      })),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load reviews' });
  }
});

router.put('/reviews/:id', async (req, res) => {
  try {
    const { is_approved } = req.body;
    await prisma.reviews.update({
      where: { id: BigInt(req.params.id) },
      data: { is_approved, updated_at: new Date() }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

router.delete('/reviews/:id', async (req, res) => {
  try {
    await prisma.reviews.delete({ where: { id: BigInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// --- SETTINGS ---
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    res.json({
      success: true,
      settings: settings.map(s => ({ ...s, id: s.id.toString() }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load settings' });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    // Iterate and upsert settings
    for (const [key, value] of Object.entries(settings)) {
      await prisma.settings.upsert({
        where: { key },
        update: { value: value?.toString() || '', updated_at: new Date() },
        create: { key, value: value?.toString() || '', created_at: new Date(), updated_at: new Date() }
      });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
});

export default router;
