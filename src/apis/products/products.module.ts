import { Module } from "@nestjs/common";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductsSaleslocationsService } from "../productsSaleslocations/productsSaleslocations.service";
import { ProductSaleslocation } from "../productsSaleslocations/entities/productSaleslocation.entity";
import { ProductsTagsService } from "../productsTags/productsTags.service";
import { ProductTag } from "../productsTags/entities/productTag.entity";
import { ProductSubscriber } from "./entities/product.subscriber";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductTag,
      ProductSaleslocation,
    ]),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
    ProductsSaleslocationsService,
    ProductsTagsService,
    ProductSubscriber,
  ],
})
export class ProductsModule {}