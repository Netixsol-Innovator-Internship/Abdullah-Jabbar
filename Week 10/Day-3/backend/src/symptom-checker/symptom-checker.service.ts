import { Injectable, Logger } from '@nestjs/common';
import { Product } from '../products/products.schema';
import { ProductsService } from '../products/products.service';
import * as fs from 'fs';
import * as path from 'path';

export interface SymptomCheckerResponse {
  categories: string[];
  explanation: string;
  products: Product[];
  confidence: 'high' | 'medium' | 'low';
  source: 'mapping' | 'ai_fallback';
  clarification?: string;
}

export interface SymptomMapping {
  [symptom: string]: string[];
}

@Injectable()
export class SymptomCheckerService {
  private readonly logger = new Logger(SymptomCheckerService.name);
  private symptomMapping: SymptomMapping = {};

  constructor(private readonly productsService: ProductsService) {
    this.loadSymptomMapping();
  }

  // Main method for finding symptom mappings (used by AI as hints)
  async findMapping(symptomDescription: string): Promise<{
    categories: string[];
    confidence: 'high' | 'medium' | 'low';
    matchedKey?: string;
  }> {
    const normalizedSymptom = symptomDescription.toLowerCase().trim();

    // Try exact match first
    const exactMatch = this.symptomMapping[normalizedSymptom];
    if (exactMatch) {
      return {
        categories: exactMatch,
        confidence: 'high',
        matchedKey: normalizedSymptom,
      };
    }

    // Try partial matching with symptom words
    const symptomWords = normalizedSymptom
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .map((word) => word.replace(/[^\w]/g, ''));

    if (symptomWords.length === 0) {
      return { categories: [], confidence: 'low' };
    }

    // Find best match based on word overlap
    let bestMatch: { key: string; categories: string[]; score: number } = {
      key: '',
      categories: [],
      score: 0,
    };

    for (const [mappingKey, categories] of Object.entries(
      this.symptomMapping,
    )) {
      const keyWords = mappingKey
        .split(/\s+/)
        .filter((word) => word.length > 2)
        .map((word) => word.replace(/[^\w]/g, ''));

      const matchingWords = symptomWords.filter((symptomWord) =>
        keyWords.some((keyWord) => {
          return keyWord.includes(symptomWord) || symptomWord.includes(keyWord);
        }),
      );

      const score =
        matchingWords.length / Math.max(symptomWords.length, keyWords.length);

      if (score > bestMatch.score && score > 0.3) {
        bestMatch = { key: mappingKey, categories, score };
      }
    }

    if (bestMatch.score > 0) {
      const confidence =
        bestMatch.score >= 0.7
          ? 'high'
          : bestMatch.score >= 0.5
            ? 'medium'
            : 'low';
      return {
        categories: bestMatch.categories,
        confidence,
        matchedKey: bestMatch.key,
      };
    }

    // Try substring matching as last resort
    for (const [mappingKey, categories] of Object.entries(
      this.symptomMapping,
    )) {
      const hasWordMatch = symptomWords.some(
        (symptomWord) =>
          mappingKey.includes(symptomWord) ||
          (symptomWord.length > 3 &&
            mappingKey.includes(symptomWord.substring(0, -1))),
      );

      if (hasWordMatch) {
        return {
          categories,
          confidence: 'medium',
          matchedKey: mappingKey,
        };
      }
    }

    return { categories: [], confidence: 'low' };
  }

  // Legacy method for backward compatibility (simplified to use mapping only)
  async detectSymptom(
    symptomDescription: string,
  ): Promise<SymptomCheckerResponse> {
    const mapping = await this.findMapping(symptomDescription);

    if (mapping.categories.length > 0) {
      return this.buildMappingResponse(
        mapping.categories,
        symptomDescription,
        mapping.matchedKey || 'general symptoms',
      );
    }

    // Fallback response when no mapping found
    return {
      categories: [],
      explanation: `I understand you're experiencing "${symptomDescription}". While I couldn't find specific matches in our symptom database, I recommend consulting our product categories or speaking with a healthcare professional for personalized advice.`,
      products: [],
      confidence: 'low',
      source: 'mapping',
      clarification:
        'Could you describe your symptoms in more detail? For example, when did this start and how severe is it?',
    };
  }

