import { ImageI } from './ImageI';

export interface ImageCategorieI {
    // Catégorie d'images
    id?: string;
    // Nom de la catégorie
    name: string;
    // Description
    description: string;
    // Est-ce un album photo ?
    visible: boolean;
    // La photo en avant
    topImage?: ImageI;
}