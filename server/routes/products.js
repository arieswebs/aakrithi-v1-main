import express from 'express';
import { prisma } from '../../lib/prisma.js';

const router = express.Router();

// GET all products with filtering
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        const category = req.query.category || 'all';
        const sort = req.query.sort || 'latest';
        const isWholesale = req.query.is_wholesale === 'true';

        // Build search conditions
        const where = {
            is_wholesale: isWholesale
        };

        // Map short category slugs to full database names
        let dbCategory = category;
        const categoryMap = {
            'apparels': 'Designer Apparels & Ethnic Wear',
            'kutties': 'Kutties Collection - Traditional Kids Wear',
            'decors': 'Handloom Home Decors & Embroidered Sarees'
        };
        if (category && categoryMap[category.toLowerCase()]) {
            dbCategory = categoryMap[category.toLowerCase()];
        }

        if (category && category !== 'all') {
            where.category = {
                equals: dbCategory,
                mode: 'insensitive'
            };
        }

        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }

        // Build sorting criteria
        let orderBy = { created_at: 'desc' };

        if (sort === 'price-low') {
            orderBy = { price: 'asc' };
        } else if (sort === 'price-high') {
            orderBy = { price: 'desc' };
        } else if (sort === 'newest') {
            orderBy = { created_at: 'desc' };
        }

        const dbProducts = await prisma.products.findMany({
            where,
            orderBy
        });

        // Safely serialize database BigInt/Decimal types for JSON transmission
        const products = dbProducts.map(product => ({
            id: product.id.toString(),
            name: product.name,
            price: Number(product.price),
            category: product.category,
            badge: product.badge,
            image: product.image,
            sizes: product.sizes,
            slug: product.slug,
            is_wholesale: product.is_wholesale
        }));

        return res.json({ products });
    } catch (error) {
        console.error("API error fetching products:", error);
        return res.status(500).json({ error: "Failed to fetch products" });
    }
});

// GET single product details by slug
router.get('/details/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        let product = await prisma.products.findUnique({
            where: { slug }
        });

        // Fallback to searching by numerical ID
        if (!product && /^\d+$/.test(slug)) {
            const id = BigInt(slug);
            product = await prisma.products.findUnique({
                where: { id }
            });
        }

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        // Fetch related products
        const dbRelated = await prisma.products.findMany({
            where: {
                category: product.category,
                id: { not: product.id },
                is_wholesale: false
            },
            take: 4
        });

        // Serialize BigInt and Decimal types for Client Component
        const serializeProduct = (p) => ({
            id: p.id.toString(),
            name: p.name,
            price: Number(p.price),
            category: p.category,
            badge: p.badge,
            image: p.image,
            sizes: p.sizes,
            description: p.description,
            slug: p.slug,
            meta_title: p.meta_title,
            meta_description: p.meta_description,
            og_image: p.og_image,
            is_noindex: p.is_noindex,
            gallery: p.gallery,
            is_wholesale: p.is_wholesale,
            mrp: p.mrp ? Number(p.mrp) : null
        });

        return res.json({
            success: true,
            product: serializeProduct(product),
            relatedProducts: dbRelated.map(serializeProduct)
        });

    } catch (error) {
        console.error('Error fetching product details API:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

export default router;
