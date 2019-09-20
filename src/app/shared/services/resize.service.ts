import { Injectable } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  private subject: Subject<Window>;

  constructor(private eventManager: EventManager) {
    this.subject = new Subject();
    this.eventManager.addGlobalEventListener('window', 'resize', (
        (event: UIEvent) => {this.subject.next(<Window> event.target)}
      ).bind(this)
    )
  }

  get onResize(): Observable<Window> {
    return this.subject.asObservable();
  }

}
