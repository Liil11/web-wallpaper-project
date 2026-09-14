import { add } from "./wordle.util.js";


export const submitWord = (string)=>{
    const word = [...string.toUpperCase()];
    for(let letter of word){
        console.log(letter);
    }
}