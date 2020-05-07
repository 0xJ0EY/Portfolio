import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Projects from 'src/projects.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  public readonly languages = Projects.languages;
  public readonly languageNames: Record<string, string> = {
    'en-US': 'EN',
    'nl-NL': 'NL'
  };

  private readonly DEFAULT_LANG = 'default_language';
  private language: BehaviorSubject<string>;

  constructor() {
    this.load();
  }

  public load() {
    const browserLang = navigator.language;
    const target = localStorage.getItem(this.DEFAULT_LANG) || browserLang;

    const lang = this.fetchLanguage(target);

    this.language = new BehaviorSubject(lang);
    this.saveCurrentLanguage();
  }

  public update(language: string): boolean {
    if (!this.hasLanguage(language)) { return false; }

    this.setLanguage(language);
    this.saveCurrentLanguage();

    return true;
  }

  private hasLanguage(language: string): boolean {

    for (const lang of this.languages) {

      if (lang.startsWith(language)) {
        return lang;
      }
    }

    return false;
  }

  private fetchLanguage(target: string): string {
    for (const lang of this.languages) {
      if (lang.startsWith(target)) {
        return lang;
      }
    }

    return Projects.defaultLanguage;
  }

  private setLanguage(language: string) {
    this.language.next(language);
  }

  public saveCurrentLanguage() {
    const lang = this.language.getValue();
    localStorage.setItem(this.DEFAULT_LANG, lang);
  }

  get currentLanguage(): string {
    return this.language.getValue();
  }

  get currentLanguageName(): string {
    return this.languageNames[this.language.getValue()];
  }

  get languageObservable(): Observable<string> {
    return this.language.asObservable();
  }

}
