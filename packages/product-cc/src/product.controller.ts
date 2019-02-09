import * as yup from 'yup';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Product } from './product.model';
import { Participant } from 'participant-cc';

@Controller('product')
export class ProductController extends ConvectorController {
  @Invokable()
  public async create(
    @Param(yup.string())
    id: string,
    @Param(yup.string())
    name: string,
    @Param(yup.string())
    ownerID: string,
  ) {
    let product = new Product(id);
    product.name = name;
    product.assetOwner = ownerID;
    await product.save();
  }

  @Invokable()
  public async update(
    @Param(yup.string())
    id: string,
    @Param(yup.string())
    name: string,
  ) {
    let product = await Product.getOne(id);
    console.log('Product:');
    console.log(product);
    if (!product || !product.id) {
      throw new Error(`Product with id ${id} does not exist`);
    }
    const owner = await Participant.getOne(product.assetOwner);
    console.log('Product owner:');
    console.log(owner);

    if (!owner || !owner.id || !owner.identities) {
      throw new Error('Referenced owner participant does not exist in the ledger');
    }

    const ownerCurrentIdentity = owner.identities.filter(identity => identity.status === true)[0];
    if (ownerCurrentIdentity.fingerprint === this.sender) {
      console.log('Identity can update product');
      product.name = name;
      await product.save();
    } else {
      throw new Error(`Identity ${this.sender} is not allowed to update product just ${owner.name} ${ownerCurrentIdentity.fingerprint} can`);
    }
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    id: string
  ) {
    return await Product.getOne(id);
  }
}