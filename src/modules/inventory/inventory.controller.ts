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

  @Get()
  find() {
    return this.service.find();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne({ id });
  }

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: Inventory) {
    return this.service.update({ id }, data);
  }
}
