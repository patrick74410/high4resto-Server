import { ItemCategorieI } from './ItemCategorieI';
import { OrderI } from './tracability/Order';

export class Annonce {
    table:string;
    elements:ElementAnnonce[]=[];
    totalPrice: number=0;
}

export class ElementAnnonce
{
    itemName:string="";
    itemId:string="";
    itemCategory:ItemCategorieI;
    qty:number=0;
    orders:OrderI[]=[];
    price:number=0;
}