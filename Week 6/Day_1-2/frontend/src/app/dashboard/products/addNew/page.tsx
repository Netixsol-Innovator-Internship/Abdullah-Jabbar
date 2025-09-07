"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/lib/api/productsApiSlice";
import { useAuth } from "@/hooks/use-auth-rtk";

interface ProductFormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  stockQuantity: number;
  regularPrice: number;
  salePrice: number;
  tags: string[];
}

interface ProductFormErrors {
  title?: string;
  description?: string;
  category?: string;
  sku?: string;
  stockQuantity?: string;
  regularPrice?: string;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "",
    brand: "",
    sku: "",
    stockQuantity: 0,
    regularPrice: 0,
    salePrice: 0,
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  // Check if user is authenticated and has admin privileges
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You need admin privileges to add new products.
          </p>
          <Button 
            onClick={() => router.push("/dashboard/products")}
            className="mt-4"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (field in errors && errors[field as keyof ProductFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (formData.regularPrice <= 0) {
      newErrors.regularPrice = "Regular price must be greater than 0";
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitError("");

    try {
      const slug = generateSlug(formData.title);
      
      // Prepare the data according to the backend DTO
      const productData = {
        title: formData.title,
        slug: slug,
        shortDescription: formData.description.substring(0, 200), // Use first 200 chars as short description
        description: formData.description,
        tags: formData.tags,
        basePrice: formData.regularPrice.toString(), // Backend expects string
      };

      await createProduct(productData).unwrap();
      
      // Success - redirect to products list
      router.push("/dashboard/products");
    } catch (error: unknown) {
      console.error("Failed to create product:", error);
      const errorMessage = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : "Failed to create product. Please try again.";
      
      setSubmitError(errorMessage || "Failed to create product. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product Details
        </h1>
        <Breadcrumb
          items={[
            { label: "Home", href: "/dashboard" },
            { label: "All Products", href: "/dashboard/products" },
            { label: "Add New Product" },
          ]}
        />
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Product Info */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input 
                  placeholder="Type name here" 
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea 
                  placeholder="Type description here" 
                  className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Input 
                  placeholder="Type category here" 
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={errors.category ? "border-red-500" : ""}
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name
                </label>
                <Input 
                  placeholder="Type brand name here" 
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <Input 
                    placeholder="e.g. FOX-3983" 
                    value={formData.sku}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input 
                    placeholder="e.g. 1258" 
                    type="number" 
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value) || 0)}
                    className={errors.stockQuantity ? "border-red-500" : ""}
                  />
                  {errors.stockQuantity && (
                    <p className="text-red-500 text-sm mt-1">Stock quantity cannot be negative</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regular Price * (₹)
                  </label>
                  <Input 
                    placeholder="1000" 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.regularPrice}
                    onChange={(e) => handleInputChange("regularPrice", parseFloat(e.target.value) || 0)}
                    className={errors.regularPrice ? "border-red-500" : ""}
                  />
                  {errors.regularPrice && (
                    <p className="text-red-500 text-sm mt-1">Regular price must be greater than 0</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (₹)
                  </label>
                  <Input 
                    placeholder="450" 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange("salePrice", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add tag and press Enter" 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px]">
                    {formData.tags.length > 0 ? (
                      formData.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tags</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <Card className="p-6">
              <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 text-center">
                  Upload product image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Image upload will be available in future update)
                </p>
              </div>
            </Card>

            {/* Product Gallery */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Gallery
              </h3>
              <div className="aspect-[4/2] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 text-sm text-center px-4">
                  Drop your images here, or browse. <br />
                  JPEG, PNG are allowed <br />
                  <span className="text-xs">(Image upload will be available in future update)</span>
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => router.push("/dashboard/products")}
          >
            CANCEL
          </Button>
          <Button 
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? "CREATING..." : "CREATE PRODUCT"}
          </Button>
        </div>
      </form>
    </div>
  );
}
