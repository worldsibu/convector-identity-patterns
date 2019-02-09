import * as yup from 'yup';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';

import { Product } from '../src/product.model';
import { Participant } from 'participant-cc';
import { ControllerAdapter } from '@worldsibu/convector-core-adapter';


export class ProductControllerClient extends ConvectorController {
  public name = 'product';

  constructor(public adapter: ControllerAdapter, public user?: string) {
    super()
  }

  
  public async create(
    
    id: string,
    
    name: string,
    
    ownerID: string,
  ) {

          return await this.adapter.invoke(this.name, 'create', this.user, id, name, ownerID);
        
  }

  
  public async update(
    
    id: string,
    
    name: string,
  ) {

          return await this.adapter.invoke(this.name, 'update', this.user, id, name);
        
  }

  
  public async get(
    
    id: string
  ) {

          return await this.adapter.invoke(this.name, 'get', this.user, id);
        
  }
}