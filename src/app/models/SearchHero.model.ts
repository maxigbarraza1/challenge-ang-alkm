import { HeroesInfo } from './HeroesInfo.model';
export interface Search {
    response: string;
    search:string;
    results: HeroesInfo[];
}