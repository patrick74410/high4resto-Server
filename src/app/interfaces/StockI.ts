
import { HoraireI } from './HoraireI';
import { ItemCarteI } from './ItemCarteI';

export interface StockI {
    id?: string;
    item: ItemCarteI;
    // Quand a-t-il été ajouté
    inside?: string;
    username?: string;
}