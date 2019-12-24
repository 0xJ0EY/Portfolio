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
      description: `
<h1>PCParts</h1>

<p>
PCParts is een webshop die ik heb gemaakt tijdens de derde periode van het tweede jaar (2019).</br>
Tijdens deze periode werd er een module gegeven waarbij je een webshop moest realiseren doormiddel Angular 7 en Dropwizard.</br>
Voor het eindproject van deze module voor deze module heb ik gekozen om een pc-onderdelen webshop te bouwen.
</p>

<h2>Technologie</h2>
<p>
Angular 7 & Dropwizard
</p>

<h2>Team</h2>
<p>
Joey de Ruiter
</p>

<h2>Code</h2>
<p>
<a href="https://github.com/0xJ0EY/IprwcApi">Code van de API</a></br>
<a href="https://github.com/0xJ0EY/IprwcClient">Code van de SPA</a>
</p>

<h2>Contact</h2>
<p>
Om contact met mij op te nemen kun je een mailtje schieten naar <a href="mailto:contact@joeyderuiter.me">contact@joeyderuiter.me</a>
</p>
`,
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/pc-parts.mp4',
        thumbnail: '/assets/pc-parts-thumbnail.png',
        horizontalColours: { r: 245, g: 249, b: 252 },
        verticalColours: { r: 0, g: 144, b: 248 }
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
      description: `
<h1>Paintboy</h1>
<p>
Paintboy is een game die was bedoeld om het Grafisch Lyceum Rotterdam te promoten. (2016)<br/>
Dit project is gemaakt met een team van 6 personen waaronder 2 programmeurs & 4 game artists.<br/>
De game is gemaakt in Unity 5 en de code is geschreven in C#.<br/>
Tijdens dit project heb ik bijna alle game logica geschreven en een paar levels ontworpen.
</p>

<h2>Technologie</h2>
<p>Unity 5 + C#</p>

<h2>Contact</h2>
<p>
Om contact met mij op te nemen kun je een mailtje schieten naar <a href="mailto:contact@joeyderuiter.me">contact@joeyderuiter.me</a>
</p>
`,
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/paintboy.mp4',
        thumbnail: '/assets/paintboy-thumbnail.png',
        horizontalColours: { r: 244, g: 244, b: 244 },
        verticalColours: { r: 143, g: 229, b: 7 }
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
