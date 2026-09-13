class Node {
    constructor(value){
        this.value= value;
        this.next = null;
    }
}

export class circularLinkedList {
    constructor(){
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    append(value){
        const newNode = new Node(value);
        if(!this.head){
            this.head = newNode;
            this.tail = newNode;
            newNode.next = this.head;
        } else{
            this.tail.next = newNode;
            this.tail = newNode;
            this.tail.next = this.head;
        }
        this.size++;
    }
    print(count = this.size){
        if(!this.head)return;
        let current  = this.head;
        let result = [];
        for(let i = 0; i<count;i++){
            result.push(current.value);
            current = current.next;
        }
        console.log(result.join(' > '));
    }
}