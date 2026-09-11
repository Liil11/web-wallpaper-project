import { time } from "../utils/time.util.js";
import { addTictactoe } from "../utils/tictactoe.util.js";
import { addWordle } from "../utils/wordle.util.js";

const functionMap ={
    time: function(){return time()},
    hello: function(){return 'Hello World';},
    tictactoe: function(){ addTictactoe(); return 'tictactoe-start'},
    wordle: async function() { 
        await addWordle(); // Tunggu hingga fetch API NYT & render UI selesai
        return 'Silahkan mainkan Wordle NYT hari ini!'; 
    }
}
//tambahin wordle
export { functionMap};