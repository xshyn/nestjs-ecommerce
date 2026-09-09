import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { AccessJwtAuthGuard } from '../../guards/access-jwt-auth.guard';
import { Role } from '../../decorators/role.decorator';
import { Roles } from '../users/types/roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  UpdateInventoryDto,
  updateInventorySchema,
} from './schemas/update-inventory.schema';
import {
  InventoryQueryDto,
  inventoryQuerySchema,
} from './schemas/inventory-query.schema';
import { ResponseEnvelopeInterceptor } from '../../interceptors/response-envelope.interceptor';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateResponse } from '../../responses/update.response';
import { ForbiddenResponse } from '../../responses/forbidden.response';
import { ValidationFailedResponse } from '../../responses/validation-failed.response';
import { UnauthorizedResponse } from '../../responses/unauthorized.response';
import { InventoryResponse } from './responses/inventory.response';
import { InventoryListResponse } from './responses/inventory-list.response';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all inventories' })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiOkResponse({
    type: InventoryListResponse,
  })
  @Role(Roles.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RoleGuard)
  @UseInterceptors(ResponseEnvelopeInterceptor<Inventory>)
  @Get()
  find(
    @Query(new ZodValidationPipe(inventoryQuerySchema))
    inventoryQueryDto: InventoryQueryDto,
  ) {
    return this.service.find(inventoryQueryDto);
  }

  @ApiOperation({ summary: 'Get inventory of a product' })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiOkResponse({
    type: InventoryResponse,
  })
  @Get(':productId')
  findOne(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.service.findOne({ where: { productId } });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inventory of a product' })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponse })
  @ApiBadRequestResponse({ type: ValidationFailedResponse })
  @ApiForbiddenResponse({ type: ForbiddenResponse })
  @ApiOkResponse({
    type: UpdateResponse,
  })
  @Role(Roles.ADMIN)
  @UseGuards(AccessJwtAuthGuard, RoleGuard)
  @Patch(':productId')
  update(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body(new ZodValidationPipe(updateInventorySchema))
    updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.service.update({ productId }, updateInventoryDto);
  }
}
