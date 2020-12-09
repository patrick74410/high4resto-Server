import { GpsI } from './GpsI';
import { ImageI } from './ImageI';
import { KeyMapI } from './KeymapI'
// Identité de l'établissement
export interface IdentiteI {
    id: string;
    // Info de base
    nomEtablissement: string;
    siret: string;
    logo: ImageI;
    // Adresse
    zip: string;
    city: string;
    number: string;
    adresse: string;
    complement: string;
    contact: KeyMapI[];
    coordonnee: GpsI;

    // Description de l'établissement
    description: string;
}