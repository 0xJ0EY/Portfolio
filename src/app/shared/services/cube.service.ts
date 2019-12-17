import { Injectable } from '@angular/core';
import { WebGLCube } from '../models/webgl-cube.model';
import { InteractiveCubeManager } from 'src/app/pages/home/webgl-carousel/webgl-cube-manager/webgl-cube-manager';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CubeService {

  private cubeManager: InteractiveCubeManager;

  private subject: Subject<number>;

  private index = 0;

  private projects: any[] = [
    {
      name: 'Youi',
      description: '<h1>Youi</h1>',
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/Firefox.mp4',
        thumbnail: '/assets/thumbnail.jpg',
        horizontalColours: { r: 255, g: 0, b: 255 },
        verticalColours: { r: 255, g: 255, b: 0 }
      }
    },
    {
      name: 'PCParts',
      description: '<h1>PCParts</h1>',
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/Firefox.mp4',
        thumbnail: '/assets/thumbnail.jpg',
        horizontalColours: { r: 0, g: 255, b: 255 },
        verticalColours: { r: 255, g: 255, b: 0 }
      }
    },
    {
      name: 'Albert',
      description: '<h1>Albert</h1>',
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/Firefox.mp4',
        thumbnail: '/assets/thumbnail.jpg',
        horizontalColours: { r: 0, g: 0, b: 255 },
        verticalColours: { r: 255, g: 0, b: 255 }
      }
    },
    {
      name: 'Paintboy',
      description: '<h1>Paintboy</h1>',
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/Firefox.mp4',
        thumbnail: '/assets/thumbnail.jpg',
        horizontalColours: { r: 0, g: 0, b: 255 },
        verticalColours: { r: 255, g: 0, b: 255 }
      }
    }
  ];

  constructor() {
    this.subject = new Subject<number>();
    this.subject.next(0);
  }

  get onChange(): Observable<number> {
    return this.subject as Observable<number>;
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
