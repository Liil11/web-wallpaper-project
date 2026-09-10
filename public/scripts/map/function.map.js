import { time } from "../utils/time.util.js";
import { addTictactoe } from "../utils/tictactoe.util.js";

const functionMap ={
    time: function(){return time()},
    hello: function(){return 'Hello World';},
    tictactoe: function(){ addTictactoe(); return 'tictactoe-start'}
}

export { functionMap};