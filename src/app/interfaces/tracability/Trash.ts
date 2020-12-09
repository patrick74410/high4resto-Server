import { DeleveryI } from './Delevery';

export interface TrashI {
    id?: string;
    inside: string;
    delevery: DeleveryI;
    causeMessage: string;
}