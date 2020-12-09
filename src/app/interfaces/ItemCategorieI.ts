import { ImageI } from './ImageI';
// Catégorie de menu
export interface ItemCategorieI {
    id?: string;
    // Nom de la catégorie
    name: string;
    // Présentation de la catégorie
    description: string;
    // Ordre d'affichage
    order?: Number;
    // Miniature
    iconImage?: ImageI;
    // Image pour la présentation
    image?: ImageI;
}