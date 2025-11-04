import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductStatus,
} from './dto';
import { Public } from '../auth/decorators';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProductStatus,
    example: ProductStatus.PUBLISHED,
  })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: ProductStatus,
    @Query('isActive') isActive?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('search') search?: string,
  ) {
    return this.productService.findAll(
      page,
      limit,
      categoryId,
      status,
      isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
      search,
    );
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    if (!id) {
      throw new BadRequestException('Product id is required');
    }
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (!product.isActive) {
      throw new ForbiddenException('Product is not active');
    }
    return product;
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get a product by slug' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    if (!slug) {
      throw new BadRequestException('Product slug is required');
    }
    const product = await this.productService.findBySlug(slug);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (!product.isActive) {
      throw new ForbiddenException('Product is not active');
    }
    return product;
  }

  @Get('category/:categoryId')
  @Public()
  @ApiOperation({ summary: 'Get products by category with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    if (!categoryId) {
      throw new BadRequestException('Category id is required');
    }
    return this.productService.findByCategory(categoryId, page, limit);
  }

  @Post()
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Product with slug, SKU, or barcode already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Product with SKU or barcode already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    if (!id) {
      throw new BadRequestException('Product id is required');
    }
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete (archive) a product' })
  @ApiResponse({
    status: 200,
    description: 'Product archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('Product id is required');
    }
    return this.productService.delete(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update product status' })
  @ApiResponse({
    status: 200,
    description: 'Product status updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ): Promise<ProductResponseDto> {
    if (!id) {
      throw new BadRequestException('Product id is required');
    }
    if (!status) {
      throw new BadRequestException('Status is required');
    }
    if (!Object.values(ProductStatus).includes(status)) {
      throw new BadRequestException('Invalid product status');
    }
    return this.productService.updateStatus(id, status);
  }

  @Patch(':id/quantity')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update product quantity' })
  @ApiResponse({
    status: 200,
    description: 'Product quantity updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid quantity',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<ProductResponseDto> {
    if (!id) {
      throw new BadRequestException('Product id is required');
    }
    if (quantity === undefined || quantity === null) {
      throw new BadRequestException('Quantity is required');
    }
    return this.productService.updateQuantity(id, quantity);
  }
}
