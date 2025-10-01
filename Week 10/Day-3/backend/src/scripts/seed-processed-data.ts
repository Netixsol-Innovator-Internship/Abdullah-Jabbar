import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductsService } from '../products/products.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  console.log('🌱 Starting database seeding...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  try {
    // Load processed products data
    const dataFile = path.join(
      __dirname,
      '../../dataset/processed_products.json',
    );

    if (!fs.existsSync(dataFile)) {
      console.error(
        '❌ Processed products file not found. Run preprocessing script first:',
      );
      console.error('   node src/scripts/preprocess-csv-data.js');
      process.exit(1);
    }

    const productsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    console.log(`📦 Found ${productsData.length} products to seed`);

    // Clear existing products (optional)
    const { products: existingProducts } = await productsService.findAll();
    if (existingProducts.length > 0) {
      console.log(
        `🗑️  Clearing ${existingProducts.length} existing products...`,
      );
      // Note: Add a method to clear all products if needed
      // await productsService.clearAll();
    }

    // Seed products
    let successCount = 0;
    let errorCount = 0;

    console.log('🚀 Seeding products...');
    for (const productData of productsData) {
      try {
        await productsService.create(productData);
        successCount++;

        if (successCount % 10 === 0) {
          console.log(
            `   ✅ Seeded ${successCount}/${productsData.length} products`,
          );
        }
      } catch (error) {
        errorCount++;
        console.error(
          `   ❌ Error seeding product "${productData.name}":`,
          error.message,
        );
      }
    }

    console.log('\n🎉 Seeding completed!');
    console.log(`✅ Successfully seeded: ${successCount} products`);
    console.log(`❌ Failed to seed: ${errorCount} products`);

    // Generate seeding summary
    const categories = await productsService.getCategories();
    const brands = await productsService.getBrands();

    console.log('\n📊 Database Summary:');
    console.log(`Total products in database: ${successCount}`);
    console.log(`Categories: ${categories.length}`);
    console.log(`Brands: ${brands.length}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
