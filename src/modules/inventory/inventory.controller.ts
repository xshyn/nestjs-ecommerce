import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  type UpdateInventoryDto,
  updateInventorySchema,
} from './schemas/update-inventory.schema';
import {
  type InventoryQueryDto,
  inventoryQuerySchema,
} from './schemas/inventory-query.schema';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  find(
    @Query(new ZodValidationPipe(inventoryQuerySchema))
    inventoryQueryDto: InventoryQueryDto,
  ) {
    return this.service.find(inventoryQueryDto);
  }

  @Get(':productId')
  findOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.service.findOne({ where: { productId } });
  }

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':productId')
  update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body(new ZodValidationPipe(updateInventorySchema))
    updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.service.update({ productId }, updateInventoryDto);
  }
}
