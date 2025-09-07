"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2, ArrowLeft, Save, X } from "lucide-react";
import {
  useGetProductByIdQuery,
  parsePrice,
  useUpdateProductMutation,
  Product,
} from "@/lib/api/productsApiSlice";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

// Form data interface with string prices for input fields
interface ProductFormData extends Omit<Product, "basePrice" | "salePrice"> {
  basePrice?: string;
  salePrice?: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductFormData>>({});
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(productId);

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        basePrice: parsePrice(product.basePrice).toString(),
        salePrice: product.salePrice
          ? parsePrice(product.salePrice).toString()
          : "",
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductFormData, value: unknown) => {
    setFormData((prev: Partial<ProductFormData>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayAdd = (
    field: keyof ProductFormData,
    value: string,
    inputSetter: (val: string) => void
  ) => {
    if (value.trim()) {
      const currentArray = (formData[field] as string[]) || [];
      setFormData((prev: Partial<ProductFormData>) => ({
        ...prev,
        [field]: [...currentArray, value.trim()],
      }));
      inputSetter("");
    }
  };

  const handleArrayRemove = (field: keyof ProductFormData, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData((prev: Partial<ProductFormData>) => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      // Validate and clean price values before sending
      const updateData = {
        ...formData,
        basePrice: formData.basePrice ? formData.basePrice.trim() : undefined,
        salePrice: formData.salePrice ? formData.salePrice.trim() : undefined,
      };

      // Remove empty strings to prevent backend validation errors
      if (updateData.basePrice === "") delete updateData.basePrice;
      if (updateData.salePrice === "") delete updateData.salePrice;

      await updateProduct({
        id: productId,
        data: updateData,
      }).unwrap();
      setIsEditing(false);
    } catch (error: any) {
      // Log more details for debugging
      if (error?.data) {
        console.error("Failed to update product:", error.data);
      } else if (error?.error) {
        console.error("Failed to update product:", error.error);
      } else {
        console.error("Failed to update product:", error);
      }
      // You can add a toast notification here
    }
  };

  const handleCancel = () => {
    if (product) {
      setFormData({
        ...product,
        basePrice: parsePrice(product.basePrice).toString(),
        salePrice: product.salePrice
          ? parsePrice(product.salePrice).toString()
          : "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading product...</span>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading product</p>
            <p className="text-gray-500 text-sm mb-4">
              Product not found or failed to load
            </p>
            <Button onClick={() => router.push("/dashboard/products")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditing ? `Edit: ${product.title}` : product.title}
        </h1>
        <Breadcrumb
          items={[
            { label: "Home", href: "/dashboard" },
            { label: "All Products", href: "/dashboard/products" },
            { label: isEditing ? `Edit: ${product.title}` : product.title },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Product Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? "" : "bg-gray-50"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={formData.description || "No description available"}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  readOnly={!isEditing}
                  className={`min-h-[120px] ${isEditing ? "" : "bg-gray-50"}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <Textarea
                  value={formData.shortDescription || ""}
                  onChange={(e) =>
                    handleInputChange("shortDescription", e.target.value)
                  }
                  readOnly={!isEditing}
                  className={`min-h-[80px] ${isEditing ? "" : "bg-gray-50"}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories (comma-separated)
                </label>
                <Input
                  value={formData.categories?.join(", ") || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "categories",
                      e.target.value
                        .split(",")
                        .map((c) => c.trim())
                        .filter((c) => c)
                    )
                  }
                  readOnly={!isEditing}
                  className={isEditing ? "" : "bg-gray-50"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <Input
                  value={formData.slug || ""}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  readOnly={!isEditing}
                  className={isEditing ? "" : "bg-gray-50"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <Input
                    value={formData.currency || ""}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    readOnly={!isEditing}
                    className={isEditing ? "" : "bg-gray-50"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus || ""}
                    onChange={(e) =>
                      handleInputChange("stockStatus", e.target.value)
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isEditing ? "" : "bg-gray-50"}`}
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
                    Regular Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.basePrice || ""}
                    onChange={(e) =>
                      handleInputChange("basePrice", e.target.value)
                    }
                    readOnly={!isEditing}
                    className={isEditing ? "" : "bg-gray-50"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.salePrice || ""}
                    onChange={(e) =>
                      handleInputChange("salePrice", e.target.value)
                    }
                    readOnly={!isEditing}
                    className={isEditing ? "" : "bg-gray-50"}
                    placeholder="Not on sale"
                  />
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
                    value={formData.ratingAverage || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "ratingAverage",
                        e.target.value ? parseFloat(e.target.value) : undefined
                      )
                    }
                    readOnly={!isEditing}
                    className={isEditing ? "" : "bg-gray-50"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Count
                  </label>
                  <Input
                    type="number"
                    value={formData.reviewCount || 0}
                    onChange={(e) =>
                      handleInputChange("reviewCount", parseInt(e.target.value))
                    }
                    readOnly={!isEditing}
                    className={isEditing ? "" : "bg-gray-50"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleArrayAdd("tags", tagInput, setTagInput);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          handleArrayAdd("tags", tagInput, setTagInput)
                        }
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px] overflow-x-auto">
                      {formData.tags && formData.tags.length > 0 ? (
                        formData.tags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-600 text-white cursor-pointer"
                            onClick={() => handleArrayRemove("tags", index)}
                          >
                            {tag} ×
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No tags</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px] overflow-x-auto">
                    {formData.tags && formData.tags.length > 0 ? (
                      formData.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-600 text-white"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tags</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Colors
                </label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px] overflow-x-auto">
                  {product.availableColors &&
                  product.availableColors.length > 0 ? (
                    product.availableColors.map((color, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {color}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No colors specified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-[60px] overflow-x-auto">
                  {product.availableSizes &&
                  product.availableSizes.length > 0 ? (
                    product.availableSizes.map((size, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {size}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No sizes specified
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) =>
                      handleInputChange("isFeatured", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">Featured</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival || false}
                    onChange={(e) =>
                      handleInputChange("isNewArrival", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">New Arrival</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isOnSale || false}
                    onChange={(e) =>
                      handleInputChange("isOnSale", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-700">On Sale</label>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Product Images */}
        <div className="space-y-6">
          {/* Main Image Display */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Product Images
            </h3>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square sm:aspect-square bg-gray-100 rounded-lg overflow-hidden w-full">
                  <Image
                    src={product.images[0].url || "/placeholder.svg"}
                    alt={product.images[0].alt || product.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                  />
                </div>

                {/* Additional Images */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.slice(1, 4).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded overflow-hidden"
                      >
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt || `${product.title} ${index + 2}`}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                          unoptimized={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 text-center">
                  No images available
                </p>
              </div>
            )}
          </Card>

          {/* Product Metadata */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Additional Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Product ID:</span>
                <span className="text-sm font-medium">{product._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium">
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <span className="text-sm font-medium">
                  {product.updatedAt
                    ? new Date(product.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Variants:</span>
                <span className="text-sm font-medium">
                  {product.variants?.length || 0} variant(s)
                </span>
              </div>
              {product.discountPercent && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm font-medium text-green-600">
                    {product.discountPercent}% OFF
                  </span>
                </div>
              )}
              {product.saleStartsAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sale Starts:</span>
                  <span className="text-sm font-medium">
                    {new Date(product.saleStartsAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {product.saleEndsAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sale Ends:</span>
                  <span className="text-sm font-medium">
                    {new Date(product.saleEndsAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/products")}
          disabled={isUpdating}
          className="w-full sm:w-auto"
        >
          BACK TO PRODUCTS
        </Button>

        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  SAVING...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  SAVE CHANGES
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              EDIT
            </Button>
            <Button variant="destructive" className="w-full sm:w-auto">
              DELETE
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
