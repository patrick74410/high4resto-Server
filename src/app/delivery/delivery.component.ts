import { Component, EventEmitter, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { AlertService } from '../comfirm-dialog/alert.service';
import { environment } from '../environement/environement';
import { Util } from '../environement/util';
import { MessageI } from '../interfaces/MessageI';
import { DeleveryI } from '../interfaces/tracability/Delevery';
import { HistoryI } from '../interfaces/tracability/History';
import { PrepareI } from '../interfaces/tracability/Prepare';
import { ToDeliveryI } from '../interfaces/tracability/ToDelivery';
import { MessageService } from '../messages/message.service';
import { AuthentificationService } from '../services/Auth/authentification.service';
import { ExpireService } from '../services/Auth/expire.service';
import { ServeurService } from '../services/serveur.service';
import { Socket } from '../services/Socket';

const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  util=new Util();
  resumesPrepared:ResumePrepared[]=[];
  resumesToDelivery:ResumeToDelivery[]=[];
  resumesDelevery:ResumeDelivery[]=[];

  constructor(private authenticationService: AuthentificationService,private messageService: MessageService,private alertService: AlertService, private expireService: ExpireService, private serverService: ServeurService) { }

  private generateResumePrepared(): void {
    this.resumesPrepared=[];
    this.serverService.findPrepared(this.authenticationService.userName()).pipe(take(1)).subscribe(prepares => {
      var tp:Record<string,PrepareI[]>=groupBy(prepares, i => i.toPrepare.order.preOrder.destination);
      for(let key in tp)
      {
        var tpResume=new ResumePrepared();
        tpResume.table=key;
        tpResume.prepares=tp[key].sort((a,b)=>{
          var aa:number=a.toPrepare.order.preOrder.stock.item.categorie.order
          var bb:number=b.toPrepare.order.preOrder.stock.item.categorie.order
          if(aa>bb)
            return 1;
          else if(aa<bb)
            return -1;
          else
            return 0;
        });
        this.resumesPrepared.push(tpResume)
      }
    });
  }

  private generateToDelivery(): void {
    this.resumesToDelivery=[];
    this.serverService.findToDelevery(this.authenticationService.userName()).pipe(take(1)).subscribe(toDeleverys => {
      var tp:Record<string,ToDeliveryI[]>=groupBy(toDeleverys, i => i.prepare.toPrepare.order.preOrder.destination);
      for(let key in tp)
      {
        var tpResume=new ResumeToDelivery();
        tpResume.table=key;
        tpResume.toDelevery=tp[key].sort((a,b)=>{
          var aa:number=a.prepare.toPrepare.order.preOrder.stock.item.categorie.order
          var bb:number=b.prepare.toPrepare.order.preOrder.stock.item.categorie.order
          if(aa>bb)
            return 1;
          else if(aa<bb)
            return -1;
          else
            return 0;
        });
        this.resumesToDelivery.push(tpResume)
      }
    });
  }

  private generateDelivery(): void {
    console.log(this.authenticationService.userName);
    this.resumesDelevery=[];
    this.serverService.findDelevery(this.authenticationService.userName()).pipe(take(1)).subscribe(deleverys => {
      var tp:Record<string,DeleveryI[]>=groupBy(deleverys, i => i.toDelivery.prepare.toPrepare.order.preOrder.destination);
      for(let key in tp)
      {
        var tpResume=new ResumeDelivery();
        tpResume.table=key;
        tpResume.delevery=tp[key].sort((a,b)=>{
          var aa:number=a.toDelivery.prepare.toPrepare.order.preOrder.stock.item.categorie.order
          var bb:number=b.toDelivery.prepare.toPrepare.order.preOrder.stock.item.categorie.order
          if(aa>bb)
            return 1;
          else if(aa<bb)
            return -1;
          else
            return 0;
        });
        this.resumesDelevery.push(tpResume)
      }
    });
  }

  moveToToDelevery(resume:ResumePrepared,prepared:PrepareI)
  {
    var toToDelevery={prepare:prepared,deleveryPerson:this.authenticationService.userName()} as ToDeliveryI;
    this.serverService.moveToToDelevery(toToDelevery).pipe(take(1)).subscribe(t=>{
      resume.prepares.splice(resume.prepares.indexOf(prepared),1);
      this.generateToDelivery();
    })
  }

  moveToDelevery(resume:ResumeToDelivery,toDelevery:ToDeliveryI)
  {
    var delevery={toDelivery:toDelevery } as DeleveryI;
    this.serverService.moveToDelevery(delevery).pipe(take(1)).subscribe(t=>{
      resume.toDelevery.splice(resume.toDelevery.indexOf(toDelevery),1);
      this.generateDelivery();
    })
  }

  moveToHistory(resume:ResumeDelivery,delevery: DeleveryI)
  {
    var history={delevery:delevery}as HistoryI;
    this.serverService.moveToHistory(history).pipe(take(1)).subscribe(t=>{
      resume.delevery.splice(resume.delevery.indexOf(delevery),1);
    })
  }

  moveToDeleveryToTrash(resume:ResumePrepared,prepared:PrepareI)
  {
    var that=this;
    this.alertService.confirmThis("Êtes-vous sur de vouloir marquer perdu le produit?", function () {
      that.serverService.movePreparedToTrash(prepared).pipe(take(1)).subscribe(t=>{
        resume.prepares.splice(resume.prepares.indexOf(prepared),1);
      })
    }, function () {
    });

  }

  moveDeleveryToTrash(resume:ResumeToDelivery,toDelevery:ToDeliveryI)
  {
    var that=this;
    this.alertService.confirmThis("Êtes-vous sur de vouloir marquer perdu le produit?", function () {
      that.serverService.moveToDeleveryToTrash(toDelevery).pipe(take(1)).subscribe(t=>{
        resume.toDelevery.splice(resume.toDelevery.indexOf(toDelevery),1);
      })
      }, function () {
    });

  }

  onTabChanged($event)
  {
    if($event.index==0)
    this.generateResumePrepared();
    if($event==1)
    this.generateToDelivery();
    if($event==2)
    this.generateDelivery();
  }

  ngOnInit(): void {

    this.generateResumePrepared();
    this.generateToDelivery();
    this.generateDelivery();
    var socket:Socket=new Socket(environment.socketServer);
    var listener: EventEmitter<any> = new EventEmitter();
    listener=socket.getEventListener();
    listener.subscribe(event=>{
      if(event.type=="message")
      {
        var txt:string=event.data;
        var command:string=txt.split(":")[0];
        var value:string=txt.split(":")[1];
        if(command=="callServer")
        {
          const message: MessageI = { content: value,level:"Attention"}
          this.messageService.add(message);
          window.navigator.vibrate([100,30,100,30,100,30,200,30,200,30,200,30,100,30,100,30,100]);
        }
        else if(command=="update")
        {
          if(value=="prepared")
          {
            this.generateResumePrepared();
          }
        }

      }
      if(event.type=="open")
      {
        console.log("Connexion open");
      }
      if(event.type=="close")
      {
        console.log("Connexion close");
      }
    });
  }

}

export class ResumePrepared{
  table:string="";
  prepares:PrepareI[]=[];
}

export class ResumeToDelivery{
  table:string="";
  toDelevery:ToDeliveryI[]=[];
}

export class ResumeDelivery{
  table:string="";
  delevery:DeleveryI[]=[];
}
