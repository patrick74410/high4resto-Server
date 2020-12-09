export interface PromotionI {
    // Définition d'une promotion
    id?: string;
    // Nom
    name: string;
    // Montant de la réduction
    reduction: Number;
    // Quand ?
    heureDebut: string;
    heureFin: string;
    dateDebut: string;
    dateFin: string;
    // Tableau de taille 7 pour chaque jour de la semaine
    jourValide: boolean[];
    jourFerie: boolean;
    // En euro ou en pourcentage ?
    pourcentage: boolean;
}