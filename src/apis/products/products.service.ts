import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ICreateProductInput, IProductsServiceFindOne } from "./interfaces/products-service.interface";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async fetchAll(): Promise<Product[]> {
    const result = await this.productsRepository.find();
    return result;
  }

  async fetchOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    const result = await this.productsRepository.findOne({ where: { id: productId } });
    return result;
  }

  async create({ createProductInput }: ICreateProductInput): Promise<Product> {
    const result = await this.productsRepository.save({
      ...createProductInput,
    });
    return result;
  }

}