import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  save(@Body() data: Product) {
    return this.service.save(data);
  }

  @Get()
  find() {
    return this.service.find();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne({
      where: { id },
      relations: {
        inventory: true,
      },
    });
  }

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: Product) {
    return this.service.update({ id }, data);
  }

  @Role(Roles.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete({ id });
  }
}
