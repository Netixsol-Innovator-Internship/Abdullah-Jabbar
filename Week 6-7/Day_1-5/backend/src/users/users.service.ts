
// users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from './user-role.enum';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string | Types.ObjectId) {
    return this.userModel.findById(id).exec();
  }

  async create(payload: {
    email: string;
    passwordHash?: string;
    name?: string;
    roles?: UserRole[];
    isEmailVerified?: boolean;
    oauthProviders?: Array<{
      provider: string;
      providerId: string;
    }>;
    picture?: string;
  }) {
    const userDoc: Record<string, any> = {
      email: payload.email,
      name: payload.name,
      roles: payload.roles || [UserRole.USER],
      isEmailVerified: payload.isEmailVerified ?? false,
      oauthProviders: payload.oauthProviders || [],
      picture: payload.picture,
    };

    // Only set passwordHash if it's provided (for regular users)
    if (payload.passwordHash) {
      userDoc.passwordHash = payload.passwordHash;
    }

    const created = new this.userModel(userDoc);
    return created.save();
  }

  async list(skip = 0, limit = 20) {
    return this.userModel.find().skip(skip).limit(limit).exec();
  }

  async updateUserAddress(
    userId: string | Types.ObjectId,
    addressData: UpdateAddressDto,
  ) {
    // updateUserAddress called

    const user = await this.userModel.findById(userId);
    if (!user) {
      console.error('Service: User not found');
      throw new Error('User not found');
    }

    // user found, updating addresses

    // If addressIndex is provided, update existing address
    if (addressData.addressIndex !== undefined) {
      const index = parseInt(addressData.addressIndex);

      if (index >= 0 && index < user.addresses.length) {
        // Update existing address
        const updatedAddress = {
          ...user.addresses[index],
          ...addressData,
        };
        delete updatedAddress.addressIndex; // Remove this field from the stored data
        user.addresses[index] = updatedAddress;
        // address updated
      } else {
        console.error('Service: Invalid address index');
        throw new Error('Invalid address index');
      }
    } else {
      // Add new address
      // adding new address
      const newAddress = {
        label: addressData.label,
        fullName: addressData.fullName,
        street1: addressData.street1,
        street2: addressData.street2,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        phone: addressData.phone,
        isDefault: addressData.isDefault || false,
      };
      user.addresses.push(newAddress);
      // new address added
    }

    // If this address is set as default, unset other defaults
    if (addressData.isDefault) {
      // set as default address
      user.addresses.forEach((addr: any, index: number) => {
        if (
          addressData.addressIndex === undefined ||
          index !== parseInt(addressData.addressIndex || '')
        ) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();
    // user saved
    return user;
  }

  async deleteUserAddress(
    userId: string | Types.ObjectId,
    addressIndex: number,
  ) {
    // deleteUserAddress called

    const user = await this.userModel.findById(userId);
    if (!user) {
      console.error('Service: User not found');
      throw new Error('User not found');
    }

    // user found for delete

    if (addressIndex < 0 || addressIndex >= user.addresses.length) {
      console.error('Service: Invalid address index');
      throw new Error('Invalid address index');
    }

    // Remove the address at the specified index
    user.addresses.splice(addressIndex, 1);
    // address deleted
    await user.save();
    // user saved after delete
    return user;
  }
}