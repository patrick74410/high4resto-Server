import { HoraireI } from './HoraireI';

export interface ItemDisponibilityI {
    id?: string;
    disponibility?: HoraireI;
    dateDebut?: string;
    dateFin?: string;
    always?: boolean;
}