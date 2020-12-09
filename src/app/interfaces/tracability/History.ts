import { DeleveryI } from './Delevery';

export interface HistoryI {
    id?: string;
    inside: string;
    delevery: DeleveryI;
}