import { PrepareI } from './Prepare';

export interface ToDeliveryI {
    id?: string;
    prepare: PrepareI;
    inside: string;
    deleveryPerson: string;
    messageToNext: string;
}