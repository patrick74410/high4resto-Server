import { OptionItemI } from './OptionItem';
// Une liste d'options comme Votre steak ? Bleu, saignant , a point ?
export interface OptionsItemI {
    id?: string;
    // Dénomination de l'option
    label: string;
    // Les choix disponibles
    options: OptionItemI[];
    // Check box ou radio ?
    unique: boolean;
}