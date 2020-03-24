import { Injectable } from '@angular/core';
import { WebGLCube } from '../models/webgl-cube.model';
import { InteractiveCubeManager } from 'src/app/pages/home/webgl-carousel/webgl-cube-manager/webgl-cube-manager';
import { Subject, Observable } from 'rxjs';
import Projects from 'src/projects.json';
import { LanguageService } from './language.service';

const contact = `
<h2>Contact</h2>

<p>
Om contact met mij op te nemen kun je een mailtje schieten naar <a href="mailto:contact@joeyderuiter.me">contact@joeyderuiter.me</a><br/>
of mij toevoegen op <a href="https://www.linkedin.com/in/j-de-ruiter/">linkedin</a>
</p>
`;

@Injectable({
  providedIn: 'root'
})
export class CubeService {

  private cubeManager: InteractiveCubeManager;

  private subject: Subject<number>;

  private index = 0;

  private projects: any[] = Projects.projects;

  constructor(public langService: LanguageService) {
    this.subject = new Subject<number>();
    this.subject.next(0);
    
    langService.languageObservable.subscribe(this.onLanguageUpdate.bind(this));
  }

  get onChange(): Observable<number> {
    return this.subject as Observable<number>;
  }

  private onLanguageUpdate() {
    this.subject.next(this.index); // Reload the current cube
  }

  private hasNext(): boolean {
    return this.index + 1 < this.projects.length;
  }

  private hasPrevious(): boolean {
    return this.index > 0;
}

  get getCurrentProject() {
    return this.projects[this.index];
  }

  get currentName() {
    return this.getCurrentProject.name;
  }

  get currentCube(): WebGLCube {
    // Because we cannot re-use our objects with a deep copy, just create
    // new ones with the saved parameters

    const params = this.getCurrentProject.cubeParams;
    return new WebGLCube(
      params.video,
      params.thumbnail,
      params.horizontalColours,
      params.verticalColours,
      this.cubeManager
    );
  }

  get currentPage() {
    return this.index + 1;
  }

  get maxPage() {
    return this.projects.length;
  }

  next() {
    if (!this.hasNext()) { return; }

    this.subject.next(++this.index);
  }

  previous() {
    if (!this.hasPrevious()) { return; }

    this.subject.next(--this.index);
  }

  registerCubeManager(cubeManager: InteractiveCubeManager) {
    this.cubeManager = cubeManager;
  }

}
