import { ImageI } from './ImageI';
// Catégorie d'articles
export interface ArticleCategorieI {
    id?: string;
    // Nom de la catégorie
    name: string;
    // Présentation de la catégorie
    description: string;
    // Ordre d'affichage
    order?: Number;
    // Image pour la miniature
    iconImage?: ImageI;
    // Image de la présentation de l'article
    image?: ImageI;
    //
    visible: boolean;
}