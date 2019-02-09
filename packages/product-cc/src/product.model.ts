import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Product extends ConvectorModel<Product> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.product';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  // Reference to a participant id
  public assetOwner: string;
}