  // Helper method to get categories for a symptom (used by AI service)
  getCategoriesForSymptom(symptomDescription: string): string[] {
    const normalizedSymptom = symptomDescription.toLowerCase().trim();

    // Check exact match first
    if (this.symptomMapping[normalizedSymptom]) {
      return this.symptomMapping[normalizedSymptom];
    }

    // Check partial matches
    const symptomWords = normalizedSymptom
      .split(/\s+/)
      .filter((word) => word.length > 2);

    for (const [key, categories] of Object.entries(this.symptomMapping)) {
      const keyWords = key.split(/\s+/);
      const hasWordMatch = keyWords.some((keyWord) =>
        symptomWords.some(
          (symptomWord) =>
            keyWord.includes(symptomWord) || symptomWord.includes(keyWord),
        ),
      );

      if (hasWordMatch) {
        return categories;
      }
    }

    return [];
  }

  private loadSymptomMapping(): void {
    try {
      // Look for the file in the project root directory
      const filePath = path.join(process.cwd(), 'symptom-mapping.json');
      const data = fs.readFileSync(filePath, 'utf8');
      this.symptomMapping = JSON.parse(data);
      this.logger.log(
        `Loaded ${Object.keys(this.symptomMapping).length} symptom mappings`,
      );
    } catch (error) {
      this.logger.error('Failed to load symptom mapping:', error);
      this.symptomMapping = {};
    }
  }

  private async buildMappingResponse(
    categories: string[],
    originalSymptom: string,
    matchedKey: string,
  ): Promise<SymptomCheckerResponse> {
    // Get products for these categories
    const allProducts = await this.getSimpleProductsForCategories(categories);
    const products = allProducts.slice(0, 3); // Limit to 3 products

    const explanation = this.generateMappingExplanation(
      originalSymptom,
      matchedKey,
      categories,
    );

    return {
      categories,
      explanation,
      products: this.cleanProductData(products),
      confidence: 'high',
      source: 'mapping',
    };
  }

  // Simple method to get products for categories
  private async getSimpleProductsForCategories(
    categories: string[],
  ): Promise<Product[]> {
    const allProducts: Product[] = [];

    for (const category of categories) {
      try {
        const products = await this.productsService.findByCategory(category);
        allProducts.push(...products);
      } catch (error) {
        console.error(
          `Error fetching products for category ${category}:`,
          error,
        );
      }
    }

    // Remove duplicates and return
    return allProducts.filter(
      (product, index, self) =>
        index ===
        self.findIndex(
          (p) => p.name === product.name && p.brand === product.brand,
        ),
    );
  }

  private generateMappingExplanation(
    originalSymptom: string,
    matchedKey: string,
    categories: string[],
  ): string {
    const categoryText =
      categories.length === 1
        ? categories[0]
        : `${categories.slice(0, -1).join(', ')} and ${categories[categories.length - 1]}`;

    return `Based on your description of "${originalSymptom}", I've identified this as related to "${matchedKey}". I recommend exploring ${categoryText} products that can help address these concerns.`;
  }

  private cleanProductData(products: Product[]): Product[] {
    return products.map(
      (product) =>
        ({
          name: product.name,
          category: product.category,
          brand: product.brand,
          description: product.description,
          price: product.price,
          ingredients: product.ingredients,
          dosage: product.dosage,
        }) as Product,
    );
  }

  // Method to add new symptom mappings (for future extensibility)
  addSymptomMapping(symptom: string, categories: string[]): void {
    this.symptomMapping[symptom.toLowerCase()] = categories;
    console.log(
      `Added new symptom mapping: ${symptom} -> ${categories.join(', ')}`,
    );
    // Note: This only updates the in-memory mapping, not the JSON file
  }

  // Method to get all available symptom mappings
  getAvailableSymptoms(): string[] {
    return Object.keys(this.symptomMapping);
  }
}
