
'use strict'
const {EOL} = require('os');
const readline = require('readline')

const model = require("./customer_account");
const controller = require("./dollars_bank_atm");

let Account = model.account;
let Customer = model.customer;
let Transaction = model.transaction;

var inp;
var customers = new Map();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const get_username = () => {
  return new Promise((resolve, reject) => {
    rl.question('username:  ', (answer) => {
      inp = answer.trim();
      resolve()
    })
  })
}
const get_password = () => {
    return new Promise((resolve, reject) => {
      rl.question('password: ', (answer) => {
        inp = answer.trim();
        resolve()
      })
    })
  }
const get_account_number = () => {
    return new Promise((resolve, reject) => {
      rl.question('Account Number: ', (answer) => {
        inp = answer.trim();
        resolve()
      })
    })
  }
const get_amount = () => {
    return new Promise((resolve, reject) => {
        rl.question('Dollar Amount: ', (answer) => {
        inp = answer.trim();
        resolve()
        })
    })
}

const choose = (choices) => {
    let message = "";
    choices.forEach((value, key) => {
        message += key + ": " + value + EOL;
    });
    return new Promise((resolve, reject) => {
        rl.question(message, (answer) => {
        inp = answer.trim();
        resolve(answer)
        })
    })
}
const choose__acct = (choices) => {
    let message = "";
    choices.forEach((value, key) => {
        message += key + ": \n" + value.as_string + EOL;
    });
    return new Promise((resolve, reject) => {
        rl.question(message, (answer) => {
        inp = answer.trim();
        resolve(answer)
        })
    })
}
const home_menu = async (customer, customers) =>{
    let choices = new Map();
    let dump = controller.read_from_file();
    let c;
    if(dump){
        dump.forEach((value) => {
            let c = new Customer();
            c.load_json(value);
            customers.set(c.name, c);
        });
    }
    choices.set("1", "logout");
    choices.set("2", "view accounts");
    choices.set("3", "view last 5 transactions");
    choices.set("4", "new account");
    choices.set("5", "withdrawl");
    choices.set("6", "deposit");
    choices.set("7", "transfer");
    await choose(choices);
    let account;
    let amount;
    let transactions;
    let a;
    let t;
    let achoices;
    let ndx;
    let custlist;
    switch(inp){
        case "1":
            customers.set(customer.name, customer);
            console.log("Goodbye "+ customer.name+ "!");
            customer.accounts.forEach((a,key)=>{
                console.log("amount " + a.amount);
            });
            custlist = [];
            customers.forEach((c)=>{
                custlist.push(c.json);
            });
            console.log(custlist[0].accounts);
            //controller.write_to_file(custlist);
            await main_menu(customers);
        case "2":
            customer.accounts.forEach((a) =>{
                console.log(a.as_string);
            });
            customers.set(customer.name,customer);
            await home_menu(customer, customers);
            break;
        
        case "3":
            transactions= [];
            customer.accounts.forEach((a) =>{
                a.transactions.forEach((t)=>{
                    if(transactions.length <= 5){
                        transactions.push(t);
                        
                    }
                    else{
                        for(let ndx = 0;ndx > 5; ndx += 1){
                            if (transactions[ndx].time < t.time){    
                                transactions.splice(ndx, 0, t);
                                transactions = transactions.slice(4);
                                break;
                            }
                        }
                    }
                })
            });
            transactions = transactions.slice(4);
            transactions.forEach((t)=>{
                console.log(t.as_string);
            })
            await home_menu(customer, customers);
            break;
        case "4": //new account
            console.log("New Account form:");
            await get_account_number();
            account = inp;
            await get_amount();
            amount = inp;
            if (isNaN(+amount)) {
                console.log("you must use a number for the amount");
                await home_menu(customer, customers);
                break;
            }
            if (+amount<0) {
                console.log("you must use a positive number for the amount");
                await home_menu(customer, customers);
                break;
            }
            a = new Account();
            a.init(customer, account, +amount);
            console.log("Account creation sucessful.");
            custlist = [];
            customers.forEach((c,key)=>{
                custlist.push(c.json);
            });
            
            controller.write_to_file(custlist);

            await home_menu(customer, customers);
            break;
        case "5": //withdrawl
            console.log("Withdrawl form:")
            achoices = new Map();
            ndx = 1;
            customer.accounts.forEach((a) =>{
                achoices.set(""+ndx, a);
                ndx += 1
            });
            console.log(achoices);
            await choose_acct(achoices);
            if(!achoices.has(inp)){
                console.log("could not find account.");
                await home_menu(customer, customers);
                break;
            }
            a = achoices.get(inp);
            await get_amount();
            amount = inp;
            if (isNaN(+amount)) {
                console.log("you must use a number for the withdrawl amount")
                await home_menu(customer, customers);
                break;
            }
            if (+amount<0) {
                console.log("you must use a positive number for the withdrawl amount")
                await home_menu(customer, customers);
                break;
            }
            t = a.delta_amount(-1 * +amount);
            console.log(t.as_string);
            console.log("Transaction complete.")
            await home_menu(customer, customers);
            break;
        case "6": //deposit
            console.log("Deposit form: Please enter the number in front of the account.")
            achoices = new Map();
            ndx = 1;
            customer.accounts.forEach((a) =>{
                achoices.set(""+ndx, a);
                ndx += 1
            });
            await choose_acct(achoices);
            if(!achoices.has(inp)){
                console.log("could not find account.");
                await home_menu(customer, customers);
                break;
            }
            a = achoices.get(inp);
            await get_amount();
            amount = inp;
            if (isNaN(+amount)) {
                console.log("you must use a number for the deposit amount")
                await home_menu(customer, customers);
                break;
            }
            if (+amount<0) {
                console.log("you must use a positive number for the deposit amount")
                await home_menu(customer, customers);
                break;
            }
            t = a.delta_amount(+amount);
            console.log(t.as_string);
            console.log("Transaction complete.")
            await home_menu(customer, customers);
            break;
        case "7": //transfer
            console.log("Transfer form: Please enter the number in front of the account.")
            achoices = new Map();
            ndx = 1;
            customer.accounts.forEach((a) =>{
                achoices.set(""+ndx, a);
                ndx += 1
            });
            console.log("Account to get money from");
            await choose_acct(achoices);
            if(!achoices.has(inp)){
                console.log("could not find account.");
                await home_menu(customer, customers);
                break;
            }
            let aw = achoices.get(inp);
            console.log("Account to send money to");
            await choose_acct(achoices);
            if(!achoices.has(inp)){
                console.log("could not find account.");
                await home_menu(customer, customers);
                break;
            }
            let ad = achoices.get(inp);
            await get_amount();
            amount = inp;
            if (isNaN(+amount)) {
                console.log("you must use a number for the transfer amount")
                await home_menu(customer, customers);
                break;
            }
            if (+amount<0) {
                console.log("you must use a positive number for the transfer amount")
                await home_menu(customer, customers);
                break;
            }
            t = aw.delta_amount((-1 * +amount));
            t = ad.delta_amount(+amount);
            console.log("Transaction complete.")
            await home_menu(customer, customers);
            break;
        default:
            console.log("whoopsie")
            await home_menu(customer, customers);

    }
    return customers;
}
const main_menu = async (customers) =>{
    console.log("Bank Customer CLI App!");
    console.log();
    console.log("Main Menu");
    if (customers === undefined || customers.size == 0) {
        let dump = controller.read_from_file();
        let c;
        if(dump){
            dump.forEach((value) => {
                let c = new Customer();
                c.load_json(value);
                customers.set(c.name, c);
            });
        }
    }
    let choices = new Map();
    choices.set("1", "new user");
    choices.set("2", "login");
    choices.set("3", "all users");
    choices.set("0", "exit");
    await choose(choices);
    let username;
    let password;
    let custlist;
    let c;
    switch(inp){
    case "1":
        if (customers === undefined || customers.size == 0) {
            let dump = controller.read_from_file();
            let c;
            if(dump){
                dump.forEach((value) => {
                    let c = new Customer();
                    c.load_json(value);
                    customers.set(c.name, c);
                });
            }
        }
        console.log("New User form:");
        await get_username();
        username = inp;
        await get_password();
        password = inp;
        c = new Customer();
        c.init(username, password);
        if (customers.has(c.name)) {
            console.log(customers.get(c.name));
        }
        if (customers.has(c.name)) {
            console.log("unable to create account.")
            break;
        }
        else{
            customers.set(c.name, c);
            console.log("Created account for " + c.name);
        
        }
        custlist = [];
        customers.forEach((c)=>{
            custlist.push(c.json);
        })
        controller.write_to_file(custlist);
        await main_menu(customers);
        break;
    case "2":
        console.log("Login form:")
        await get_username();
        username = inp;
        await get_password();
        password = inp;
        if (customers.has(username)){
            c = customers.get(username);
            if (c.password == password) {
                console.log("Welcome " + c.name+ "!");
                customers = await home_menu(c, customers);
            }
            else{
                console.log("User was not found.")
            }
        }
        else{
            console.log("User was not found.")
        }
        await main_menu(customers);
        break;
    case "3":
        console.log("test area1")
        console.log(
            custlist)
        
        console.log("test area2")
        console.log(customers)
        console.log("test area3")
        
        console.log("test area4")
        console.log("test area5")
        
        console.log("test area6")
        await main_menu(customers);
        break;
    case "0":
        console.log("exiting");
        process.exit(0);
    default:
        console.log("whoopsie")
        await main_menu(customers);

  }
}
module.exports = { main_menu };