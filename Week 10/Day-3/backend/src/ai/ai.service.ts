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

  async chatSupport(
    message: string,
    productId?: string,
    symptomHint?: { symptom: string; category: string },
  ) {
    return this.processUserQuery(message, productId, symptomHint);
  }

  // Main method for processing user queries with symptom hints and medicine handling
  async processUserQuery(
    message: string,
    productId?: string,
    symptomHint?: { symptom: string; category: string },
  ) {
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
          suggestedProducts = (intentResult.products?.slice(0, 3) ||
            []) as Product[];

          if (suggestedProducts.length > 0) {
            context = `Based on your query, here are some relevant products from our database:
${suggestedProducts.map((p) => `- **${p.name}** (${p.category}): ${p.description} - $${p.price}. Dosage: ${p.dosage}. Key ingredients: ${p.ingredients?.join(', ')}`).join('\n')}`;
          }
        } catch (error) {
          console.error('Error getting product suggestions for chat:', error);
        }
      }

      // Build the prompt with optional symptom hint and medicine handling
      let symptomHintText = '';
      if (symptomHint) {
        symptomHintText = `\n\nSYMPTOM HINT: The user's message appears to be related to "${symptomHint.symptom}" which commonly corresponds to "${symptomHint.category}" products. Use this as context but respond naturally and empathetically.`;
      }

      // Check if the question is health-related first
      const isHealthRelated = await this.isHealthRelatedQuery(message);

      if (!isHealthRelated) {
        return {
          response:
            "I'm a healthcare product assistant specializing in supplements and wellness products. I can help you with questions about vitamins, minerals, health supplements, and wellness concerns, but I can't assist with unrelated topics. Please feel free to ask me about any health or supplement questions you might have!",
          suggestedProducts: [],
        };
      }

      const prompt = `You are a friendly healthcare product assistant specializing in dietary supplements and wellness products. Help users find suitable supplements and provide practical advice about dosages and ingredients.

${context}${symptomHintText}

Guidelines:
- Respond naturally and empathetically to the user's health concerns
- If you found relevant products in the context, mention them by name with their dosages using **bold formatting** for product names
- Focus on how the suggested products and their ingredients might help
- Include specific dosage recommendations from the product information
- Be encouraging and supportive
- Keep responses conversational but informative (2-4 sentences max)
- Only mention consulting healthcare professionals for very serious or concerning symptoms
- For common health concerns like low energy, sleep issues, digestive problems, joint stiffness - provide direct supplement advice

IMPORTANT - Medicine Handling:
- If the user asks about pharmaceutical medicines (like Panadol, Tylenol, Advil, etc.) that are NOT in our supplement database, acknowledge their question but redirect to our supplement alternatives
- Example: "Panadol is often used for pain relief and fever reduction. For natural alternatives, you might consider our **Joint Health** supplements with anti-inflammatory ingredients like Turmeric and Ginger, or **Immune Support** products with Vitamin C and Zinc to support your body's healing processes."
- Always suggest products from our database that have similar beneficial effects
- Focus on ingredients that support the same health goals (pain relief, immune support, energy, etc.)

IMPORTANT - Relevance Check:
- ONLY answer questions related to health, wellness, supplements, nutrition, medical conditions, symptoms, or fitness
- If the question is completely unrelated to health (like geography, sports, technology, etc.), politely decline and redirect to health topics
- Do NOT try to force connections between unrelated topics and health products

User message: ${message}`;

      const result = await this.retryApiCall(async () => {
        return await this.model.generateContent(prompt);
      });
      const response =
        result.response.text() ||
        'I apologize, but I could not generate a response at this time.';

      // Extract and find products mentioned in the response
      const mentionedProducts = await this.extractMentionedProducts(response);

      // Combine suggested products with mentioned products (remove duplicates)
      const allProducts = [...suggestedProducts, ...mentionedProducts];
      const uniqueProducts = allProducts.filter(
        (product, index, self) =>
          index ===
          self.findIndex(
            (p) => p.name === product.name && p.brand === product.brand,
          ),
      );

      return {
        response,
        suggestedProducts: this.cleanProductData(uniqueProducts),
      };
    } catch (error: unknown) {
      // Enhanced fallback response with medicine handling
      const errorInfo =
        error instanceof Error ? error : new Error(String(error));
      console.error('Process User Query Error:', {
        message: errorInfo.message,
        name: errorInfo.name,
        stack: errorInfo.stack,
        originalError: error,
      });

      return this.generateFallbackResponse(message);
    }
  }

  private async generateFallbackResponse(message: string) {
    // Check if the question is health-related first
    try {
      const isHealthRelated = await this.isHealthRelatedQuery(message);

      if (!isHealthRelated) {
        return {
          response:
            "I'm a healthcare product assistant specializing in supplements and wellness products. I can help you with questions about vitamins, minerals, health supplements, and wellness concerns, but I can't assist with unrelated topics. Please feel free to ask me about any health or supplement questions you might have!",
          suggestedProducts: [],
          fallback: true,
        };
      }
    } catch (error) {
      console.error('Error checking relevance in fallback:', error);
      // Continue with fallback if relevance check fails
    }

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

    // Enhanced keyword matching for common health concerns and medicines
    const lowercaseMessage = message.toLowerCase();

    // Handle common medicine queries
    if (
      lowercaseMessage.includes('panadol') ||
      lowercaseMessage.includes('tylenol') ||
      lowercaseMessage.includes('acetaminophen')
    ) {
      fallbackResponse +=
        'Panadol is often used for pain relief and fever reduction. For natural alternatives, consider our **Joint Health** supplements with anti-inflammatory ingredients like Turmeric, or **Immune Support** products with Vitamin C and Zinc. ';
    } else if (
      lowercaseMessage.includes('advil') ||
      lowercaseMessage.includes('ibuprofen')
    ) {
      fallbackResponse +=
        'Advil is typically used for pain and inflammation. You might explore our **Joint Health** supplements with Glucosamine and Chondroitin, or **Herbal Supplements** with natural anti-inflammatory compounds. ';
    } else if (lowercaseMessage.includes('aspirin')) {
      fallbackResponse +=
        'Aspirin is commonly used for pain relief and heart health. Consider our **Omega-3 Supplements** for cardiovascular support and **Joint Health** products for natural pain management. ';
    } else if (
      lowercaseMessage.includes('sleep') ||
      lowercaseMessage.includes('insomnia')
    ) {
      fallbackResponse +=
        'For sleep issues, you might want to explore our **Sleep Support** products with ingredients like Melatonin and Valerian Root. ';
    } else if (
      lowercaseMessage.includes('energy') ||
      lowercaseMessage.includes('tired') ||
      lowercaseMessage.includes('fatigue')
    ) {
      fallbackResponse +=
        'For energy support, consider our **Energy Support** supplements and **Multivitamins** with B vitamins and Ginseng. ';
    } else if (
      lowercaseMessage.includes('immune') ||
      lowercaseMessage.includes('cold') ||
      lowercaseMessage.includes('flu')
    ) {
      fallbackResponse +=
        'For immune support, check out our **Immune Support** products with Vitamin C and Zinc. ';
    } else if (
      lowercaseMessage.includes('joint') ||
      lowercaseMessage.includes('pain') ||
      lowercaseMessage.includes('arthritis')
    ) {
      fallbackResponse +=
        'For joint health, explore our **Joint Health** supplements with Glucosamine and Chondroitin. ';
    } else if (
      lowercaseMessage.includes('digest') ||
      lowercaseMessage.includes('gut') ||
      lowercaseMessage.includes('stomach')
    ) {
      fallbackResponse +=
        'For digestive health, consider our **Probiotics** with beneficial bacteria like Lactobacillus. ';
    } else if (
      lowercaseMessage.includes('heart') ||
      lowercaseMessage.includes('cardiovascular')
    ) {
      fallbackResponse +=
        'For heart health, look into our **Omega-3 Supplements** with DHA and EPA. ';
    } else if (
      lowercaseMessage.includes('bone') ||
      lowercaseMessage.includes('calcium')
    ) {
      fallbackResponse +=
        'For bone health, consider our **Calcium Supplements** with Vitamin D. ';
    } else if (
      lowercaseMessage.includes('stress') ||
      lowercaseMessage.includes('anxiety')
    ) {
      fallbackResponse +=
        'For stress management, explore our **Herbal Supplements** with Ashwagandha and Chamomile. ';
    } else {
      fallbackResponse +=
        'Please browse our product categories to find supplements that match your health needs. ';
    }

    fallbackResponse +=
      'Always consult with a healthcare professional for personalized advice.';

    // Extract mentioned products from fallback response too
    const mentionedProducts =
      await this.extractMentionedProducts(fallbackResponse);

    // Combine fallback products with mentioned products (remove duplicates)
    const allProducts = [...fallbackProducts, ...mentionedProducts];
    const uniqueProducts = allProducts.filter(
      (product, index, self) =>
        index ===
        self.findIndex(
          (p) => p.name === product.name && p.brand === product.brand,
        ),
    );

    return {
      response: fallbackResponse,
      suggestedProducts: this.cleanProductData(uniqueProducts),
      fallback: true,
    };
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

    return uniqueProducts.slice(0, 5); // Limit to top 5 results
  }

  private async extractMentionedProducts(response: string): Promise<Product[]> {
    try {
      // Extract product names from bold text (**Product Name**)
      const boldMatches = response.match(/\*\*(.*?)\*\*/g) || [];
      const mentionedProductNames: string[] = boldMatches.map((match: string) =>
        match.replace(/\*\*/g, '').trim(),
      );

      // Also look for common product categories mentioned in text
      const categoryMatches = [
        'Immune Support',
        'Energy Support',
        'Sleep Support',
        'Joint Health',
        'Multivitamin',
        'Omega-3',
        'Probiotics',
        'Calcium Supplement',
        'Herbal Supplement',
        'Detox',
      ].filter((category) =>
        response.toLowerCase().includes(category.toLowerCase()),
      );

      const allMentions: string[] = [
        ...mentionedProductNames,
        ...categoryMatches,
      ];

      if (allMentions.length === 0) {
        return [];
      }

      // Search for products by name and category
      const foundProducts: Product[] = [];

      for (const mention of allMentions) {
        try {
          // First try to find by exact name match
          const searchResult = await this.productsService.search({
            query: mention,
          });
          const products: Product[] = Array.isArray(searchResult)
            ? (searchResult as Product[])
            : ((searchResult as any).products as Product[]) || [];

          // Look for exact or close matches
          const exactMatch = products.find(
            (p: Product) =>
              p.name.toLowerCase().includes(mention.toLowerCase()) ||
              mention.toLowerCase().includes(p.name.toLowerCase()),
          );

          if (exactMatch) {
            foundProducts.push(exactMatch);
          } else {
            // Try to find by category
            const categoryProducts =
              await this.productsService.findByCategory(mention);
            if (categoryProducts.length > 0) {
              foundProducts.push(categoryProducts[0]); // Take first match
            }
          }
        } catch (error) {
          console.error(
            `Error searching for mentioned product "${mention}":`,
            error,
          );
        }
      }

      // Remove duplicates and limit results
      const uniqueProducts = foundProducts.filter(
        (product, index, self) =>
          index ===
          self.findIndex(
            (p) => p.name === product.name && p.brand === product.brand,
          ),
      );

      return uniqueProducts.slice(0, 3); // Limit to 3 products
    } catch (error) {
      console.error('Error extracting mentioned products:', error);
      return [];
    }
  }

  private async isHealthRelatedQuery(message: string): Promise<boolean> {
    try {
      const prompt = `Determine if this question is related to health, wellness, nutrition, supplements, medical conditions, symptoms, fitness, or any health-related topic.

Question: "${message}"

Respond with only "YES" if it's health-related or "NO" if it's completely unrelated to health.

Examples:
- "What is the tallest building?" → NO
- "I have a headache" → YES
- "What vitamins help with energy?" → YES
- "Who won the football game?" → NO
- "Best supplements for muscle building?" → YES
- "What's the weather like?" → NO
- "I feel tired all the time" → YES`;

      const result = await this.retryApiCall(async () => {
        return await this.model.generateContent(prompt);
      });

      const response = (result.response.text() as string).trim().toUpperCase();
      return response.includes('YES');
    } catch (error) {
      console.error('Error checking health relevance:', error);
      // Default to allowing the question if we can't determine relevance
      return true;
    }
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
