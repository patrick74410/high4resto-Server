import { ArticleCategorieI } from './ArticleCategorieI';
import { ImageI } from './ImageI';

// Un Article
export interface ArticleI {
    id?: string;
    // Il est inclus dans quelle catégorie ?
    categorie: ArticleCategorieI;
    // L'image de l'article
    image?: ImageI;
    // Mis en avant ?
    onTop?: boolean;
    // Visible ?
    visible?: boolean;
    // Le titre
    title: string;
    // Tous le texte qu'il y a avant un bouton en savoir plus ...
    resume?: string;
    // Le contenu complet
    content: string;
    // La date de publication
    date: string;
    // Le nom de l'auteur
    author: string;
}