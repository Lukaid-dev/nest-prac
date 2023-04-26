import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import { CreateProductInput } from "./dto/create-product.input";
import { Product } from "./entities/product.entity";

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productsService.fetchAll();
  }

  @Query(() => Product)
  fetchProduct(
    @Args('productId') productId: string,
  ): Promise<Product> {
    return this.productsService.fetchOne({ productId });
  }

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }
}