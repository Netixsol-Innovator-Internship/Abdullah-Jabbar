
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<{ url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 1000, height: 1000, crop: 'limit' },
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            } else {
              reject(new Error('Upload failed: No result returned'));
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Don't throw error to prevent blocking other operations
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<
    { url: string; public_id: string; alt?: string; order?: number }[]
  > {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, folder).then((result) => ({
        ...result,
        alt: `Product image ${index + 1}`,
        order: index,
      })),
    );

    return Promise.all(uploadPromises);
  }
}
