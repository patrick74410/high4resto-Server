import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { AlertService } from '../comfirm-dialog/alert.service';
import { Util } from '../environement/util';
import { CommandeI } from '../interfaces/CommandeI';
import { MessageI } from '../interfaces/MessageI';
import { TableI } from '../interfaces/TableI';
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
  tables:TableI[]=[];
  selectedTable:TableI;
  commandes:CommandeI[]=[];
  selectedForUpdateTable:TableI;
  selectedCommande:CommandeI;
  util=new Util();
  updateModal:any;

  addTable = new FormGroup({
    name: new FormControl('',Validators.required),
    place:new FormControl('',Validators.required)
  })

  updateTable =new FormGroup({
    name: new FormControl('',Validators.required),
    place:new FormControl('',Validators.required)
  })

  finishCommande(): void {
    let that = this;
    this.alertService.confirmThis("Êtes-vous sur de vouloir terminer la table ?", function () {
      that.selectedCommande.finish=true;
      that.serverService.updateCommande(that.selectedCommande).pipe(take(1)).subscribe(t=>{
        that.serverService.findCommande(that.selectedTable.name,that.authenticationService.userName).pipe(take(1)).subscribe(commandes=>{
          that.commandes=commandes;
        })
      })

    }, function () {
    });

  }

  selectTable(table:TableI)
  {
    this.selectedTable=table;
    this.serverService.findCommande(table.name,this.authenticationService.userName).pipe(take(1)).subscribe(commandes=>{
      this.commandes=commandes;
    });
  }

  selectCommande(commande:CommandeI)
  {
    this.selectedCommande=commande;
  }

  addCommande(): void {
    this.serverService.createCommande(this.selectedTable.name,this.authenticationService.userName).pipe(take(1)).subscribe(commande=>{
      this.commandes.push(commande);
    })
  }

  updateData(table:TableI): void {
    console.log("dfsdf");
    this.selectedForUpdateTable=table;
    this.updateTable.patchValue({
      name:this.selectedForUpdateTable.name,
      place:this.selectedForUpdateTable.place
    });
    this.updateModal.show();
  }

  onUpdate():void {
    this.selectedForUpdateTable.name=this.updateTable.get("name").value;
    this.selectedForUpdateTable.place=this.updateTable.get("place").value;
    this.serverService.updateTable(this.selectedForUpdateTable).pipe(take(1)).subscribe(table=>{
      this.serverService.findTable().pipe(take(1)).subscribe(tables=>{
        this.tables=tables;
        this.updateModal.hide();
      })
    });
  }

  deleteTable(table:TableI)
  {
    let that = this;
    this.alertService.confirmThis("Êtes-vous sur de vouloir supprimer la table ?", function () {
      that.serverService.deleteTable(table).pipe(take(1)).subscribe(t=>{
        var index=that.tables.indexOf(table);
        that.tables.splice(index,1);
        const message={content:"La table a été supprimée",level:"Attention"}as MessageI;
        that.messageService.add(message);
      });
    }, function () {
    });
  }

  saveTable(){
    if(this.addTable.valid)
    {
      this.serverService.insertTable({name:this.addTable.get("name").value,place:this.addTable.get("place").value}as TableI).pipe(take(1)).subscribe(result=>{
        this.tables.push(result);
        const message={content:'La table a été enregistrée',level:'Info'}as MessageI;
        this.messageService.add(message);
        this.addTable.patchValue({name:'',place:''});
      });
    }
  }

  constructor(public change: ChangeDetectorRef,public authenticationService: AuthentificationService,private alertService: AlertService, private messageService: MessageService, private expireService: ExpireService,private serverService:ServeurService) { }

  ngOnInit(): void {
    this.expireService.check();
    this.serverService.findTable().pipe(take(1)).subscribe(tables=>{
      this.tables=tables;
    });
    this.updateModal = new bootstrap.Modal(document.getElementById('updateModal'), {});
  }

}
