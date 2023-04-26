import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../entities/product.entity';

// for typescript

export interface ICreateProductInput {
  createProductInput: CreateProductInput;
}

export interface IUpdateProductInput {
  updateProductInput: UpdateProductInput;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductServiceCheckSoldOut {
  product: Product;
}