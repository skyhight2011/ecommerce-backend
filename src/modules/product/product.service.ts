import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto';
import { ProductStatus } from './enums';
import { plainToClass } from 'class-transformer';
import { PRODUCT_MESSAGES } from './constants/product-messages.constant';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    status?: ProductStatus,
    isActive?: boolean,
    isFeatured?: boolean,
    search?: string,
  ): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;
    const where: {
      categoryId?: string;
      status?: ProductStatus;
      isActive?: boolean;
      isFeatured?: boolean;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
        slug?: { contains: string; mode: 'insensitive' };
        sku?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
          variants: {
            where: {
              isActive: true,
            },
          },
          attributes: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((product) =>
        plainToClass(ProductResponseDto, product),
      ),
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<ProductResponseDto | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return plainToClass(ProductResponseDto, product);
  }

  async findBySlug(slug: string): Promise<ProductResponseDto | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return plainToClass(ProductResponseDto, product);
  }

  async findByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    return this.findAll(page, limit, categoryId);
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${createProductDto.categoryId} not found`,
      );
    }

    // Check if slug already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Product with slug ${createProductDto.slug} already exists`,
      );
    }

    // Check if SKU already exists (if provided)
    if (createProductDto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: createProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException(
          `Product with SKU ${createProductDto.sku} already exists`,
        );
      }
    }

    // Check if barcode already exists (if provided)
    if (createProductDto.barcode) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: createProductDto.barcode },
      });

      if (existingBarcode) {
        throw new ConflictException(
          `Product with barcode ${createProductDto.barcode} already exists`,
        );
      }
    }

    // Prepare product data
    const productData: {
      name: string;
      slug: string;
      description?: string;
      shortDescription?: string;
      price: string;
      comparePrice?: string;
      costPrice?: string;
      categoryId: string;
      sku?: string;
      barcode?: string;
      trackQuantity: boolean;
      quantity: number;
      lowStockThreshold: number;
      weight?: string;
      dimensions?: Record<string, any>;
      material?: string;
      brand?: string;
      status: ProductStatus;
      isActive: boolean;
      isDigital: boolean;
      isFeatured: boolean;
      metaTitle?: string;
      metaDescription?: string;
      publishedAt?: Date;
      images?: {
        create: Array<{
          url: string;
          alt?: string;
          sortOrder: number;
          isPrimary: boolean;
        }>;
      };
      variants?: {
        create: Array<{
          name: string;
          sku?: string;
          price?: string;
          quantity: number;
          attributes: Record<string, any>;
          isActive: boolean;
        }>;
      };
      attributes?: {
        create: Array<{
          name: string;
          value: string;
          sortOrder: number;
        }>;
      };
    } = {
      name: createProductDto.name,
      slug: createProductDto.slug,
      description: createProductDto.description,
      shortDescription: createProductDto.shortDescription,
      price: createProductDto.price,
      comparePrice: createProductDto.comparePrice,
      costPrice: createProductDto.costPrice,
      categoryId: createProductDto.categoryId,
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      trackQuantity: createProductDto.trackQuantity ?? true,
      quantity: createProductDto.quantity ?? 0,
      lowStockThreshold: createProductDto.lowStockThreshold ?? 5,
      weight: createProductDto.weight,
      dimensions: createProductDto.dimensions,
      material: createProductDto.material,
      brand: createProductDto.brand,
      status: createProductDto.status ?? ProductStatus.DRAFT,
      isActive: createProductDto.isActive ?? true,
      isDigital: createProductDto.isDigital ?? false,
      isFeatured: createProductDto.isFeatured ?? false,
      metaTitle: createProductDto.metaTitle,
      metaDescription: createProductDto.metaDescription,
    };

    // Add images if provided
    if (createProductDto.images && createProductDto.images.length > 0) {
      productData.images = {
        create: createProductDto.images.map((img) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: img.sortOrder ?? 0,
          isPrimary: img.isPrimary ?? false,
        })),
      };
    }

    // Add variants if provided
    if (createProductDto.variants && createProductDto.variants.length > 0) {
      productData.variants = {
        create: createProductDto.variants.map((variant) => ({
          name: variant.name,
          sku: variant.sku,
          price: variant.price,
          quantity: variant.quantity ?? 0,
          attributes: variant.attributes,
          isActive: variant.isActive ?? true,
        })),
      };
    }

    // Add attributes if provided
    if (createProductDto.attributes && createProductDto.attributes.length > 0) {
      productData.attributes = {
        create: createProductDto.attributes.map((attr) => ({
          name: attr.name,
          value: attr.value,
          sortOrder: attr.sortOrder ?? 0,
        })),
      };
    }

    // Set publishedAt if status is PUBLISHED
    if (productData.status === ProductStatus.PUBLISHED) {
      productData.publishedAt = new Date();
    }

    const product = await this.prisma.product.create({
      data: productData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return plainToClass(ProductResponseDto, product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    // Verify product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Verify category exists if categoryId is being updated
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with id ${updateProductDto.categoryId} not found`,
        );
      }
    }

    // Check if SKU already exists (if provided and different from current)
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }

    // Check if barcode already exists (if provided and different from current)
    if (
      updateProductDto.barcode &&
      updateProductDto.barcode !== existingProduct.barcode
    ) {
      const existingBarcode = await this.prisma.product.findUnique({
        where: { barcode: updateProductDto.barcode },
      });

      if (existingBarcode) {
        throw new ConflictException(
          `Product with barcode ${updateProductDto.barcode} already exists`,
        );
      }
    }

    // Prepare update data
    const updateData: {
      name?: string;
      description?: string;
      shortDescription?: string;
      price?: string;
      comparePrice?: string;
      costPrice?: string;
      categoryId?: string;
      sku?: string;
      barcode?: string;
      trackQuantity?: boolean;
      quantity?: number;
      lowStockThreshold?: number;
      weight?: string;
      dimensions?: Record<string, any>;
      material?: string;
      brand?: string;
      status?: ProductStatus;
      isActive?: boolean;
      isDigital?: boolean;
      isFeatured?: boolean;
      metaTitle?: string;
      metaDescription?: string;
      publishedAt?: Date;
    } = {
      ...(updateProductDto.name && { name: updateProductDto.name }),
      ...(updateProductDto.description !== undefined && {
        description: updateProductDto.description,
      }),
      ...(updateProductDto.shortDescription !== undefined && {
        shortDescription: updateProductDto.shortDescription,
      }),
      ...(updateProductDto.price && { price: updateProductDto.price }),
      ...(updateProductDto.comparePrice !== undefined && {
        comparePrice: updateProductDto.comparePrice,
      }),
      ...(updateProductDto.costPrice !== undefined && {
        costPrice: updateProductDto.costPrice,
      }),
      ...(updateProductDto.categoryId && {
        categoryId: updateProductDto.categoryId,
      }),
      ...(updateProductDto.sku !== undefined && { sku: updateProductDto.sku }),
      ...(updateProductDto.barcode !== undefined && {
        barcode: updateProductDto.barcode,
      }),
      ...(updateProductDto.trackQuantity !== undefined && {
        trackQuantity: updateProductDto.trackQuantity,
      }),
      ...(updateProductDto.quantity !== undefined && {
        quantity: updateProductDto.quantity,
      }),
      ...(updateProductDto.lowStockThreshold !== undefined && {
        lowStockThreshold: updateProductDto.lowStockThreshold,
      }),
      ...(updateProductDto.weight !== undefined && {
        weight: updateProductDto.weight,
      }),
      ...(updateProductDto.dimensions !== undefined && {
        dimensions: updateProductDto.dimensions,
      }),
      ...(updateProductDto.material !== undefined && {
        material: updateProductDto.material,
      }),
      ...(updateProductDto.brand !== undefined && {
        brand: updateProductDto.brand,
      }),
      ...(updateProductDto.status !== undefined && {
        status: updateProductDto.status,
      }),
      ...(updateProductDto.isActive !== undefined && {
        isActive: updateProductDto.isActive,
      }),
      ...(updateProductDto.isDigital !== undefined && {
        isDigital: updateProductDto.isDigital,
      }),
      ...(updateProductDto.isFeatured !== undefined && {
        isFeatured: updateProductDto.isFeatured,
      }),
      ...(updateProductDto.metaTitle !== undefined && {
        metaTitle: updateProductDto.metaTitle,
      }),
      ...(updateProductDto.metaDescription !== undefined && {
        metaDescription: updateProductDto.metaDescription,
      }),
      ...(updateProductDto.publishedAt !== undefined && {
        publishedAt: updateProductDto.publishedAt,
      }),
    };

    // Set publishedAt if status is being changed to PUBLISHED
    if (
      updateProductDto.status === ProductStatus.PUBLISHED &&
      (existingProduct.status as ProductStatus) !== ProductStatus.PUBLISHED
    ) {
      updateData.publishedAt = new Date();
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return plainToClass(ProductResponseDto, product);
  }

  async delete(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Soft delete by setting status to ARCHIVED and isActive to false
    await this.prisma.product.update({
      where: { id },
      data: {
        status: ProductStatus.ARCHIVED,
        isActive: false,
      },
    });

    return { message: 'Product archived successfully' };
  }

  async updateStatus(
    id: string,
    status: ProductStatus,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updateData: {
      status: ProductStatus;
      publishedAt?: Date;
    } = { status };

    // Set publishedAt if status is being changed to PUBLISHED
    if (
      status === ProductStatus.PUBLISHED &&
      (product.status as ProductStatus) !== ProductStatus.PUBLISHED
    ) {
      updateData.publishedAt = new Date();
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return plainToClass(ProductResponseDto, updatedProduct);
  }

  async updateQuantity(
    id: string,
    quantity: number,
  ): Promise<ProductResponseDto> {
    if (quantity < 0) {
      throw new BadRequestException(PRODUCT_MESSAGES.QUANTITY_NEGATIVE);
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const updateData: {
      quantity: number;
      status?: ProductStatus;
    } = { quantity };

    // Auto-update status if quantity is 0
    if (
      quantity === 0 &&
      (product.status as ProductStatus) !== ProductStatus.ARCHIVED
    ) {
      updateData.status = ProductStatus.OUT_OF_STOCK;
    } else if (
      quantity > 0 &&
      (product.status as ProductStatus) === ProductStatus.OUT_OF_STOCK &&
      (product.status as ProductStatus) !== ProductStatus.DRAFT
    ) {
      // Restore to PUBLISHED if it was OUT_OF_STOCK
      updateData.status = ProductStatus.PUBLISHED;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        variants: {
          where: {
            isActive: true,
          },
        },
        attributes: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return plainToClass(ProductResponseDto, updatedProduct);
  }
}
