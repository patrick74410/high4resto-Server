import { ImageCategorieI } from './ImageCategorie';
import { ImageI } from './ImageI';

export interface WebConfigI {
    id?: string;
    title: string;
    logo: ImageI;
    caroussel: ImageCategorieI
    googleMapApi: string;
    auth0Key;
    auth0Domain;
    qty: boolean;
}