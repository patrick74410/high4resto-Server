import { PreOrderI } from './tracability/PreOrder';

export interface CommandeI{
  id?: string;
  number?:number;
  destination: string;
  mandatory: string;
  client?: string;
  deleveryMode?:string;
  status: string;
  inside: string;
  items:PreOrderI[];
  finish:boolean;
  totalPrice: number;
  message: string;
}