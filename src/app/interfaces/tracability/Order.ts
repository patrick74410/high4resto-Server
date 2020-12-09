import { PreOrderI } from './PreOrder';

export interface OrderI {
    id?: string;
    preOrder: PreOrderI;
    inside?: string;
    mandatory: string;
    deleveryMode: string;
    statusOfPayement: string;
    timeToTake: string;
    toTake: boolean;
    idAnnonce?: string;
    annonce?: string;
}