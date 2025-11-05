import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProductDto,
  ProductResponseDto,
  ProductStatus,
  UpdateProductDto,
} from 'src/modules/product/dto';
import { ProductService } from 'src/modules/product/product.service';
import { Roles } from 'src/modules/auth/decorators';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

@ApiTags('admin/products')
@ApiBearerAuth('JWT')
@Roles(UserRole.SUPER_ADMIN, UserRole.SUPPORT_ADMIN)
@Controller('admin/products')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List products with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ProductStatus })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: ProductStatus,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
  ) {
    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 10;

    return this.productService.findAll(
      parsedPage,
      parsedLimit,
      categoryId,
      status,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findById(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update product status' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ) {
    return this.productService.updateStatus(id, status);
  }

  @Patch(':id/quantity')
  @ApiOperation({ summary: 'Update product quantity' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productService.updateQuantity(id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archive product' })
  async remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
