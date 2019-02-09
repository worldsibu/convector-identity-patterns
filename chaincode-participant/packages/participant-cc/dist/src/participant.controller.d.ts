import { ConvectorController } from '@worldsibu/convector-core-controller';
import { Participant } from './participant.model';
import { ClientIdentity } from 'fabric-shim';
export declare class ParticipantController extends ConvectorController {
    readonly fullIdentity: ClientIdentity;
    register(id: string): Promise<void>;
    changeIdentity(id: string, newIdentity: string): Promise<void>;
    get(id: string): Promise<Participant>;
}
