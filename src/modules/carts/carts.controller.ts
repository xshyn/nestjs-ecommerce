import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Payload } from '../../types/payload.interface';
import { CartItem } from './cart-items.entity';

@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly service: CartsService) {}

  @Get()
  userCart(@Request() { user }: { user: Payload }) {
    return this.service.findOne(
      { where: { userId: user.userId }, relations: { items: true } },
      true,
    );
  }

  @Post('items')
  addItem(@Body() data: CartItem, @Request() { user }: { user: Payload }) {
    return this.service.addItem(user.userId, data);
  }

  @Patch('items/:productId')
  updateItem(
    @Request() { user }: { user: Payload },
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() data: CartItem,
  ) {
    return this.service.updateItemQuantity(
      user.userId,
      productId,
      data.quantity,
    );
  }

  @Delete('items/:productId')
  removeItem(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Request() { user }: { user: Payload },
  ) {
    return this.service.removeItem(productId, user.userId);
  }

  @Delete()
  clearCart(@Request() { user }: { user: Payload }) {
    return this.service.clearCart(user.userId);
  }
}
