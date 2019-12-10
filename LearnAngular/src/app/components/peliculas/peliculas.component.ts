import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { PeliculaService } from '../../services/pelicula.service';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.css'],
  providers: [PeliculaService]
})
export class PeliculasComponent implements OnInit, DoCheck, OnDestroy {

  public titulo: string;
  public peliculas: Array<Pelicula>;
  public favorita: Pelicula;
  public fecha: any;

  constructor(
    private _peliculaService:PeliculaService
  ) {
    this.titulo = "Componente Peliculas";
    this.peliculas = this._peliculaService.getPeliculas();
    this.fecha = new Date(2020, 7, 6);
  }

  ngOnInit() {
    console.log(this.peliculas);
    console.log("Componente cargado");
    console.log(this._peliculaService.holaMundo());
  }

  ngDoCheck() {
    console.log("DoCheck Lanzado");
  }

  cambiarTitulo() {
    this.titulo = "New Title";
  }

  ngOnDestroy() {
    console.log("El componente se va a eliminar");
  }

  mostrarFavorita(event){
    this.favorita = event.pelicula;
  }

}
