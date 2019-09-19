import { Injectable } from '@angular/core';


function _window(): any {
  // Get the native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRefService {
  get nativeWindow(): any {
    return _window();
  }
}
