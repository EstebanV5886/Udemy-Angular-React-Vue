import { Component } from '@angular/core';

@Component({
    selector: 'mi-componente',
    templateUrl: './mi-componente.component.html'
})

export class MiComponente{

    public titulo: string;
    public comentario: string;
    public year: number;
    public mostrarPeliculas: boolean;

    constructor(){
        
        this.titulo = "Hola Mundo";
        this.comentario = "Lalalala!"
        this.year = 2020;
        this.mostrarPeliculas = true;

        console.log("Componente cargado");
        console.log(this.titulo);
        console.log(this.comentario);
        console.log(this.year);
    }

    ocultarPeliculas(){
        this.mostrarPeliculas = false;
    }
}