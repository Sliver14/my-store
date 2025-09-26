import fs from 'fs/promises';
import path from 'path';

// Generate realistic product images based on category and product type
function generateProductImages(product) {
    const { category, subCategory, name } = product;
    
    // Using Picsum (Lorem Picsum) for reliable placeholder images
    // These are guaranteed to work and load quickly
    const baseUrl = 'https://picsum.photos';
    
    // Generate multiple images for each product (typically 2-4 images)
    const imageCount = Math.floor(Math.random() * 3) + 2; // 2-4 images
    const images = [];
    
    for (let i = 0; i < imageCount; i++) {
        // Generate random seed for different images
        const randomSeed = Math.floor(Math.random() * 1000) + (product._id ? product._id.slice(-3) : '001') + i;
        const width = 400;
        const height = 500;
        
        // Using Lorem Picsum with seed for consistent but varied images
        const imageUrl = `${baseUrl}/seed/${randomSeed}/${width}/${height}`;
        images.push(imageUrl);
    }
    
    return images;
}

async function addImagesToProducts() {
    try {
        console.log('🖼️  Adding images to products...');
        
        // Read the current products file
        const productsPath = path.join(process.cwd(), 'lib', 'data', 'products.json');
        const data = await fs.readFile(productsPath, 'utf-8');
        const products = JSON.parse(data);
        
        console.log(`📦 Found ${products.length} products`);
        
        // Add images to each product
        const updatedProducts = products.map((product, index) => {
            const images = generateProductImages(product);
            console.log(`🎨 Generated ${images.length} images for: ${product.name}`);
            
            return {
                ...product,
                image: images
            };
        });
        
        // Write the updated products back to file
        await fs.writeFile(productsPath, JSON.stringify(updatedProducts, null, 2));
        
        console.log(`✅ Successfully added images to ${updatedProducts.length} products!`);
        console.log(`📁 Updated file: ${productsPath}`);
        
        // Display a summary
        const totalImages = updatedProducts.reduce((sum, product) => sum + product.image.length, 0);
        console.log(`🖼️  Total images added: ${totalImages}`);
        
    } catch (error) {
        console.error('❌ Error adding images to products:', error);
        process.exit(1);
    }
}

// Run the script
addImagesToProducts();