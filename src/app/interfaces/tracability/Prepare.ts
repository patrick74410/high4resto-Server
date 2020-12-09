import { ToPrepareI } from './ToPrepare';

export interface PrepareI {
    id?: string;
    toPrepare: ToPrepareI;
    inside: string;
}