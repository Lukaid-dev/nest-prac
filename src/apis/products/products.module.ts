import { Module } from "@nestjs/common";
import { ProductsResolver } from "./products.resolver";
import { ProductsService } from "./products.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ProductsSaleslocationsService } from "../productsSaleslocations/productsSaleslocations.service";
import { ProductSaleslocation } from "../productsSaleslocations/entities/productSaleslocation.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductSaleslocation,
    ]),
  ],
  providers: [
    ProductsResolver, //
    ProductsService,
    ProductsSaleslocationsService,
  ],
})
export class ProductsModule {}