import { Injectable } from '@angular/core';
import { WebGLCube } from '../models/webgl-cube.model';
import { InteractiveCubeManager } from 'src/app/pages/home/webgl-carousel/webgl-cube-manager/webgl-cube-manager';
import { Subject, Observable } from 'rxjs';

const contact = `
<h2>Contact</h2>

<p>
Om contact met mij op te nemen kun je een mailtje schieten naar <a href="mailto:contact@joeyderuiter.me">contact@joeyderuiter.me</a><br/>
of mij toevoegen op <a href="https://www.linkedin.com/in/joeyderuiter-programmer">linkedin</a>
</p>
`;

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
      description: `
<h1>Youi</h1>

<p>
Tijdens het laatste groepsproject van het tweede jaar (2019) heb ik gewerkt binnen een team om een
 prototypen van een Android dating app te ontwikkelen. Deze app moest de functionaliteit bezitten om
 met je dating partner te kunnen videobellen. Om dit mogelijk te maken heb ik er voor gekozen voor een peer-to-peer
 oplossing doormiddel van WebRTC.

</p>

<h2>Technologie</h2>
<p>
Kotlin voor de Android app met een MVVM structuur.</br>
NodeJS voor de Firebase cloud functions.</br>
WebRTC het peer to peer videobellen.
</p>

<h2>Team</h2>
<ul>
  <li>Ewout Millink</li>
  <li>Joey de Ruiter</li>
  <li>Omid Wiar</li>
  <li>Rutger Uijtendaal</li>
  <li>Vincent Nuis</li>
  <li>Wim de Groot</li>
</ul>
` + contact,
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/youi.mp4',
        thumbnail: '/assets/youi-thumbnail.jpg',
        horizontalColours: { r: 214, g: 17, b: 48 },
        verticalColours: { r: 237, g: 36, b: 68 }
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
` + contact,
      colour: { r: 245, g: 249, b: 252 },
      cubeParams: {
        video: '/assets/pc-parts.mp4',
        thumbnail: '/assets/pc-parts-thumbnail.jpg',
        horizontalColours: { r: 5, g: 118, b: 218 },
        verticalColours: { r: 0, g: 144, b: 248 }
      }
    },
    {
      name: 'Albert',
      description: `
<h1>Albert</h1>

<p>
Albert is een simpel boekhoud programma gericht op MKB bedrijven. Het doel van dit project was om een
 legacy programma van de opdrachtgever om te zetten naar een modern web gebaseerd project.
</p>

<p>
Dit project is gemaakt door een groep van 5 studenten, waarvan ik voornamelijk betrokken was met het opzetten van een CI & CD straat.
 Verder heb ik tijdens dit project gewerkt aan een tabel opzet structuur waarmee het mogelijk was om data via lazy loading in te laden.
</p>

<h2>Technologie</h2>
<p>
Angular 7, Dropwizard & TravisCI
</p>

<h2>Team</h2>
<ul>
  <li>Alexander van Dam</li>
  <li>Bashar Farah</li>
  <li>Joey de Ruiter</li>
  <li>Maarten Berden</li>
  <li>Sander Frentz</li>
</ul>
` + contact,
      colour: { r: 255, g: 255, b: 255 },
      cubeParams: {
        video: '/assets/albert.mp4',
        thumbnail: '/assets/albert-thumbnail.jpg',
        horizontalColours: { r: 13, g: 138, b: 155 },
        verticalColours: { r: 14, g: 169, b: 196 }
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
` + contact,
      colour: { r: 244, g: 244, b: 244 },
      cubeParams: {
        video: '/assets/paintboy.mp4',
        thumbnail: '/assets/paintboy-thumbnail.jpg',
        horizontalColours: { r: 114, g: 183, b: 5 },
        verticalColours: { r: 121, g: 194, b: 5 }
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
