
export const submitWord = (string)=>{
    const word = [...string.toUpperCase()];
    for(let letter of word){
        console.log(letter);
    }
}
