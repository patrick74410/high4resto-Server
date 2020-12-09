import { ImageCategorieI } from './ImageCategorie';

export interface ImageI {
   // Image
   id?: string;
   // Description de l'image
   description: string;
   // Elément du lien de l'image https://monhebergement/api/images/find/{{gridId}}/fileName
   gridId?: string;
   // Elément du lien de la miniature
   miniGridId: string;
   // Nom du fichier
   fileName: string;
   // Catégorie a laquelle l'image appartient
   categorie: ImageCategorieI;
   // Atribut Alt
   alt: string;
   // Lien de l'image
   link: string;
}