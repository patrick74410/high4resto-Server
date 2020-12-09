import { ArticleCategorieI } from './ArticleCategorieI';
import { ArticleI } from './ArticleI';
import { HoraireI } from './HoraireI';
import { IdentiteI } from './IdentiteI';
import { ImageI } from './ImageI';
import { MetaTagI } from './MetaTagI';
import { WebConfigI } from './WebConfigI';

export interface HomePageI {
    webConfig: WebConfigI;
    metaTag: MetaTagI;
    identite: IdentiteI;
    articleCategorie: ArticleCategorieI[];
    onTop: ArticleI[];
    caroussel: ImageI[];
    horaire: HoraireI;
}