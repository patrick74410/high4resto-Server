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
import { Annonce } from '../interfaces/Annonce';
import { PrepareI } from '../interfaces/tracability/Prepare';
import { ToDeliveryI } from '../interfaces/tracability/ToDelivery';
import { DeleveryI } from '../interfaces/tracability/Delevery';
import { HistoryI } from '../interfaces/tracability/History';
import { TrashI } from '../interfaces/tracability/Trash';

@Injectable({
  providedIn: 'root'
})

export class ServeurService {
  private findCategoryUrl = environment.apiUrl + '/serveur/findCategory/';
  private findStockUrl = environment.apiUrl + '/serveur/findStocks/';
  private findPreOrderUrl = environment.apiUrl + '/serveur/findPreOrders/';
  private findOrderUrl=environment.apiUrl + '/serveur/findOrder/';
  private findCommandeUrl=environment.apiUrl + '/serveur/findCommande/';
  private findTableUrl=environment.apiUrl + '/serveur/findTable/';
  private findPreparedUrl=environment.apiUrl + '/serveur/findPrepared/';
  private findToDeleveryUrl=environment.apiUrl + '/serveur/findToDelevery/';
  private findDeleveryUrl=environment.apiUrl + '/serveur/findDelevery/';
  private moveToToDeleveryUrl=environment.apiUrl + '/serveur/moveToToDelevery/';
  private moveToDeleveryUrl=environment.apiUrl + '/serveur/moveToDelevery/';
  private moveToHistoryUrl=environment.apiUrl + '/serveur/moveToHistory/';
  private moveToPreOrderUrl = environment.apiUrl + '/serveur/moveToPreorder/';
  private moveToOrderUrl = environment.apiUrl + '/serveur/moveToOrder/';
  private moveBackToStockUrl = environment.apiUrl + '/serveur/moveBackToStock/';
  private moveToTakeUrl= environment.apiUrl + '/serveur/moveToTake/';
  private createCommandeUrl=environment.apiUrl + '/serveur/createCommande/';
  private updateCommandeUrl=environment.apiUrl + '/serveur/updateCommande/';
  private updateTableUrl=environment.apiUrl + '/serveur/updateTable/';
  private deleteTableUrl=environment.apiUrl + '/serveur/deleteTable/';
  private insertTableUrl=environment.apiUrl + '/serveur/insertTable/';
  private movePreparedToTrashUrl=environment.apiUrl + '/serveur/movePreparedToTrash/';
  private moveToDeleveryToTrashUrl=environment.apiUrl + '/serveur/moveToDeleveryToTrash/';
  private moveDeleveryToTrashUrl=environment.apiUrl + '/serveur/moveDeleveryToTrash/';

  private httpOptionsUpdate = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  findPrepared(mandatory: string): Observable<PrepareI[]>
  {
    return this.http.get<PrepareI[]>(this.findPreparedUrl+mandatory);
  }

  findToDelevery(mandatory: string):Observable<ToDeliveryI[]>
  {
    return this.http.get<ToDeliveryI[]>(this.findToDeleveryUrl+mandatory);
  }

  findDelevery(mandatory: string): Observable<DeleveryI[]>
  {
    return this.http.get<DeleveryI[]>(this.findDeleveryUrl+mandatory);
  }

  findCommande(table: string,mandatory: string): Observable<CommandeI[]>{
    return this.http.get<CommandeI[]>(this.findCommandeUrl+table+'/'+mandatory);
  }

  findTable():Observable<TableI[]>{
    return this.http.get<TableI[]>(this.findTableUrl);
  }

  createCommande(table: string,mandatory: string): Observable<CommandeI> {
    return this.http.get<CommandeI>(this.createCommandeUrl+table+"/"+mandatory);
  }

  updateCommande(commande:CommandeI): Observable<CommandeI>{
    return this.http.put<CommandeI>(this.updateCommandeUrl,commande,this.httpOptionsUpdate)
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

  moveToPreOrder(preOrder: PreOrderI): Observable<PreOrderI> {
    return this.http.put<PreOrderI>(this.moveToPreOrderUrl, preOrder, this.httpOptionsUpdate);
  }

  moveToOrder(annonce: Annonce): Observable<OrderI> {
    return this.http.put<OrderI>(this.moveToOrderUrl, annonce, this.httpOptionsUpdate);
  }

  moveToTake(annonce: Annonce): Observable<Annonce> {
    return this.http.put<Annonce>(this.moveToTakeUrl, annonce, this.httpOptionsUpdate);
  }

  moveBackToStock(preOrder: PreOrderI): Observable<StockI> {
    return this.http.put<StockI>(this.moveBackToStockUrl, preOrder, this.httpOptionsUpdate);
  }

  moveToToDelevery(toDelevery:ToDeliveryI): Observable<ToDeliveryI>{
    return this.http.put<ToDeliveryI>(this.moveToToDeleveryUrl, toDelevery, this.httpOptionsUpdate);
  }

  moveToDelevery(delevery:DeleveryI): Observable<DeleveryI>{
    return this.http.put<DeleveryI>(this.moveToDeleveryUrl, delevery, this.httpOptionsUpdate);
  }

  moveToHistory(history:HistoryI):Observable<HistoryI>{
    return this.http.put<HistoryI>(this.moveToHistoryUrl, history, this.httpOptionsUpdate)
  }

  movePreparedToTrash(prepare:PrepareI):Observable<TrashI>{
    return this.http.put<TrashI>(this.movePreparedToTrashUrl,prepare, this.httpOptionsUpdate);
  }

  moveToDeleveryToTrash(toDelevery:ToDeliveryI): Observable<TrashI>{
    return this.http.put<TrashI>(this.moveToDeleveryToTrashUrl, toDelevery, this.httpOptionsUpdate);
  }

  moveDeleveryToTrash(delevery: DeleveryI): Observable<TrashI>{
    return this.http.put<TrashI>(this.moveDeleveryToTrashUrl, delevery, this.httpOptionsUpdate);
  }

  constructor(private http: HttpClient) { }
}