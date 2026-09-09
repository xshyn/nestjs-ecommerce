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
  UpdateCartQuantityDto,
  updateCartQuantitySchema,
} from './schemas/update-cart-quantity.schema';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { AddItemDto, addItemSchema } from './schemas/add-item.schema';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UnauthorizedResponse } from '../../responses/unauthorized.response';
import { CartResponse } from './responses/cart.response';
import { CartItemResponse } from './responses/cart-item.response';
import { ValidationFailedResponse } from '../../responses/validation-failed.response';
import { UpdateResponse } from '../../responses/update.response';
import { DeleteResponse } from '../../responses/delete.response';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: UnauthorizedResponse })
@UseGuards(AccessJwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly service: CartsService) {}

  @ApiOperation({ summary: 'Get user cart' })
  @ApiOkResponse({ type: CartResponse })
  @Get()
  userCart(@Request() { user }: { user: Payload }) {
    return this.service.findOne({
      where: { userId: user.userId },
      relations: { items: true },
    });
  }

  @ApiOperation({ summary: 'Add item to user cart' })
  @ApiOkResponse({ type: CartItemResponse })
  @ApiCreatedResponse({ type: CartItemResponse })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @Post('items')
  addItem(
    @Body(new ZodValidationPipe(addItemSchema)) addItemDto: AddItemDto,
    @Request() { user }: { user: Payload },
  ) {
    return this.service.addItem(user.userId, addItemDto);
  }

  @ApiOperation({ summary: 'Update item from user cart' })
  @ApiOkResponse({ type: UpdateResponse })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
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

  @ApiOperation({ summary: 'Remove item from user cart' })
  @ApiOkResponse({ type: DeleteResponse })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @Delete('items/:productId')
  removeItem(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Request() { user }: { user: Payload },
  ) {
    return this.service.removeItem(productId, user.userId);
  }

  @ApiOperation({ summary: 'Clear user cart items' })
  @ApiOkResponse({ type: DeleteResponse })
  @Delete()
  clearCart(@Request() { user }: { user: Payload }) {
    return this.service.clearCart(user.userId);
  }
}
