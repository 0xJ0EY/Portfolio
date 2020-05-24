import { Injectable, OnDestroy } from '@angular/core';
import { WebGLCube } from '../models/webgl-cube.model';
import { InteractiveCubeManager } from 'src/app/pages/home/webgl-carousel/webgl-cube-manager/webgl-cube-manager';
import { Subject, Observable, Subscription } from 'rxjs';
import Projects from 'src/projects.json';
import { LanguageService } from './language.service';

export enum CubeDataState {
  NORMAL,
  FADEOUT,
  FADEIN
}

export class CubeData {
  public index: number;
  public state: CubeDataState = CubeDataState.NORMAL;
}

@Injectable({
  providedIn: 'root'
})
export class CubeService implements OnDestroy {

  private cubeManager: InteractiveCubeManager;
  private languageSericeSubscribtion: Subscription;

  private subject: Subject<CubeData>;

  private state: CubeDataState = CubeDataState.NORMAL;
  private index = 0;

  private projects: any[] = Projects.projects;

  constructor(public langService: LanguageService) {
    this.subject = new Subject<CubeData>();
    this.subject.next(this.cubeData());

    this.languageSericeSubscribtion = langService
                                      .languageObservable
                                      .subscribe(this.onLanguageUpdate.bind(this));
  }

  ngOnDestroy(): void {
    this.languageSericeSubscribtion.unsubscribe();
  }

  get onChange(): Observable<CubeData> {
    return this.subject as Observable<CubeData>;
  }

  private onLanguageUpdate() {
    this.subject.next(this.cubeData()); // Reload the current cube
  }

  private hasNext(): boolean {
    return this.index + 1 < this.projects.length;
  }

  private hasPrevious(): boolean {
    return this.index > 0;
  }

  private cubeData() {
    const tmp = new CubeData();
    tmp.index = this.index;
    tmp.state = this.state;
    return tmp;
  }

  get getCurrentProject() {
    return this.projects[this.index];
  }

  get currentName() {
    return this.getCurrentProject.name;
  }

  get currentState(): CubeDataState {
    return this.state;
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

    this.state = CubeDataState.NORMAL;
    ++this.index;

    this.subject.next(this.cubeData());
  }

  previous() {
    if (!this.hasPrevious()) { return; }

    this.state = CubeDataState.NORMAL;
    --this.index;

    this.subject.next(this.cubeData());
  }

  fadeout() {
    this.state = CubeDataState.FADEOUT;
    this.subject.next(this.cubeData());
  }

  fadein() {
    this.state = CubeDataState.FADEIN;
    this.subject.next(this.cubeData());
  }

  registerCubeManager(cubeManager: InteractiveCubeManager) {
    this.cubeManager = cubeManager;
  }

}
