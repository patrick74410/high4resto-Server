import { ItemCategorieI } from './ItemCategorieI';
import { AllergeneI } from './AllergeneI'
import { ImageI } from './ImageI';
import { TvaI } from './TvaI';
import { OptionsItemI } from './OptionsItem';
import { PromotionI } from './PromotionI';

export interface ItemCarteI {
    // Elément de la carte
    id: string;
    // Nom
    name: string;
    // Description
    description: string;
    // Prix
    price: Number;
    // Ordre d'affichage
    order: Number;
    // Image
    sourceImage: ImageI;
    // Entrée? plat ? dessert?
    categorie: ItemCategorieI;
    // Liste d'allergènes
    allergenes: AllergeneI[];
    // Taux TVA
    tva: TvaI;
    // Options associées
    options: OptionsItemI[];
    // Visible ?
    visible: boolean;
    // Liste de promotions
    promotions: PromotionI[];
    // Quantitée disponible
    stock: number;
    remarque:string;
}