import { InjectRepository } from "@nestjs/typeorm";
import { ProductTag } from "./entities/productTag.entity";
import { In, Repository } from "typeorm";
import { IProductsTagsServiceBulkInsert, IProductsTagsServiceFindByNames } from "./interfaces/products-tags-service.interface";

export class ProductsTagsService {
  constructor(
    @InjectRepository(ProductTag)
    private readonly productTagsRepository: Repository<ProductTag>,
  ) {}

  findByNames ({ tagNames }:IProductsTagsServiceFindByNames) {
    return this.productTagsRepository.find({ where: { name: In(tagNames) } });
  }

  bulkInsert ({ names }: IProductsTagsServiceBulkInsert) {
    return this.productTagsRepository.insert(names);

  }
}

