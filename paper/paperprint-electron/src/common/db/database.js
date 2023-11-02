const sqlite3 = require('sqlite3').verbose();
const {open} = require('sqlite');

const connectdb = (dbpath)=>{
    return open({
        filename:dbpath,
        driver:sqlite3.Database
    })
}

module.exports = {connectdb}
