import { StockI } from '../StockI';

export interface PreOrderI {
    id?: string;
    stock: StockI;
    inside?: string;
    messageToNext: string;
    orderNumber: string;
    idCustommer: string;
    destination: string;
}