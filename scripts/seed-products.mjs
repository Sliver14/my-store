#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function generateProducts(count = 120) {
  const categories = ['MEN', 'WOMEN', 'KIDS']
  const subCategories = ['TOPWEAR', 'BOTTOMWEAR', 'WINTERWEAR']
  const adjectives = ['Classic', 'Premium', 'Comfy', 'Urban', 'Sport', 'Essential', 'Chill', 'Cozy', 'Slim', 'Oversized']
  const items = ['T-Shirt', 'Hoodie', 'Sweatshirt', 'Joggers', 'Shorts', 'Jacket', 'Puffer', 'Cardigan', 'Pants', 'Shirt']

  const now = Date.now()

  const products = Array.from({ length: count }).map((_, i) => {
    const category = randomChoice(categories)
    const subCategory = randomChoice(subCategories)
    const adj = randomChoice(adjectives)
    const item = randomChoice(items)
    const name = `${category} ${adj} ${item}`

    const daysAgo = Math.floor(Math.random() * 180)
    const price = Math.floor(Math.random() * 150) + 15 // 15 - 165

    return {
      _id: `seed_${i + 1}`,
      name,
      description: `${name} made with quality materials.`,
      price,
      // Leave empty to allow UI placeholder if you haven't configured images
      image: [],
      category,
      subCategory,
      sizes: ['S', 'M', 'L', 'XL'],
      bestseller: Math.random() < 0.2,
      date: now - daysAgo * 24 * 60 * 60 * 1000,
    }
  })

  return products
}

async function main() {
  try {
    const projectRoot = process.cwd()
    const outDir = path.join(projectRoot, 'lib', 'data')
    const outFile = path.join(outDir, 'products.json')

    try { await fs.mkdir(outDir, { recursive: true }) } catch {}

    const products = generateProducts()
    await fs.writeFile(outFile, JSON.stringify(products, null, 2))

    console.log(`Seeded ${products.length} products to ${outFile}`)
  } catch (e) {
    console.error('Failed to seed products.json:', e)
    process.exit(1)
  }
}

main()