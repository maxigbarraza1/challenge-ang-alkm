import { Estadisticas } from './HeroStats.model';
import { Biografia } from './HeroBiography.model';
import { Trabajo } from './HeroWork.model';
import { Imagen } from './HeroImage.model';
import { Conexiones } from './HeroConnections.model';
import { Apariencia } from './HeroAppareance.model';
export interface HeroesInfo{
    id:string;
    name:string;
    powerstats: Estadisticas;
    biography: Biografia;
    appearence: Apariencia;
    work: Trabajo;
    connections: Conexiones;
    image: Imagen;
}