import { HttpException, HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ICreateProductInput, IProductServiceCheckSoldOut, IProductsServiceFindOne, IUpdateProductInput } from "./interfaces/products-service.interface";

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

  // interface의 경우 productId, updateProductInput두개를 다 포함하는걸 만들어도 됨
  async update({ productId, updateProductInput }: IProductsServiceFindOne & IUpdateProductInput): Promise<Product> {
    const product = await this.fetchOne({ productId });

    // 검등은 서비스에서 함
    this.checkSoldOut({ product });
    
    const result = await this.productsRepository.save({
      id: productId,
      ...product, //  수정 후, 수정되지 않은 값까지 모두 객체로 돌려받고 싶을 떄
      ...updateProductInput, // 객체의 키가 중복되면 뒤에 있는 값으로 덮어씌워짐
    });
    return result;
  }

  // 검증로직 분리
  checkSoldOut({ product }: IProductServiceCheckSoldOut): void {
    if (product.isSoldout) throw new UnprocessableEntityException('이미 품절된 상품입니다.');
    // if (product.isSoldout) throw new HttpException('이미 품절된 상품입니다.', HttpStatus.UNPROCESSABLE_ENTITY);

  }
}

// this.productsRepository.save - id가 있으면 수정, 없으면 등록, 반환값은 promise<Product>
// this.productsRepository.update - 결과를 객체로 돌려주지 않는 수정
// this.productsRepository.insert - 결과를 객체로 돌려주지 않는 등록
// this.productsRepository.create - db접속과 관련없고, 등록을 위한 객체만 만들어줌