import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  find() {
    return this.service.find();
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
    @Body() data: Inventory,
  ) {
    return this.service.update({ productId }, data);
  }
}
