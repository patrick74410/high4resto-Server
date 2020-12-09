import { Component, OnInit } from '@angular/core';
import { AlertService } from "./alert.service";

@Component({
  selector: 'app-comfirm-dialog',
  templateUrl: './comfirm-dialog.component.html',
  styleUrls: ['./comfirm-dialog.component.css']
})
export class ComfirmDialogComponent implements OnInit {
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.getMessage().subscribe(message => {
      this.message = message;
    });
  }

}
