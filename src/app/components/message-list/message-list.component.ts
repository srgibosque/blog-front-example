import { Component, OnInit } from '@angular/core';
import { MessageServiceService } from '../../services/message-service.service';
import { MessageDTO } from '../../models/message.dto';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages!: MessageDTO[];

  constructor(private messageService: MessageServiceService){}

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

}
