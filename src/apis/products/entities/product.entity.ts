import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductSaleslocation } from 'src/apis/productsSaleslocations/entities/productSaleslocation.entity';
import { ProductTag } from 'src/apis/productsTags/entities/productTag.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => Int)
  price: number;

  @Column({default: false})
  @Field(() => Boolean)
  isSoldout: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @JoinColumn() // 두 테이블 중 중심이 되는 테이블에 적어줌
  @OneToOne(() => ProductSaleslocation) // 얘는 두 테이블 모두 적어도 되는데 굳이 적어주지 않아도 됨
  @Field(() => ProductSaleslocation)
  productSaleslocation: ProductSaleslocation;

  @ManyToOne(() => ProductCategory) // Product가 Many, ProductCategory가 One
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinTable() // 두 테이블 중 한 테이블에만 적어주면 됨
  @ManyToMany(() => ProductTag, (productTags) => productTags.products) // 반대편에서 이 엔티티를 참조할 때 사용할 필드의 이름
  @Field(() => [ProductTag])
  productTags: ProductTag[];
}