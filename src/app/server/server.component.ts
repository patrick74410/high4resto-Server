import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AlertService } from '../comfirm-dialog/alert.service';
import { environment } from '../environement/environement';
import { Util } from '../environement/util';
import { Annonce, ElementAnnonce } from '../interfaces/Annonce';
import { CommandeI } from '../interfaces/CommandeI';
import { ItemCategorieI } from '../interfaces/ItemCategorieI';
import { MessageI } from '../interfaces/MessageI';
import { StockI } from '../interfaces/StockI';
import { TableI } from '../interfaces/TableI';
import { OrderI } from '../interfaces/tracability/Order';
import { PreOrderI } from '../interfaces/tracability/PreOrder';
import { MessageService } from '../messages/message.service';
import { AuthentificationService } from '../services/Auth/authentification.service';
import { ExpireService } from '../services/Auth/expire.service';
import { ServeurService } from '../services/serveur.service';
declare var bootstrap: any;

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  tables: TableI[] = [];
  commandes: CommandeI[] = [];
  categoryItem: ItemCategorieI[] = [];
  items: StockI[] = [];
  preoOrders: PreOrderI[] = [];
  orders:OrderI[]=[];

  annonce: Annonce;
  signaled: Annonce;

  selectedForUpdateTable: TableI;
  selectedCommande: CommandeI;
  selectedTable: TableI;
  selectedCategoryItem: ItemCategorieI;
  selectedItem: StockI;
  price: number = 0;
  message: string = "";
  addBV: boolean = true;
  urlDownload: string = environment.apiUrl + "/images/download/";

  util = new Util();
  updateModal: any;


  addTable = new FormGroup({
    name: new FormControl('', Validators.required),
    place: new FormControl('', Validators.required)
  })

  updateTable = new FormGroup({
    name: new FormControl('', Validators.required),
    place: new FormControl('', Validators.required)
  })

  sendToTakeGroup(category:ItemCategorieI): void
  {
    var toSend:Annonce=new Annonce();
    toSend.table=this.selectedTable.name;
    for (let element of this.signaled.elements)
    {
      if(element.orders[0].preOrder.stock.item.categorie.id==category.id)
      {
        toSend.elements.push(element);
      }
    }
    this.signaled=new Annonce();
    this.orders=[];
    this.serverService.moveToTake(toSend).pipe(take(1)).subscribe(annonce=>{
      this.serverService.getOrder(this.selectedTable.name).pipe(take(1)).subscribe(orders=>{
        this.orders=orders.filter(a=>a.preOrder.orderNumber==this.selectedCommande.id).filter(a=>!a.toTake);
        this.orders.forEach(order=>{
          this.addItemToSignaled(order);
        })
      });
    })
  }

  sendToTakeNItem(qty:number,element: ElementAnnonce):void
  {
    var toSend:Annonce=new Annonce();
    toSend.table=this.selectedTable.name;
    var elementAnnonce:ElementAnnonce=new ElementAnnonce;
    elementAnnonce.itemId=element.itemId;
    elementAnnonce.itemName=element.itemName;
    elementAnnonce.qty=qty;
    elementAnnonce.orders=element.orders.splice(0,qty);
    toSend.elements.push(elementAnnonce);
    this.signaled=new Annonce();
    this.orders=[];
    this.serverService.moveToTake(toSend).pipe(take(1)).subscribe(annonce=>{
      this.serverService.getOrder(this.selectedTable.name).pipe(take(1)).subscribe(orders=>{
        this.orders=orders.filter(a=>a.preOrder.orderNumber==this.selectedCommande.id).filter(a=>!a.toTake);
        this.orders.forEach(order=>{
          this.addItemToSignaled(order);
        })
      });
    })
  }

  sendToTakeAllItem(element:ElementAnnonce): void {
    var toSend:Annonce=new Annonce();
    toSend.table=this.selectedTable.name;
    toSend.elements.push(element);
    this.signaled.elements.splice(this.signaled.elements.indexOf(element),1);
    this.serverService.moveToTake(toSend).pipe(take(1)).subscribe(annonce=>{
      this.serverService.getOrder(this.selectedTable.name).pipe(take(1)).subscribe(orders=>{
        this.orders=orders.filter(a=>a.preOrder.orderNumber==this.selectedCommande.id).filter(a=>!a.toTake);
        this.orders.forEach(order=>{
          this.addItemToSignaled(order);
        })
      });
    })
  }

  signal(annonce: Annonce)
  {
    this.serverService.moveToOrder(annonce).pipe(take(1)).subscribe(result=>{
      this.annonce=new Annonce();
      this.serverService.getOrder(this.selectedTable.name).pipe(take(1)).subscribe(orders=>{
        this.orders=orders.filter(a=>a.preOrder.orderNumber==this.selectedCommande.id).filter(a=>!a.toTake);
        this.orders.forEach(order=>{
          this.addItemToSignaled(order);
        })
      });
    });
  }

  addToBasket(element: ElementAnnonce) {
    this.serverService.getStock(element.orders[0].preOrder.stock.item.categorie).pipe(take(1)).subscribe(items => {
      this.items = items
      var stock: StockI = this.items.filter(a => a.item.id == element.itemId).pop();
      if (stock) {
        var preOrder: PreOrderI = { stock: stock, orderNumber: (this.selectedCommande.id).toString(), destination: this.selectedTable.name, messageToNext: "", idCustommer: "" };
        preOrder.messageToNext = element.orders[0].preOrder.messageToNext;
        preOrder.stock.item = element.orders[0].preOrder.stock.item;
        this.serverService.moveToPreOrder(preOrder).pipe(take(1)).subscribe(result => {
          result.messageToNext = this.message;
          this.preoOrders.push(result);
          this.selectedCommande.items.push(result);
          this.addItemToAnnonce(result);
        });
      }
    });
  }

  moveBackToStock(element: ElementAnnonce) {
      var index = this.annonce.elements.indexOf(element);
      this.serverService.moveBackToStock(this.annonce.elements[index].orders[0].preOrder).pipe(take(1)).subscribe(t => {
        this.serverService.getStock(element.orders[0].preOrder.stock.item.categorie).pipe(take(1)).subscribe(items => {
          this.items = items
        });
        this.annonce.elements[index].orders.splice(0, 1);
        this.annonce.elements[index].qty -= 1;
        if (this.annonce.elements[index].qty == 0) {
          this.annonce.elements.splice(index, 1);
        }
      });
  }

  private addItemToSignaled(result:OrderI)
  {
    var elementIndex: number = -1;
    var index = 0;

    var name: string = result.preOrder.stock.item.name + " ";
    result.preOrder.stock.item.options.forEach(option => {
      option.options.forEach(choix => {
        if (choix.selected)
          name += choix.label + " ";
      });
    })

    name += result.preOrder.messageToNext;

    for (let element of this.signaled.elements) {
      if (element.itemName == name) {
        elementIndex = index;
        break;
      }
      index += 1;
    }
    if (elementIndex == -1) {
      var element: ElementAnnonce = new ElementAnnonce();
      element.itemName = name;
      element.itemId = result.preOrder.stock.item.id;
      element.qty = 1
      element.orders.push(result);
      this.signaled.elements.push(element);
    }
    else {
      this.signaled.elements[elementIndex].qty += 1;
      this.signaled.elements[elementIndex].orders.push(result);
    }
  }

  private addItemToAnnonce(result: PreOrderI) {
    var elementIndex: number = -1;
    var index = 0;

    var name: string = result.stock.item.name + " ";
    result.stock.item.options.forEach(option => {
      option.options.forEach(choix => {
        if (choix.selected)
          name += choix.label + " ";
      });
    })

    name += result.messageToNext;

    for (let element of this.annonce.elements) {
      if (element.itemName == name) {
        elementIndex = index;
        break;
      }
      index += 1;
    }
    if (elementIndex == -1) {
      var element: ElementAnnonce = new ElementAnnonce();
      element.itemName = name;
      element.itemId = result.stock.item.id;
      element.qty = 1
      element.orders.push({ preOrder: result, mandatory: this.authenticationService.userName, deleveryMode: "inside" } as OrderI);
      this.annonce.elements.push(element);
    }
    else {
      this.annonce.elements[elementIndex].qty += 1;
      this.annonce.elements[elementIndex].orders.push({ preOrder: result, mandatory: this.authenticationService.userName, deleveryMode: "inside" } as OrderI);
    }
  }

  addItemToBasket(): void {
    const preOrder: PreOrderI = { stock: this.selectedItem, orderNumber: (this.selectedCommande.id).toString(), destination: this.selectedTable.name, messageToNext: this.message, idCustommer: "" };
    this.serverService.moveToPreOrder(preOrder).pipe(take(1)).subscribe(result => {
      result.messageToNext = this.message;
      this.preoOrders.push(result);
      this.selectedCommande.items.push(result);
      this.addItemToAnnonce(result);
      this.message = "";
      this.serverService.getStock(this.selectedCategoryItem).pipe(take(1)).subscribe(items => this.items = items)
      this.selectedItem = null;
    })
  }

  finishCommande(): void {
    let that = this;
    this.alertService.confirmThis("Êtes-vous sur de vouloir terminer la table ?", function () {
      that.selectedCommande.finish = true;
      that.serverService.updateCommande(that.selectedCommande).pipe(take(1)).subscribe(t => {
        that.serverService.findCommande(that.selectedTable.name, that.authenticationService.userName).pipe(take(1)).subscribe(commandes => {
          that.commandes = commandes;
        })
      })

    }, function () {
    });

  }

  check(idx: number, i: number, item: HTMLInputElement) {
    this.selectedItem.item.options[idx].options[i].selected = item.checked;
    this.price = this.selectedItem.item.price;
    this.selectedItem.item.options.forEach(option => {
      option.options.forEach(choix => {
        if (choix.selected) {
          this.price += choix.price;
        }
      })
    })
  }

  selectItem(item: StockI): void {
    this.selectedItem = item;
    this.price = this.selectedItem.item.price;

  }

  selectTable(table: TableI) {
    this.selectedTable = table;
    this.serverService.findCommande(table.name, this.authenticationService.userName).pipe(take(1)).subscribe(commandes => {
      this.commandes = commandes;
    });

  }

  selectCommande(commande: CommandeI) {
    this.selectedCommande = commande;
    this.annonce = new Annonce();
    this.signaled=new Annonce();
    this.annonce.table = this.selectedTable.name;
    this.serverService.getPreOrder(this.selectedTable.name).pipe(take(1)).subscribe(preOrders => {
      this.preoOrders = preOrders.filter(a => a.orderNumber == commande.id);
      this.preoOrders.forEach(preOrder => {
        this.addItemToAnnonce(preOrder);
      })
    });
    this.serverService.getOrder(this.selectedTable.name).pipe(take(1)).subscribe(orders=>{
      this.orders=orders.filter(a=>a.preOrder.orderNumber==commande.id).filter(a=>!a.toTake);
      this.orders.forEach(order=>{
        this.addItemToSignaled(order);
      })
    });
  }

  selectCategory(category: ItemCategorieI) {
    this.selectedCategoryItem = category;
    this.serverService.getStock(category).pipe(take(1)).subscribe(items => this.items = items);

  }

  addCommande(): void {
    this.serverService.createCommande(this.selectedTable.name, this.authenticationService.userName).pipe(take(1)).subscribe(commande => {
      this.commandes.push(commande);
    })
  }

  updateData(table: TableI): void {
    this.selectedForUpdateTable = table;
    this.updateTable.patchValue({
      name: this.selectedForUpdateTable.name,
      place: this.selectedForUpdateTable.place
    });
    this.updateModal.show();
  }

  onUpdate(): void {
    this.selectedForUpdateTable.name = this.updateTable.get("name").value;
    this.selectedForUpdateTable.place = this.updateTable.get("place").value;
    this.serverService.updateTable(this.selectedForUpdateTable).pipe(take(1)).subscribe(table => {
      this.serverService.findTable().pipe(take(1)).subscribe(tables => {
        this.tables = tables;
        this.updateModal.hide();
      })
    });
  }

  deleteTable(table: TableI) {
    let that = this;
    this.alertService.confirmThis("Êtes-vous sur de vouloir supprimer la table ?", function () {
      that.serverService.deleteTable(table).pipe(take(1)).subscribe(t => {
        var index = that.tables.indexOf(table);
        that.tables.splice(index, 1);
        const message = { content: "La table a été supprimée", level: "Attention" } as MessageI;
        that.messageService.add(message);
      });
    }, function () {
    });
  }

  saveTable() {
    if (this.addTable.valid) {
      this.serverService.insertTable({ name: this.addTable.get("name").value, place: this.addTable.get("place").value } as TableI).pipe(take(1)).subscribe(result => {
        this.tables.push(result);
        const message = { content: 'La table a été enregistrée', level: 'Info' } as MessageI;
        this.messageService.add(message);
        this.addTable.patchValue({ name: '', place: '' });
      });
    }
  }

  constructor(public change: ChangeDetectorRef, public authenticationService: AuthentificationService, private alertService: AlertService, private messageService: MessageService, private expireService: ExpireService, private serverService: ServeurService) { }

  ngOnInit(): void {
    this.expireService.check();
    this.serverService.findTable().pipe(take(1)).subscribe(tables => {
      this.tables = tables;
    });
    this.serverService.getCategory().pipe(take(1)).subscribe(categories => this.categoryItem = categories);
    this.updateModal = new bootstrap.Modal(document.getElementById('updateModal'), {});
  }

}
