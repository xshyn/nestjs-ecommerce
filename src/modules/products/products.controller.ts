import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  type CreateProductDto,
  createProductSchema,
} from './schemas/create-product.schema';
import {
  type UpdateProductDto,
  updateProductSchema,
} from './schemas/update-product.schema';
import {
  type ProductsQueryDto,
  productsQuerySchema,
} from './schemas/products-query.schema';
import { ResponseEnvelopeInterceptor } from '../../interceptors/response-envelope.interceptor';
import { Product } from './products.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Role(Roles.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RoleGuard)
  @Post()
  save(
    @Body(new ZodValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
  ) {
    return this.service.save(createProductDto);
  }

  @UseInterceptors(ResponseEnvelopeInterceptor<Product>)
  @Get()
  list(
    @Query(new ZodValidationPipe(productsQuerySchema))
    productsQueryDto: ProductsQueryDto,
  ) {
    return this.service.list({}, productsQueryDto);
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
  @UseGuards(AccessJwtAuthGuard, RoleGuard)
  @Patch('/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    return this.service.update({ id }, updateProductDto);
  }

  @Role(Roles.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RoleGuard)
  @Delete('/:id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.delete({ id });
  }
}
