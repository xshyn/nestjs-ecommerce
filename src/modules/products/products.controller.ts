import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  create(@Body() data: Product) {
    return this.service.create(data);
  }

  @Get()
  find() {
    return this.service.find();
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne({ id });
  }

  @Patch('/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: Product) {
    return this.service.update({ id }, data);
  }

  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete({ id });
  }
}
