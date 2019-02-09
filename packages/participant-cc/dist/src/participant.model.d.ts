import { ConvectorModel } from '@worldsibu/convector-core-model';
export interface x509Identities {
    status: boolean;
    fingerprint: string;
}
export declare const x509Identities: any;
export declare class Participant extends ConvectorModel<Participant> {
    readonly type: string;
    name: string;
    msp: string;
    identities: x509Identities[];
}
