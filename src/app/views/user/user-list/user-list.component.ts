import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService } from './../../../services/dialog.service';
import { SharedService } from './../../../services/shared.service';
import { UserService } from './../../../services/user.service';
import { ResponseApi } from './../../../model/response-api';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page: number = 0;
  count: number = 1;
  pages: Array<number>;
  shared: SharedService;
  message: {};
  classCss: {};
  listUser = [];

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private router: Router
  ) {
    this.shared = SharedService.getInstance();
   }

  ngOnInit(): void {
    this.findAll(this.page, this.count);
  }

  findAll(page:number, count:number) {
    this.userService.findAll(page,count).subscribe((responseApi: ResponseApi) => {
      this.listUser = responseApi['data']['content'];
      this.pages = new Array(responseApi['data']['totalPages']);
    }, err => {
      this.showMessage({
        type: 'error',
        text: err['errpr']['errors'][0]
      });
    });
  }

  edit(id: string){
    this.router.navigate(['user', id]);
  }

  delete(id: string){
    this.dialogService.confirm('Certeza que deseja exluir')
      .then((candelete:boolean) => {
        if (candelete){
          this.message = {};
          this.userService.delete(id).subscribe((responseApi: ResponseApi) => {
            this.showMessage({
              type: 'success',
              text: 'Record Deleted'
            });
          this.findAll(this.page, this.count);
        }, err => {
          this.showMessage({
            type: 'error',
          text: err['error']['errors'][0]
          });
        });
        }
      });
  }

  setNextPage(event:any){
    event.preventDefault();
    if (this.page+1 < this.pages.length){
      this.page = this.page + 1;
      this.findAll(this.page, this.count);
    }
  }

  setPreviousPage(event:any){
    event.preventDefault();
    if (this.page+1 > 0){
      this.page = this.page - 1;
      this.findAll(this.page, this.count);
    }
  }

  setPage(i, event:any){
    event.preventDefault();
    this.page = i;
    this.findAll(this.page, this.count);
  }

  private showMessage(message: {type: string, text: string}): void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
}

private buildClasses(type: string): void {
   this.classCss = {
     'alert': true
   }
   this.classCss['alert-'+type] =  true;
}

}
