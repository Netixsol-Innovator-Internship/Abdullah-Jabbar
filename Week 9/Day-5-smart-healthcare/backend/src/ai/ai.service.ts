import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.schema';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private productsService: ProductsService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    console.log('Gemini API Key status:', {
      exists: !!apiKey,
      length: apiKey?.length || 0,
      prefix: apiKey?.substring(0, 10) + '...' || 'undefined',
    });

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is required but not provided in environment variables',
      );
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
    });
  }

  async intentSearch(query: string) {
    try {
      const prompt = `You are a healthcare product recommendation system.  
The user may describe a health concern, symptom, or need in any way.  
Your task is to output a JSON object with two keys: "categories" and "ingredients".  

Rules:
- "categories" must only include values from this fixed list:  
  [Calcium Supplement, Detox, Energy Support, Herbal Supplement, Immune Support, Joint Health, Multivitamin, Omega-3 Supplement, Probiotics, Sleep Support]  
- "ingredients" should be common nutrients, compounds, or natural remedies directly related to the user’s concern (e.g., Calcium, Vitamin D, Magnesium).  
- If nothing matches confidently, return empty arrays.  
- Do not include extra text or explanations — output JSON only.  

Example:
{
  "categories": ["Vitamins", "Minerals"],
  "ingredients": ["Calcium", "Vitamin D", "Magnesium"]
}

User query: ${query}`;

      const result = await this.retryApiCall(async () => {
        return await this.model.generateContent(prompt);
      });
      const response = result.response.text();

      if (!response) {
        throw new Error('No response from AI');
      }

      // Clean up the response by removing markdown code blocks
      const cleanedResponse = this.extractJsonFromMarkdown(response);
      const parsed = JSON.parse(cleanedResponse);
      const products = await this.findProductsByIntent(
        parsed.categories,
        parsed.ingredients,
      );

      return {
        intent: parsed,
        products: this.cleanProductData(products),
        originalQuery: query,
      };
    } catch (error: unknown) {
      const errorInfo =
        error instanceof Error ? error : new Error(String(error));
      console.error('AI Search Error details:', {
        message: errorInfo.message,
        name: errorInfo.name,
        stack: errorInfo.stack,
        originalError: error,
        // Check if it's an OpenAI API specific error
        status: (error as any)?.status,
        code: (error as any)?.code,
        type: (error as any)?.type,
      });
      // Fallback to regular search with consistent response format
      const fallbackProducts = await this.productsService.search({ query });
      return {
        intent: {
          categories: [],
          ingredients: [],
        },
        products: Array.isArray(fallbackProducts)
          ? fallbackProducts
          : fallbackProducts.products || [],
        originalQuery: query,
        fallback: true,
        error:
          'AI service temporarily unavailable. Showing search results instead.',
      };
    }
  }

  async chatSupport(message: string, productId?: string) {
    try {
      let context = '';
      let suggestedProducts: Product[] = [];

      if (productId) {
        const product = await this.productsService.findById(productId);
        if (product) {
          context = `Current product context: ${product.name} - ${product.description}. Category: ${product.category}. Price: $${product.price}. Ingredients: ${product.ingredients?.join(', ')}.`;
        }
      } else {
        // If no specific product, try to find relevant products first
        try {
          const intentResult = await this.intentSearch(message);
          suggestedProducts = intentResult.products?.slice(0, 3) || [];

          if (suggestedProducts.length > 0) {
            context = `Based on your query, here are some relevant products from our database:
${suggestedProducts.map((p) => `- ${p.name} (${p.category}): ${p.description} - $${p.price}. Dosage: ${p.dosage}. Key ingredients: ${p.ingredients?.join(', ')}`).join('\n')}`;
          }
        } catch (error) {
          console.error('Error getting product suggestions for chat:', error);
        }
      }

      const prompt = `You are a friendly healthcare product assistant. Help users find suitable supplements and provide practical advice about dosages and ingredients.

${context}

Guidelines:
- If you found relevant products in the context, mention them by name with their dosages
- Focus on how the suggested products and their ingredients might help
- Include specific dosage recommendations from the product information
- Be encouraging and supportive
- Keep responses concise (2-4 sentences max)
- Only mention consulting healthcare professionals for very serious or concerning symptoms
- For common health concerns like low energy, sleep issues, digestive problems, joint stiffness - provide direct supplement advice

User message: ${message}`;

      const result = await this.retryApiCall(async () => {
        return await this.model.generateContent(prompt);
      });
      const response =
        result.response.text() ||
        'I apologize, but I could not generate a response at this time.';

      return {
        response,
        suggestedProducts: this.cleanProductData(suggestedProducts),
      };
    } catch (error: unknown) {
      const errorInfo =
        error instanceof Error ? error : new Error(String(error));
      console.error('Chat Support Error:', {
        message: errorInfo.message,
        name: errorInfo.name,
        stack: errorInfo.stack,
        originalError: error,
      });

      // Enhanced fallback response based on the message content
      let fallbackResponse =
        'I apologize, but I am currently unable to provide AI-powered assistance. ';
      let fallbackProducts: Product[] = [];

      // Try to get products even in fallback mode
      try {
        const searchResult = await this.productsService.search({
          query: message,
        });
        fallbackProducts = searchResult.products?.slice(0, 3) || [];
      } catch (searchError) {
        console.error('Fallback search also failed:', searchError);
      }

      // Enhanced keyword matching for common health concerns
      const lowercaseMessage = message.toLowerCase();
      if (
        lowercaseMessage.includes('sleep') ||
        lowercaseMessage.includes('insomnia')
      ) {
        fallbackResponse +=
          'For sleep issues, you might want to explore our Sleep Support products with ingredients like Melatonin and Valerian Root. ';
      } else if (
        lowercaseMessage.includes('energy') ||
        lowercaseMessage.includes('tired') ||
        lowercaseMessage.includes('fatigue')
      ) {
        fallbackResponse +=
          'For energy support, consider our Energy Support supplements and Multivitamins with B vitamins and Ginseng. ';
      } else if (
        lowercaseMessage.includes('immune') ||
        lowercaseMessage.includes('cold') ||
        lowercaseMessage.includes('flu')
      ) {
        fallbackResponse +=
          'For immune support, check out our Immune Support products with Vitamin C and Zinc. ';
      } else if (
        lowercaseMessage.includes('joint') ||
        lowercaseMessage.includes('pain') ||
        lowercaseMessage.includes('arthritis')
      ) {
        fallbackResponse +=
          'For joint health, explore our Joint Health supplements with Glucosamine and Chondroitin. ';
      } else if (
        lowercaseMessage.includes('digest') ||
        lowercaseMessage.includes('gut') ||
        lowercaseMessage.includes('stomach')
      ) {
        fallbackResponse +=
          'For digestive health, consider our Probiotics with beneficial bacteria like Lactobacillus. ';
      } else if (
        lowercaseMessage.includes('heart') ||
        lowercaseMessage.includes('cardiovascular')
      ) {
        fallbackResponse +=
          'For heart health, look into our Omega-3 Supplements with DHA and EPA. ';
      } else if (
        lowercaseMessage.includes('bone') ||
        lowercaseMessage.includes('calcium')
      ) {
        fallbackResponse +=
          'For bone health, consider our Calcium Supplements with Vitamin D. ';
      } else if (
        lowercaseMessage.includes('stress') ||
        lowercaseMessage.includes('anxiety')
      ) {
        fallbackResponse +=
          'For stress management, explore our Herbal Supplements with Ashwagandha and Chamomile. ';
      } else {
        fallbackResponse +=
          'Please browse our product categories to find supplements that match your health needs. ';
      }

      fallbackResponse +=
        'Always consult with a healthcare professional for personalized advice.';

      return {
        response: fallbackResponse,
        suggestedProducts: this.cleanProductData(fallbackProducts),
        fallback: true,
      };
    }
  }

  private async findProductsByIntent(
    categories: string[],
    ingredients: string[],
  ) {
    const categoryProducts = await Promise.all(
      categories.map((category) =>
        this.productsService.findByCategory(category),
      ),
    );

    const ingredientProducts =
      await this.productsService.findByIngredients(ingredients);

    // Combine and deduplicate results
    const allProducts = [...categoryProducts.flat(), ...ingredientProducts];
    const uniqueProducts = allProducts.filter(
      (product, index, self) =>
        index ===
        self.findIndex(
          (p) => p.name === product.name && p.brand === product.brand,
        ),
    );

    return uniqueProducts.slice(0, 10); // Limit to top 10 results
  }

  private extractJsonFromMarkdown(text: string): string {
    // Remove markdown code blocks if present
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonBlockRegex);

    if (match) {
      return match[1].trim();
    }

    // If no code blocks, return the text as is
    return text.trim();
  }

  private async retryApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries;
        const isRetryableError =
          error?.message?.includes('overloaded') ||
          error?.message?.includes('429') ||
          error?.message?.includes('503') ||
          error?.status === 429 ||
          error?.status === 503;

        if (isLastAttempt || !isRetryableError) {
          throw error;
        }

        // Exponential backoff: wait longer between each retry
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(
          `API call failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  async testApiConnection() {
    try {
      const result = await this.retryApiCall(async () => {
        return await this.model.generateContent('Say hello');
      });
      const response = result.response.text();

      return {
        success: true,
        response: response,
        message: 'Gemini API connection successful',
      };
    } catch (error: unknown) {
      const errorInfo =
        error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        error: errorInfo.message,
        details: {
          name: errorInfo.name,
          status: (error as any)?.status,
          code: (error as any)?.code,
          type: (error as any)?.type,
        },
      };
    }
  }

  private cleanProductData(products: Product[]) {
    return products.map((product) => ({
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description,
      price: product.price,
      ingredients: product.ingredients,
      dosage: product.dosage,
    }));
  }
}
