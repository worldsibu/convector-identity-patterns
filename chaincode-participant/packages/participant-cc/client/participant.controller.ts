import * as yup from 'yup';

import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core-controller';
import { BaseStorage } from '@worldsibu/convector-core-storage';

import { Participant } from '../src/participant.model';
import { ClientIdentity } from 'fabric-shim';
import { ControllerAdapter } from '@worldsibu/convector-core-adapter';


export class ParticipantControllerClient extends ConvectorController {
  public name = 'participant';

  constructor(public adapter: ControllerAdapter, public user?: string) {
    super()
  }

  public async register(
    
    id: string,
  ) {

          return await this.adapter.invoke(this.name, 'register', this.user, id);
        
  }

  public async changeIdentity(
    
    id: string,
    
    newIdentity: string
  ) {

          return await this.adapter.invoke(this.name, 'changeIdentity', this.user, id, newIdentity);
        
  }

  public async get(
    
    id: string
  ) {

          return await this.adapter.invoke(this.name, 'get', this.user, id);
        
  }

  get fullIdentity(): ClientIdentity {
    const stub = (BaseStorage.current as any).stubHelper;
    return new ClientIdentity(stub.getStub());
  };
}