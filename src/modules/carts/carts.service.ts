import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './carts.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CartItem } from './cart-items.entity';
import { ProductsService } from '../products/products.service';
import { InventoryService } from '../inventory/inventory.service';
import { Product } from '../products/products.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    private readonly productService: ProductsService,
    private readonly inventoryService: InventoryService,
  ) {}

  async findOne(options: FindOneOptions<Cart>, throwIfNotFound = false) {
    const cart = await this.cartRepo.findOne(options);
    if (!cart && throwIfNotFound) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addItem(userId: string, data: CartItem) {
    const cart = await this.getOrCreateCart(userId);

    const product = (await this.productService.findOne(
      { where: { id: data.productId }, relations: { inventory: true } },
      true,
    )) as Product;

    await this.inventoryService.checkAvailability(product, data.quantity);

    const item = await this.getOrCreateCartItem(cart.id, data.productId);
    item.quantity = data.quantity;
    const savedItem = await this.cartItemRepo.save(item);
    return savedItem;
  }

  private async getOrCreateCart(userId: string) {
    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (cart) return cart;
    const newCart = this.cartRepo.create({ userId });
    return this.cartRepo.save(newCart);
  }
  private async getOrCreateCartItem(cartId: string, productId: string) {
    const cartItem = await this.cartItemRepo.findOne({
      where: {
        cartId,
        productId,
      },
    });
    if (cartItem) return cartItem;
    const newCartItem = this.cartItemRepo.create({
      cartId,
      productId,
      quantity: 0,
    });
    return this.cartItemRepo.save(newCartItem);
  }
  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const item = await this.cartItemRepo.findOne({
      where: {
        cart: { userId },
        productId,
      },
      relations: {
        product: { inventory: true },
      },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.inventoryService.checkAvailability(item.product, quantity);
    item.quantity = quantity;
    return this.cartItemRepo.save(item);
  }

  async removeItem(productId: string, userId: string) {
    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const result = await this.cartItemRepo.delete({
      productId,
      cartId: cart?.id,
    });
    if (!result.affected || result.affected < 1)
      throw new NotFoundException('Cart item not found');
    return result;
  }

  async clearCart(userId: string) {
    const cart = await this.cartRepo.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const result = await this.cartItemRepo.delete({
      cartId: cart.id,
    });
    if (!result.affected || result.affected < 1)
      throw new NotFoundException('Cart not found');
    return result;
  }
}
