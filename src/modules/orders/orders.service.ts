import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { OrderItem } from './order-item.entity';
import {
  Between,
  DataSource,
  FindOneOptions,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Cart } from '../carts/carts.entity';
import { Inventory } from '../inventory/inventory.entity';
import { CartItem } from '../carts/cart-items.entity';
import { OrderStatus } from './orders.type';
import { OrdersListQueryDto } from './schemas/orders-list-query.schema';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  findAll(ordersListQueryDto?: OrdersListQueryDto) {
    const isGteAmount = !!ordersListQueryDto?.gteAmount;
    const isLteAmount = !!ordersListQueryDto?.lteAmount;
    const isBetweenAmount = isGteAmount && isLteAmount;

    return this.orderRepo.find({
      take: ordersListQueryDto?.limit,
      skip: ordersListQueryDto?.skip,
      relations: { items: true },
      order: {
        [ordersListQueryDto?.sortOption!]: ordersListQueryDto?.sortDir,
      },
      where: {
        ...(isGteAmount || isLteAmount
          ? {
              totalAmount: isBetweenAmount
                ? Between(
                    ordersListQueryDto.gteAmount,
                    ordersListQueryDto.lteAmount,
                  )
                : isGteAmount
                  ? MoreThanOrEqual(ordersListQueryDto.gteAmount)
                  : LessThanOrEqual(ordersListQueryDto.lteAmount),
            }
          : {}),
        ...(ordersListQueryDto?.id && { id: ordersListQueryDto.id }),
        ...(ordersListQueryDto?.status && {
          status: ordersListQueryDto.status,
        }),
        ...(ordersListQueryDto?.userId && {
          userId: ordersListQueryDto.userId,
        }),
      } as FindOptionsWhere<Order>,
    });
  }

  findOne(options: FindOneOptions<Order>) {
    return this.orderRepo.findOne(options);
  }

  checkout(userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const cart = await manager.findOne(Cart, {
        where: { userId },
        relations: { items: { product: true } },
      });

      if (!cart || !cart?.items || cart?.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      const order = manager.create(Order, {
        userId,
        totalAmount: '0',
      });
      const savedOrder = await manager.save(Order, order);

      let totalAmount = 0;
      for (const item of cart.items) {
        const inventory = await manager
          .getRepository(Inventory)
          .createQueryBuilder('inventories')
          .setLock('pessimistic_write')
          .where('inventories.productId = :productId', {
            productId: item.productId,
          })
          .getOne();

        if (!inventory)
          throw new NotFoundException(
            `Inventory for product ${item.productId} not found`,
          );

        if (inventory.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient inventory for product ${item.productId}`,
          );
        }

        const subtotal = parseFloat(item.product.price) * item.quantity;
        totalAmount += subtotal;

        const orderItem = manager.create(OrderItem, {
          order: savedOrder,
          product: item.product,
          productName: item.product.name,
          unitPrice: item.product.price.toString(),
          quantity: item.quantity,
          subtotal: subtotal.toString(),
        });

        await manager.save(OrderItem, orderItem);

        inventory.quantity -= item.quantity;
        await manager.save(Inventory, inventory);
      }
      savedOrder.totalAmount = totalAmount.toFixed(2);
      await manager.save(Order, savedOrder);

      await manager.remove(CartItem, cart.items);

      return savedOrder;
    });
  }

  async updateStatus(
    orderId: string,
    userId: string,
    status: OrderStatus,
    throwIfNotFound = false,
  ) {
    const result = await this.orderRepo.update(
      { id: orderId, userId },
      { status },
    );

    if ((!result.affected || result.affected < 1) && throwIfNotFound)
      throw new NotFoundException('Order not found');
    return result;
  }
}
