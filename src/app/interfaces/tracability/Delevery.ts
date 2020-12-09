import { ToDeliveryI } from './ToDelivery';

export interface DeleveryI {
    id?: string;
    toDelivery: ToDeliveryI;
    inside: string;
}