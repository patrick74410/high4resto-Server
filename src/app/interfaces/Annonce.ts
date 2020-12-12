import { OrderI } from './tracability/Order';

export class Annonce {
    table:string;
    elements:ElementAnnonce[]=[];
}

export class ElementAnnonce
{
    itemName:string="";
    itemId:string="";
    qty:number=0;
    orders:OrderI[]=[];
}