import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name:'espar'
})
export class EsParPipe implements PipeTransform{
    transform(value: any){

        var esPar = "no es par";

        if(value % 2 ==0){

            esPar = "es par";
        }

        return "El anio es " + value + " y " + esPar;
    }
}