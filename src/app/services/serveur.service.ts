import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../environement/environement'
import { ItemCategorieI } from '../interfaces/ItemCategorieI';
import { StockI } from '../interfaces/StockI';
import { PreOrderI } from '../interfaces/tracability/PreOrder';
import { OrderI } from '../interfaces/tracability/Order';
import { TableI } from '../interfaces/TableI';
import { CommandeI } from '../interfaces/CommandeI';

@Injectable({
  providedIn: 'root'
})

export class ServeurService {
  private findCategoryUrl = environment.apiUrl + '/serveur/findCategory/';
  private findStockUrl = environment.apiUrl + '/serveur/findStocks/';
  private findPreOrderUrl = environment.apiUrl + '/serveur/findPreOrders/';
  private moveToPreOrderUrl = environment.apiUrl + '/serveur/moveToPreorder/';
  private moveToOrderUrl = environment.apiUrl + '/serveur/moveToOrder/';
  private moveBackToStockUrl = environment.apiUrl + '/serveur/moveBackToStock/';
  private findOrderUrl=environment.apiUrl + '/serveur/findOrder/';
  private moveToTakeUrl= environment.apiUrl + '/serveur/moveToTake/';
  private moveManyToOrderUrl=environment.apiUrl + '/serveur/moveManyToOrder/';
  private moveManyToTakeUrl=environment.apiUrl + '/serveur/moveManyToTake/';
  private createCommandeUrl=environment.apiUrl + '/serveur/createCommande/';
  private updateCommandeUrl=environment.apiUrl + '/serveur/updateCommande/';
  private findCommandeUrl=environment.apiUrl + '/serveur/findCommande/';
  private findTableUrl=environment.apiUrl + '/serveur/findTable/';
  private deleteTableUrl=environment.apiUrl + '/serveur/deleteTable/';
  private insertTableUrl=environment.apiUrl + '/serveur/insertTable/';
  private updateTableUrl=environment.apiUrl + '/serveur/updateTable/';

  private httpOptionsUpdate = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  createCommande(table: string,mandatory: string): Observable<CommandeI> {
    return this.http.get<CommandeI>(this.createCommandeUrl+table+"/"+mandatory);
  }

  updateCommande(commande:CommandeI): Observable<CommandeI>{
    return this.http.put<CommandeI>(this.updateCommandeUrl,commande,this.httpOptionsUpdate)
  }

  findCommande(table: string,mandatory: string): Observable<CommandeI[]>{
    return this.http.get<CommandeI[]>(this.findCommandeUrl+table+'/'+mandatory);
  }

  findTable():Observable<TableI[]>{
    return this.http.get<TableI[]>(this.findTableUrl);
  }

  deleteTable(table:TableI):Observable<any> {
    return this.http.delete(this.deleteTableUrl+table.id)
  }

  insertTable(table:TableI):Observable<TableI>{
    return this.http.put<TableI>(this.insertTableUrl,table,this.httpOptionsUpdate);
  }

  updateTable(table:TableI): Observable<TableI>{
    return this.http.put<TableI>(this.updateTableUrl, table, this.httpOptionsUpdate)
  }

  getCategory(): Observable<ItemCategorieI[]> {
    return this.http.get<ItemCategorieI[]>(this.findCategoryUrl)
  }

  getStock(category: ItemCategorieI): Observable<StockI[]> {
    return this.http.get<StockI[]>(this.findStockUrl + category.id);
  }

  getPreOrder(table: string): Observable<PreOrderI[]> {
    return this.http.get<PreOrderI[]>(this.findPreOrderUrl + table);
  }

  getOrder(table: string):Observable<OrderI[]> {
    return this.http.get<OrderI[]>(this.findOrderUrl+table)
  }

  moveToPreOrder(preOrder: PreOrderI,commandeId:string): Observable<PreOrderI> {
    return this.http.put<PreOrderI>(this.moveToPreOrderUrl+commandeId, preOrder, this.httpOptionsUpdate);
  }

  moveToOrder(order: OrderI): Observable<OrderI> {
    return this.http.put<OrderI>(this.moveToOrderUrl, order, this.httpOptionsUpdate);
  }

  moveToTake(order: OrderI): Observable<OrderI> {
    return this.http.put<OrderI>(this.moveToTakeUrl, order, this.httpOptionsUpdate);
  }

  moveManyToOrder(table:string,mandatory: string):Observable<OrderI>{
    return this.http.get<OrderI>(this.moveManyToOrderUrl+table+"/"+mandatory);
  }

  moveManyToTake(table:string,category: string):Observable<OrderI>{
    return this.http.get<OrderI>(this.moveManyToTakeUrl+table+"/"+category);
  }

  moveBackToStock(preOrder: PreOrderI,commandeId:string): Observable<StockI> {
    return this.http.put<StockI>(this.moveBackToStockUrl+commandeId, preOrder, this.httpOptionsUpdate);
  }

  constructor(private http: HttpClient) { }
}