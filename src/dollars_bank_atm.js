var fs = require('fs');
const filepath = 'dollars_bank.json';
function write_to_file(obj){
    fs.writeFile(filepath, JSON.stringify(obj, null, 2), function(err, result) {
        if(err) console.log('error', err);
      });
}
function read_from_file(){
    let rawdata = fs.readFileSync(filepath, {encoding:'utf8', flag:'r'});
    return  JSON.parse(rawdata);
}
module.exports = { write_to_file, read_from_file };