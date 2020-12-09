import { ItemCarteI } from './ItemCarteI';

export interface ClientI {
    id?: string;
    name: string;
    lastName: string;
    email: string;
    adresseL1: string;
    adresseL2: string;
    zip: string;
    city: string;
    sendInfo: boolean;
    currentPanier: ItemCarteI[];
}