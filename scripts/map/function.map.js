import { time } from "../utils/time.util.js";
import { addTictactoe } from "../utils/tictactoe.util.js";
import { addWordle } from "../utils/wordle.util.js";
import { submitWord } from "../utils/a.test.util.js";
import { greeting } from "../storage/initialized.js";

const functionMap ={
    time: function(){return time()},
    hello: function(){return 'Hello World';},
    tictactoe: (string)=>{ addTictactoe(string); return 'tictactoe-start'},
    wordle: async function() { 
        await addWordle(); // Tunggu hingga fetch API NYT & render UI selesai
        return 'Silahkan mainkan Wordle NYT hari ini!'; 
    },
    submit: (string)=>{ if(string.length < 5 || string.length > 5){
        return ` ${string} is not the right Length, you tryna kill me or make me bored?`;
    }
    submitWord(string); return `${string} is submitted`;
    },
    greeting: ()=>{ return greeting;}
}
//tambahin wordle
export { functionMap};