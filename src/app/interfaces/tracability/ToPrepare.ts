import { OrderI } from './Order';

export interface ToPrepareI {
    id?: string;
    order: OrderI;
    inside: string;
    executor: string;
    messageToNext: string;
}