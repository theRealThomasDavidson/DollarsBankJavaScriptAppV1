var uuid = require('uuid');

class transaction{
    init(account, amount, time, id){
        if(id){
            this._id = id;
        }
        else{
            this._id = uuid.v4()
        }
        if(time){
            this._time = time;
        }
        else{
            this._time = Date.now();
        }
        this._account = account;
        this._account.add_transaction = this;
        this._amount = amount;
    }
    set id(value) {
        this._id = value;
    }
    get customer(){
        return this._account.customer;
    }
    get account(){
        return this._account;
    }
    get id (){
        return this._id;
    }
    get amount(){
        return this._amount
    }
    get time(){
        return this._time;
    }
    set time(value) {
        this._id = value;
    }
    set account(value){
        this._account.remove_transaction = this;
        value.add_transaction;
        this._account = value
    }
    set amount(value) {
        this._account.remove_transaction = this;
        value.transaction(this,this.value);
        this._amount = value;
    }
    get json(){
        return{
            "id": this._id,
            "time":this._time,
            "amount":this._amount
        }
    }
    load_json(acct, json){
        var id = json["id"];
        var time = json["time"];
        var amount = json["balance"];
        this.init(acct,amount, time, id);
    }
}

class account{
    init(customer, number, amount, id){
        if(id){
            this._id = id;
        }
        else{
            this._id = uuid.v4()
        }
        this._customer = customer;
        customer.add_account = this;
        this._number = number;
        this._amount = amount;
        this._transactions = new Map();
        return this;
    }
    
    get customer(){
        return this._customer;
    }
    get id (){
        return this._id;
    }
    get amount(){
        return this._amount
    }
    get transactions(){
        return this._transactions
    }
    get number(){
        return this._number
    }
    set customer(value) {
        value.add_account = this;
        this._customer.remove_account= this;
        this._customer = value;
    }
    set id(value) {
        this._id = value;
    }
    set number(value) {
        this._number = value;
    }
    set amount(value) {
        trans = new transaction();
        trans.init(this, value - this._value);
        this._transactions.set(trans.id, trans);
        this._amount = value;
    }
    set delta_amount(value) {
        console.log("");
        var t = new transaction();
        t.init(this, value);
        this._transactions.set(t.id, t);
        this._amount += value;
    }
    set remove_transaction(trans) {
        this._transactions.delete(trans.id);
    } 
    set add_transaction(trans) {
        this._transactions.set(trans.id, trans);
    } 
    print(){
    }
    get json(){
        var t = [];
        this.transactions.forEach((value,key) => {
            t[t.length] = value.json;
        });

        return {
            "id":this._id,
            "acct_number":this._number,
            "balance": this._amount,
            "transactions": t
        }
    }
    load_json(cust, json){
        var id = json["id"];
        var number = json["acct_number"];
        var amount = json["balance"];
        this.init(cust,number, amount, id);
        var transactions = json["transactions"];
        transactions.forEach((value) => {
            var t = new transaction();
            t.load_json(this, value);
            this.add_transaction = t;
        });
    }
}
class customer{
    init(name, password, id){
        if(id){
            this._id = id;
        }
        else{
            this._id = uuid.v4()
        }
        this._accounts = new Map();
        this._name= name;
        this._password = password;
        return this;
    }
    get name(){
        return this._name;
    }
    get password(){
        return this._password;
    }
    get accounts(){
        return this._accounts;
    }
    set name(value) {
        this._name = value;
    } 
    set password(value) {
        this._password = value;
    } 
    set remove_account(acct) {
        this._accounts.delete(acct.id);
    } 
    set add_account(acct) {
        this._accounts.set(acct.id, acct);
    } 
    print(){
    }
    get json(){
        var a = [];
        this.accounts.forEach((value,key) => {
            a[a.length] = value.json;
        });

        return {
            "id":this._id,
            "name":this._name,
            "password": this._password,
            "accounts": a
        }
    }
    load_json(json){
        var name = json["name"];
        var id = json["id"];
        var password = json["password"];
        this.init(name, password, id);
        var accounts = json["accounts"];
        accounts.forEach((value) => {
            var a = new account();
            a.load_json(this, value);
            this.add_account= a;
        });
    }
}

module.exports = { account, customer: customer, transaction };