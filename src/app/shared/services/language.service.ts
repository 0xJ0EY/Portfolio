import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Projects from 'src/projects.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly DEFAULT_LANG = "default_language";
  private currentLanguage: BehaviorSubject<string>;

  constructor() { 
    this.load();
  }

  public load() {
    const browserLang = navigator.language;
    const target = localStorage.getItem(this.DEFAULT_LANG) || browserLang;

    const lang = this.fetchLanguage(target);

    this.currentLanguage = new BehaviorSubject(lang);
    this.saveCurrentLanguage();
  }

  public update(language: string): boolean {
    if (!this.hasLanguage(language)) { return false; }

    this.setLanguage(language);
    this.saveCurrentLanguage();

    return true;
  }

  private hasLanguage(language: string): boolean {

    for (const lang of Projects.languages) {

      if (lang.startsWith(language)) {
        return lang;
      }
    }

    return false;
  }

  private fetchLanguage(target: string): string {
    for (const lang of Projects.languages) {
      if (lang.startsWith(target)) {
        return lang;
      }
    }

    return Projects.defaultLanguage;
  } 

  private setLanguage(language: string) {
    this.currentLanguage.next(language);
  }

  public saveCurrentLanguage() {
    const lang = this.currentLanguage.getValue();
    localStorage.setItem(this.DEFAULT_LANG, lang);
  }

  get currentLang(): string {
    return this.currentLanguage.getValue();
  }

  get languageObservable(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

}
