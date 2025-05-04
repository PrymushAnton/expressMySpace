import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export function capitalizeWords(string: string): string {
    return string
    .split(' ')
    .map(el => {return capitalizeFirstLetter(el)})
    .join(' ');
}