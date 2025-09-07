# Image Upload Setup with Cloudinary

This project now supports image uploads using Cloudinary for product management.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. After creating your account, go to your Dashboard
3. Note down your:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Environment Variables

In the backend `.env` file, update the following variables with your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 3. Features

#### Image Upload
- Supports JPEG, PNG, GIF, and WebP formats
- Maximum file size: 5MB per image
- Maximum 10 images per product
- Automatic image optimization and compression
- Images are stored in Cloudinary with transformations applied

#### Drag and Drop
- Drag and drop multiple files
- Visual feedback during upload
- Preview selected images before upload
- Remove individual images

#### Image Management
- View existing product images
- Add new images to existing products
- Remove images from products
- Automatic cleanup when products are deleted

### 4. API Endpoints

#### Backend Endpoints
- `POST /upload/single` - Upload a single image
- `POST /upload/multiple` - Upload multiple images
- `POST /upload/delete` - Delete an image from Cloudinary
- `POST /products/upload-images/:id` - Upload images for a specific product

#### Frontend API Routes
- `POST /api/upload/multiple` - Proxy for backend multiple upload
- `POST /api/products/upload-images/[id]` - Proxy for product image upload

### 5. Usage

#### Adding New Products
1. Fill in the product form
2. Drag and drop images or click to browse
3. Selected images will be previewed
4. Click "Upload" to upload the images
5. Submit the form to create the product with images

#### Editing Existing Products
1. Click "Edit" on a product
2. The image upload component will appear
3. Add new images or remove existing ones
4. Save changes to update the product

### 6. Security

- Only authenticated admin users can upload images
- File type validation on both frontend and backend
- File size limits enforced
- Images are automatically optimized for web delivery

### 7. Error Handling

- Invalid file types are rejected with user-friendly messages
- File size errors are shown clearly
- Network errors during upload are handled gracefully
- Failed uploads can be retried

### 8. Performance

- Images are automatically compressed and optimized
- Multiple formats supported for better browser compatibility
- CDN delivery for fast loading worldwide
- Responsive image transformations

## Development Notes

- Images are uploaded to Cloudinary's "products" folder
- Each image gets metadata including alt text and order
- The backend stores image URLs and public IDs for cleanup
- Frontend components are reusable for other image upload needs
