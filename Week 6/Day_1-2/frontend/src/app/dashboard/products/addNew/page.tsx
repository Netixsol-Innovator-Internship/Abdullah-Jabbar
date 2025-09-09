"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/lib/api/productsApiSlice";
import { useAuth } from "@/hooks/use-auth-rtk";
import { getAuthToken } from "@/lib/auth-utils";

interface ProductFormData {
  title: string;
  description: string;
  shortDescription: string;
  categories: string[];
  slug: string;
  currency: string;
  stockStatus: string;
  basePrice: string;
  salePrice: string;
  ratingAverage: number;
  reviewCount: number;
  tags: string[];
  images: { url: string; alt?: string; order?: number }[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
}

interface ProductFormErrors {
  title?: string;
  description?: string;
  shortDescription?: string;
  categories?: string;
  slug?: string;
  currency?: string;
  basePrice?: string;
  salePrice?: string;
}

export default function ProductDetailsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    shortDescription: "",
    categories: [],
    slug: "",
    currency: "USD",
    stockStatus: "in_stock",
    basePrice: "",
    salePrice: "",
    ratingAverage: 0,
    reviewCount: 0,
    tags: [],
    images: [],
    isFeatured: false,
    isNewArrival: false,
    isOnSale: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  // Debug authentication state
  useEffect(() => {
    const token = getAuthToken();
    console.log("Auth state debug:", {
      isAuthenticated,
      isAdmin,
      token: token ? `${token.substring(0, 20)}...` : null,
      tokenLength: token?.length,
    });

    // If we think we're authenticated but don't have a token, there's an issue
    if (isAuthenticated && !token) {
      console.warn(
        "Authentication state inconsistency: isAuthenticated=true but no token found"
      );
    }
  }, [isAuthenticated, isAdmin]);

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

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | boolean | string[]
  ) => {
    // Apply specific validations and constraints
    let processedValue = value;

    if (field === "ratingAverage" && typeof value === "number") {
      // Ensure rating is between 0 and 5
      processedValue = Math.min(5, Math.max(0, value));
    }

    if (field === "reviewCount" && typeof value === "number") {
      // Ensure review count is not negative
      processedValue = Math.max(0, value);
    }

    if (field === "slug" && typeof value === "string") {
      // Auto-format slug: lowercase, replace spaces/special chars with hyphens
      processedValue = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (field === "currency" && typeof value === "string") {
      // Auto-format currency: uppercase, max 3 chars
      processedValue = value.toUpperCase().slice(0, 3);
    }

    if (
      (field === "basePrice" || field === "salePrice") &&
      typeof value === "string"
    ) {
      // Allow only valid price format (numbers and decimal point)
      if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
        processedValue = value;
      } else {
        return; // Don't update if invalid format
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear error when user starts typing
    if (field in errors && errors[field as keyof ProductFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleArrayAdd = (
    field: keyof ProductFormData,
    value: string,
    inputSetter: (val: string) => void
  ) => {
    const trimmedValue = value.trim();

    // Validation for array items
    if (!trimmedValue) {
      return; // Don't add empty values
    }

    if (trimmedValue.length < 2) {
      // Don't add items that are too short
      return;
    }

    if (trimmedValue.length > 50) {
      // Don't add items that are too long
      return;
    }

    const currentArray = (formData[field] as string[]) || [];

    // Check for duplicates (case-insensitive)
    if (
      currentArray.some(
        (item) => item.toLowerCase() === trimmedValue.toLowerCase()
      )
    ) {
      return; // Don't add duplicates
    }

    // Check array length limits
    if (field === "categories" && currentArray.length >= 10) {
      return; // Max 10 categories
    }

    if (field === "tags" && currentArray.length >= 20) {
      return; // Max 20 tags
    }

    setFormData((prev) => ({
      ...prev,
      [field]: [...currentArray, trimmedValue],
    }));
    inputSetter("");

    // Clear related errors
    if (field === "categories" && errors.categories) {
      setErrors((prev) => ({
        ...prev,
        categories: undefined,
      }));
    }
  };

  const handleArrayRemove = (field: keyof ProductFormData, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData((prev) => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleArrayAdd("tags", tagInput, setTagInput);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const tagIndex = formData.tags.indexOf(tagToRemove);
    if (tagIndex !== -1) {
      handleArrayRemove("tags", tagIndex);
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleImagesUploaded = (
    uploadedImages: { url: string; alt?: string; order?: number }[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));
  };

  const handleImageRemoved = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== imageUrl),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Product name is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Product name must be at least 3 characters";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Product name cannot exceed 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = "Description cannot exceed 2000 characters";
    }

    // Short description validation
    if (
      formData.shortDescription.trim() &&
      formData.shortDescription.trim().length > 500
    ) {
      newErrors.shortDescription =
        "Short description cannot exceed 500 characters";
    }

    // Categories validation
    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    } else if (formData.slug.length < 3) {
      newErrors.slug = "Slug must be at least 3 characters";
    } else if (formData.slug.length > 100) {
      newErrors.slug = "Slug cannot exceed 100 characters";
    }

    // Currency validation
    if (!formData.currency.trim()) {
      newErrors.currency = "Currency is required";
    } else if (formData.currency.trim().length !== 3) {
      newErrors.currency = "Currency must be 3 characters (e.g., USD, EUR)";
    }

    // Base price validation
    if (!formData.basePrice.trim()) {
      newErrors.basePrice = "Base price is required";
    } else {
      const price = parseFloat(formData.basePrice);
      if (isNaN(price) || price <= 0) {
        newErrors.basePrice =
          "Base price must be a valid number greater than 0";
      } else if (price > 999999.99) {
        newErrors.basePrice = "Base price cannot exceed 999,999.99";
      }
    }

    // Sale price validation
    if (formData.salePrice.trim()) {
      const salePrice = parseFloat(formData.salePrice);
      const basePrice = parseFloat(formData.basePrice);

      if (isNaN(salePrice) || salePrice < 0) {
        newErrors.salePrice = "Sale price must be a valid number";
      } else if (salePrice > 999999.99) {
        newErrors.salePrice = "Sale price cannot exceed 999,999.99";
      } else if (!isNaN(basePrice) && salePrice >= basePrice) {
        newErrors.salePrice = "Sale price must be less than base price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError("");

    try {
      // Debug authentication state
      const currentToken = getAuthToken();
      console.log("Authentication Debug:", {
        isAuthenticated,
        isAdmin,
        hasToken: !!currentToken,
        tokenLength: currentToken?.length,
        tokenPreview: currentToken
          ? `${currentToken.substring(0, 20)}...`
          : null,
      });

      // If no token, show error immediately
      if (!currentToken) {
        setSubmitError("No authentication token found. Please log in again.");
        return;
      }

      // Auto-generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);

      // Prepare the data according to the backend DTO
      const productData = {
        title: formData.title,
        slug: slug,
        shortDescription:
          formData.shortDescription || formData.description.substring(0, 200),
        description: formData.description,
        categories: formData.categories,
        tags: formData.tags,
        images: formData.images,
        basePrice: formData.basePrice,
        salePrice: formData.salePrice || undefined,
        currency: formData.currency,
        stockStatus: formData.stockStatus,
        ratingAverage: formData.ratingAverage,
        reviewCount: formData.reviewCount,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isOnSale: formData.isOnSale,
      };

      console.log("Product data being sent:", productData);
      console.log("Images in product data:", productData.images);
      console.log("Form data images:", formData.images);

      await createProduct(productData).unwrap();

      // Success - redirect to products list
      router.push("/dashboard/products");
    } catch (error: unknown) {
      console.error("Failed to create product:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Failed to create product. Please try again.";

      setSubmitError(
        errorMessage || "Failed to create product. Please try again."
      );
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
          {submitError.includes("Authentication") && (
            <Button
              onClick={() => router.push("/authForm")}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Go to Login
            </Button>
          )}
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
                  maxLength={100}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  3-100 characters required
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  placeholder="Type description here"
                  className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  maxLength={2000}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/2000 characters (minimum 10)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <Textarea
                  placeholder="Type short description here"
                  className={`min-h-[80px] ${errors.shortDescription ? "border-red-500" : ""}`}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  maxLength={500}
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.shortDescription}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.shortDescription.length}/500 characters (optional)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories *
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add category and press Enter"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleArrayAdd(
                            "categories",
                            categoryInput,
                            setCategoryInput
                          );
                        }
                      }}
                      maxLength={50}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        handleArrayAdd(
                          "categories",
                          categoryInput,
                          setCategoryInput
                        )
                      }
                      disabled={
                        !categoryInput.trim() ||
                        formData.categories.length >= 10
                      }
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px]">
                    {formData.categories && formData.categories.length > 0 ? (
                      formData.categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded cursor-pointer"
                          onClick={() => handleArrayRemove("categories", index)}
                        >
                          {category} ×
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No categories
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.categories.length}/10 categories (2-50 characters
                    each, no duplicates)
                  </p>
                  {errors.categories && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.categories}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <Input
                  placeholder="product-slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className={errors.slug ? "border-red-500" : ""}
                  maxLength={100}
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Lowercase letters, numbers, and hyphens only (3-100
                  characters)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <Input
                    placeholder="USD"
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className={errors.currency ? "border-red-500" : ""}
                    maxLength={3}
                  />
                  {errors.currency && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currency}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    3-letter currency code (e.g., USD, EUR)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) =>
                      handleInputChange("stockStatus", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999.99"
                    placeholder="0.00"
                    value={formData.basePrice}
                    onChange={(e) =>
                      handleInputChange("basePrice", e.target.value)
                    }
                    className={errors.basePrice ? "border-red-500" : ""}
                  />
                  {errors.basePrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.basePrice}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Must be greater than 0, max 999,999.99
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999.99"
                    placeholder="0.00"
                    value={formData.salePrice}
                    onChange={(e) =>
                      handleInputChange("salePrice", e.target.value)
                    }
                    className={errors.salePrice ? "border-red-500" : ""}
                  />
                  {errors.salePrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.salePrice}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Must be less than base price (optional)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating Average
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.ratingAverage}
                    onChange={(e) =>
                      handleInputChange(
                        "ratingAverage",
                        e.target.value ? parseFloat(e.target.value) : 0
                      )
                    }
                    onBlur={(e) => {
                      // Ensure value doesn't exceed 5 on blur
                      const value = parseFloat(e.target.value);
                      if (value > 5) {
                        handleInputChange("ratingAverage", 5);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rating must be between 0 and 5
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Count
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.reviewCount}
                    onChange={(e) =>
                      handleInputChange(
                        "reviewCount",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cannot be negative
                  </p>
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
                      maxLength={50}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      variant="outline"
                      disabled={!tagInput.trim() || formData.tags.length >= 20}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px]">
                    {formData.tags.length > 0 ? (
                      formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded cursor-pointer"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tags</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.tags.length}/20 tags (2-50 characters each, no
                    duplicates)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      handleInputChange("isFeatured", e.target.checked)
                    }
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">Featured</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      handleInputChange("isNewArrival", e.target.checked)
                    }
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">New Arrival</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isOnSale}
                    onChange={(e) =>
                      handleInputChange("isOnSale", e.target.checked)
                    }
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">On Sale</label>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Product Images */}
          <div className="space-y-6">
            {/* Product Images Upload */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Images
              </h3>
              <ImageUpload
                onImagesUploaded={handleImagesUploaded}
                onImageRemoved={handleImageRemoved}
                maxImages={10}
                existingImages={formData.images}
                disabled={isCreating}
              />
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
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "CREATING..." : "CREATE PRODUCT"}
          </Button>
        </div>
      </form>
    </div>
  );
}
