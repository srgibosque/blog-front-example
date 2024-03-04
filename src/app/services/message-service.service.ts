import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MessageDTO } from '../models/message.dto';
import { firstValueFrom, map } from 'rxjs';

interface deleteResponse {
  affected: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {
  private urlMessageApi: string;

  constructor(private http: HttpClient) { 
    this.urlMessageApi = 'http://localhost:3000/messages';
  }

  getMessages(): Promise<MessageDTO[]> {
    return firstValueFrom(
      this.http.get<MessageDTO[]>(this.urlMessageApi).pipe(
        map(response => response as MessageDTO[])
      )
    );
  }

  getMessageById(id: number): Promise<MessageDTO>{
    return firstValueFrom(this.http.get<MessageDTO>(this.urlMessageApi + '/' + id));
  }

  createMessage(msg: MessageDTO): Promise<MessageDTO>{
    return firstValueFrom(this.http.post<MessageDTO>(this.urlMessageApi, msg));
  }

  updateMessage(id: number, msg: MessageDTO): Promise<MessageDTO>{
    return firstValueFrom(this.http.put<MessageDTO>(this.urlMessageApi + '/' + id, msg));
  }

  deleteMessage(id: number): Promise<deleteResponse>{
    return firstValueFrom(this.http.delete<deleteResponse>(this.urlMessageApi + '/' + id));
  }

  errorLog(error: HttpErrorResponse){
    console.error('An error occurred: ', error.error.msg);
    console.error('Backend returned code: ', error.status);
    console.error('Complete message was: ', error.message);
  }


  async wait(ms: number){
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
