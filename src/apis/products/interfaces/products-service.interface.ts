import { CreateProductInput } from '../dto/create-product.input';

// for typescript

export interface ICreateProductInput {
  createProductInput: CreateProductInput;
}

export interface IProductsServiceFindOne {
  productId: string;
}