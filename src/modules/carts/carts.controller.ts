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
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { Payload } from '../../types/payload.interface';
import {
  type UpdateCartQuantityDto,
  updateCartQuantitySchema,
} from './schemas/update-cart-quantity.schema';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { type AddItemDto, addItemSchema } from './schemas/add-item.schema';

@UseGuards(AccessJwtAuthGuard)
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
  addItem(
    @Body(new ZodValidationPipe(addItemSchema)) addItemDto: AddItemDto,
    @Request() { user }: { user: Payload },
  ) {
    return this.service.addItem(user.userId, addItemDto);
  }

  @Patch('items/:productId')
  updateItem(
    @Request() { user }: { user: Payload },
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body(new ZodValidationPipe(updateCartQuantitySchema))
    updateCartQuantityDto: UpdateCartQuantityDto,
  ) {
    return this.service.updateItemQuantity(
      user.userId,
      productId,
      updateCartQuantityDto.quantity,
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
