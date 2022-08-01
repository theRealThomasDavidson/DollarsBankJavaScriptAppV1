const model = require("./customer_account");
let Account = model.account;
let Customer = model.customer;
let Transaction = model.transaction;

function account(){
    c = new Customer();
    c = c.init("carl", "password");
    a = new Account();
    a.init(c,"savings",43.54);
    console.log(a.customer.name);
    console.log(a.id);
    console.log(a.customer);
    console.log(a.number);
    console.log(a.amount);
    a.delta_amount = 50;
    console.log(a.amount);
    console.log("transactions");
    console.log(a.transactions.forEach(element => {
        element.json
    }));
    console.log(a.json);
    console.log();
    console.log();
    console.log();
    console.log("customer to json");
    map= c.json;
    d = new Customer();
    d.load_json(map);
    console.log(d);
    console.log(JSON.stringify(c.json, null, 2));
    return "hello from views";
}
module.exports = { account };