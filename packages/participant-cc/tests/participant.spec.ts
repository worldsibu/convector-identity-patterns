// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Participant, ParticipantController } from '../src';

describe('Participant', () => {
  let adapter: MockControllerAdapter;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;

  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    participantCtrl = ClientFactory(ParticipantController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ParticipantController',
        name: join(__dirname, '..')
      }
    ]);
  });

  it('should create a default model', async () => {
    const id = uuid();
    await participantCtrl.register(id, 'Test Participant');

    const justSavedModel = await adapter.getById<Participant>(id);

    expect(justSavedModel.id).to.exist;
  });
});