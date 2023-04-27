import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductSaleslocation } from "./entities/productSaleslocation.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductsSaleslocationsService {
  constructor(
    @InjectRepository(ProductSaleslocation)
    private readonly productSaleslocationsRepository: Repository<ProductSaleslocation>,
  ) {}

  async create({ productSaleslocation }) {
    const result = await this.productSaleslocationsRepository.save({
      ...productSaleslocation,
    });
    return result;
  }
}