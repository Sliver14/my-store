import productModel from '@/lib/models/productModel.js';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/configs/mongoDB.js';
import fs from 'fs/promises';
import path from 'path';

async function loadLocalProducts() {
    try {
        const filePath = path.join(process.cwd(), 'lib', 'data', 'products.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(data);
        if (Array.isArray(json)) return json;
        return [];
    } catch (e) {
        return [];
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
        const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '20', 10), 1), 100);
        const q = (searchParams.get('search') || '').trim();
        const categoryParam = searchParams.get('category') || '';
        const subCategoryParam = searchParams.get('subCategory') || '';
        const sortType = searchParams.get('sort') || 'relevant';
        const minPriceParam = searchParams.get('minPrice');
        const maxPriceParam = searchParams.get('maxPrice');
        const minPrice = minPriceParam !== null && !isNaN(parseFloat(minPriceParam)) ? parseFloat(minPriceParam) : undefined;
        const maxPrice = maxPriceParam !== null && !isNaN(parseFloat(maxPriceParam)) ? parseFloat(maxPriceParam) : undefined;

        const useJsonProducts = process.env.USE_JSON_PRODUCTS === 'true';
        const hasMongo = !!process.env.MONGODB_URI && !useJsonProducts;

        // Common query params
        const categories = categoryParam ? categoryParam.split(',').filter(Boolean) : [];
        const subCategories = subCategoryParam ? subCategoryParam.split(',').filter(Boolean) : [];

        if (!hasMongo || useJsonProducts) {
            // Local JSON fallback
            const all = await loadLocalProducts();

            const filtered = all.filter((p) => {
                let ok = true;
                if (q) {
                    const hay = `${p.name || ''} ${p.description || ''}`.toLowerCase();
                    ok = ok && hay.includes(q.toLowerCase());
                }
                if (categories.length) ok = ok && categories.includes(p.category);
                if (subCategories.length) ok = ok && subCategories.includes(p.subCategory);
                if (typeof minPrice === 'number') ok = ok && (p.price || 0) >= minPrice;
                if (typeof maxPrice === 'number') ok = ok && (p.price || 0) <= maxPrice;
                return ok;
            });

            let sorted = [...filtered];
            if (sortType === 'low-high') sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            else if (sortType === 'high-low') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            else if (sortType === 'newest') sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
            else if (sortType === 'bestseller') sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (b.date || 0) - (a.date || 0));
            else if (q) {
                // simple relevance: name match first
                sorted.sort((a, b) => {
                    const an = (a.name || '').toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
                    const bn = (b.name || '').toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
                    return bn - an;
                });
            } else {
                sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
            }

            const total = sorted.length;
            const skip = (page - 1) * limit;
            const items = sorted.slice(skip, skip + limit).map((p) => ({
                _id: p._id || p.id || String(p.name || '') + String(p.date || ''),
                name: p.name,
                price: p.price,
                image: p.image,
                category: p.category,
                subCategory: p.subCategory,
                sizes: p.sizes,
                bestseller: !!p.bestseller,
                date: p.date,
            }));
            const hasMore = skip + items.length < total;

            return NextResponse.json({ success: true, products: items, page, limit, total, hasMore });
        }

        // MongoDB path - with fallback to JSON on failure
        try {
            await connectDB();
        } catch (dbError) {
            console.log('MongoDB connection failed, falling back to JSON products:', dbError.message);
            // Fall back to JSON products
            const all = await loadLocalProducts();

            const filtered = all.filter((p) => {
                let ok = true;
                if (q) {
                    const hay = `${p.name || ''} ${p.description || ''}`.toLowerCase();
                    ok = ok && hay.includes(q.toLowerCase());
                }
                if (categories.length) ok = ok && categories.includes(p.category);
                if (subCategories.length) ok = ok && subCategories.includes(p.subCategory);
                if (typeof minPrice === 'number') ok = ok && (p.price || 0) >= minPrice;
                if (typeof maxPrice === 'number') ok = ok && (p.price || 0) <= maxPrice;
                return ok;
            });

            let sorted = [...filtered];
            if (sortType === 'low-high') sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            else if (sortType === 'high-low') sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            else if (sortType === 'newest') sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
            else if (sortType === 'bestseller') sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || (b.date || 0) - (a.date || 0));
            else if (q) {
                // simple relevance: name match first
                sorted.sort((a, b) => {
                    const an = (a.name || '').toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
                    const bn = (b.name || '').toLowerCase().includes(q.toLowerCase()) ? 1 : 0;
                    return bn - an;
                });
            } else {
                sorted.sort((a, b) => (b.date || 0) - (a.date || 0));
            }

            const total = sorted.length;
            const skip = (page - 1) * limit;
            const items = sorted.slice(skip, skip + limit).map((p) => ({
                _id: p._id || p.id || String(p.name || '') + String(p.date || ''),
                name: p.name,
                price: p.price,
                image: p.image,
                category: p.category,
                subCategory: p.subCategory,
                sizes: p.sizes,
                bestseller: !!p.bestseller,
                date: p.date,
            }));
            const hasMore = skip + items.length < total;

            return NextResponse.json({ success: true, products: items, page, limit, total, hasMore });
        }

        // Build filters
        const filter = {};
        if (q) {
            // Use text index when available
            filter.$text = { $search: q };
        }
        if (categories.length) {
            filter.category = { $in: categories };
        }
        if (subCategories.length) {
            filter.subCategory = { $in: subCategories };
        }
        if (typeof minPrice === 'number' || typeof maxPrice === 'number') {
            filter.price = {}
            if (typeof minPrice === 'number') filter.price.$gte = minPrice
            if (typeof maxPrice === 'number') filter.price.$lte = maxPrice
        }

        // Build sort
        let sort = {};
        if (sortType === 'low-high') sort = { price: 1 };
        else if (sortType === 'high-low') sort = { price: -1 };
        else if (sortType === 'newest') sort = { date: -1 };
        else if (sortType === 'bestseller') sort = { bestseller: -1, date: -1 };
        else if (q) sort = { score: { $meta: 'textScore' } }; // relevance
        else sort = { date: -1 };

        // Projection: only fields needed for listing
        const projection = q ? { name: 1, price: 1, image: 1, category: 1, subCategory: 1, bestseller: 1, date: 1, score: { $meta: 'textScore' } } : { name: 1, price: 1, image: 1, category: 1, subCategory: 1, bestseller: 1, date: 1 };

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            productModel.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),
            productModel.countDocuments(filter)
        ]);

        const hasMore = skip + items.length < total;

        return NextResponse.json({ success: true, products: items, page, limit, total, hasMore });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
