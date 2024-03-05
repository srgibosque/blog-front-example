import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MessageDTO } from '../../models/message.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageServiceService } from '../../services/message-service.service';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrl: './message-form.component.css'
})
export class MessageFormComponent implements OnInit {
  message: MessageDTO;
  title: FormControl;
  description: FormControl;
  messageForm: FormGroup;
  isValidForm: boolean | null;

  private isUpdateMode: boolean;
  private validRequest: boolean;
  private msgId: string | null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageServiceService,
    private formBuilder: FormBuilder
    ){
      this.isValidForm = false;
      this.msgId = this.activatedRoute.snapshot.paramMap.get('id');
      this.message = new MessageDTO('', '');
      this.isUpdateMode = false;
      this.validRequest = false;

      this.title = new FormControl(this.message.title, [Validators.required, Validators.maxLength(150)]);
      this.description = new FormControl(this.message.description, Validators.required);
      this.messageForm = this.formBuilder.group({
        title: this.title,
        description: this.description
      });
    }

  async ngOnInit(): Promise<void> {
    if(this.msgId){
      this.isUpdateMode = true;
      try{
        this.message = await this.messageService.getMessageById(+this.msgId);

        this.title.setValue(this.message.title);

        this.description.setValue(this.message.description);

        this.messageForm = this.formBuilder.group({
          title: this.title,
          description: this.description
        });
      } catch(e: any){
        this.messageService.errorLog(e);
      }
    }
  }

  private async management(): Promise<void> {
    if(this.validRequest){
      await this.messageService.wait(1000);
      this.router.navigateByUrl('');
    } else {
      await this.messageService.wait(1000);
      alert('incorrect form')
    }
  }

  private async editMessage(): Promise<boolean> {
    let responseOK: boolean = false;
    if(this.msgId){
      try{
        await this.messageService.updateMessage(+this.msgId, this.message);
        responseOK = true;
      }catch(e: any){
        this.messageService.errorLog(e);
      }
    }
    return responseOK;
  }

  private async createMessage(): Promise<boolean> {
    let responseOK: boolean = false;
    try{
      await this.messageService.createMessage(this.message);
      responseOK = true;
    }catch(e: any){
      this.messageService.errorLog(e);
    }
    return responseOK;
  }

  async saveMessage(): Promise<void>{
    this.isValidForm = false;

    if(this.messageForm.invalid){
      return
    }

    this.isValidForm = true;
    this.message = this.messageForm.value;

    if(this.isUpdateMode){
      this.validRequest = await this.editMessage();
    } else {
      this.validRequest = await this.createMessage();
    }

    this.management();
  }
  
}
