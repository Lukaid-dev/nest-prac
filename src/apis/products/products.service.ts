import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ICreateProductInput, IProductServiceCheckSoldOut, IProductsServiceFindOne, IUpdateProductInput } from "./interfaces/products-service.interface";
import { ProductsSaleslocationsService } from "../productsSaleslocations/productsSaleslocations.service";
import { ProductsTagsService } from "../productsTags/productsTags.service";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly procuctsSaleslocationsService: ProductsSaleslocationsService,
    private readonly productsTagsService: ProductsTagsService,
  ) {}

  async fetchAll(): Promise<Product[]> {
    const result = await this.productsRepository.find({ relations: ['productSaleslocation', 'productCategory'] });
    return result;
  }

  async fetchOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    const result = await this.productsRepository.findOne({ where: { id: productId }, relations: ['productSaleslocation', 'productCategory'] });
    return result;
  }

  async create({ createProductInput }: ICreateProductInput): Promise<Product> {
    // const result = await this.productsRepository.save({
    //   ...createProductInput,
    // });

    const { productSaleslocation, productCategoryId, productTags,...product } = createProductInput;

    const location = await this.procuctsSaleslocationsService.create({ productSaleslocation });

    const tagNames = productTags.map((el) => el.replace('#', ''));
    const prevTags = await this.productsTagsService.findByNames({ tagNames });

    const temp = []; 
    tagNames.forEach((el) => {
      const exists = prevTags.find((prevEl) => el === prevEl.name);
      if (!exists) temp.push({ name: el });
    });
    const newTags =  await this.productsTagsService.bulkInsert({ names: temp });

    const tags = [...prevTags, ...newTags.identifiers]

    const result = await this.productsRepository.save({
      ...product,
      productSaleslocation: location,
      productCategory: {
        id: productCategoryId,
      },
      productTags: tags,
    });

    return result;
  }

  // interface의 경우 productId, updateProductInput두개를 다 포함하는걸 만들어도 됨
  async update({ productId, updateProductInput }: IProductsServiceFindOne & IUpdateProductInput): Promise<Product> {
    const product = await this.fetchOne({ productId });

    // 검증은 서비스에서 함
    this.checkSoldOut({ product });

    const { productSaleslocation, productCategoryId, productTags, ...updateProduct } = updateProductInput;
    
    const result = await this.productsRepository.save({
      id: productId,
      ...product, //  수정 후, 수정되지 않은 값까지 모두 객체로 돌려받고 싶을 떄
      // ...updateProductInput, // 객체의 키가 중복되면 뒤에 있는 값으로 덮어씌워짐
      ...updateProduct,
      productSaleslocation: {
        ...product.productSaleslocation,
        ...productSaleslocation,
      },
      productCategory: {
        id: productCategoryId,
      },
    });
    return result;
  }
  
  async delete({ productId }: IProductsServiceFindOne): Promise<boolean>{
    // 1. 찐삭제
    // const result =  await this.productsRepository.delete({ id: productId });
    // return result.affected ? true : false;

    // 2. 소프트삭제
    // const result = await this.productsRepository.update({ id: productId }, { isDeleted: true });
    // return result.affected ? true : false;

    // 3. 소프트삭제 + 날짜까지 - deletedAt
    // const result = await this.productsRepository.softDelete({ id: productId }, { deletedAt: new Date() });

    // 4. typeorm의 softRemove - id로만 삭제, 여러가지 삭제 가능
    // const product = await this.productsRepository.softRemove({ id: productId });

    // 5. typeorm의 softDelete - 여러 컬럼으로 삭제, 한번에 하나만 가능
    const result = await this.productsRepository.softDelete({ id: productId });
    return result.affected ? true : false;

    // 이렇게하면, typeorm에서 조회할 때, deletedAt이 null인 것만 조회됨, entity에 DeleteDateColumn() 데코레이터가 있어야함
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