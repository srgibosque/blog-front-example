import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MessageServiceService } from '../../services/message-service.service';
import { MessageDTO } from '../../models/message.dto';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages!: MessageDTO[];

  constructor(private messageService: MessageServiceService, private router: Router){}

  ngOnInit(): void {
      this.loadMessages();
  }

  private async loadMessages(): Promise<void> {
    try{
      this.messages = await this.messageService.getMessages();
    }catch(e: any){
      this.messageService.errorLog(e);
    }
  }

  createMessage(): void{
    this.router.navigateByUrl('/message/');
  }

  updateMessage(id: number): void{
    this.router.navigateByUrl('/message/'+ id);
  }

  async deleteMessage(id: number): Promise<void>{
    let result = confirm('Are you sure you want to delete this message?');
    if(result){
      try{
        const rowsAffected = await this.messageService.deleteMessage(id);
        if(rowsAffected.affected > 0){
          this.loadMessages();
        }
      } catch (e: any) {
        this.messageService.errorLog(e);
      }
    }
  }

}
