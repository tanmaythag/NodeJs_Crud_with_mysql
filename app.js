const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'workbench_password',
    database : 'database_name',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
        console.log('DB connection success');
    else
        console.log('connection failed \n Error :' +JSON.stringify(err,undefined,2));
});

app.listen(3000,()=>console.log('Express server is runnig at port no :3000'));

//default route
app.get('/',(req,res)=>{
    msg = "Test Database";
    res.send(msg);
});

//get all books
app.get('/books',(req,res)=>{
    mysqlConnection.query('SELECT * FROM books',(err, rows, fields)=>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//fetch by bookcode
app.get('/books/:bookcode',(req,res)=>{
    mysqlConnection.query('SELECT * FROM books WHERE bookcode = ?',[req.params.bookcode],(err, rows, fields)=>{
        if(!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.delete('/books/:bookcode',(req,res)=>{
    mysqlConnection.query('DELETE FROM books WHERE bookcode = ?',[req.params.bookcode],(err, rows, fields)=>{
        if(!err)
            res.send('Deleted Succesfully');
        else
            console.log(err);
    })
});


// insert book

app.post('/books',(req,res)=>{
    let book = res.body;
    var sql = " SET @bookcode = ?; SET @title = ?; SET @author = ?; SET @numpages = ?; \
                CALL Bookaddedit(@bookcode,@title,@author,@numpages);   "

    mysqlConnection.query(sql, [book.bookcode, book.title, book.author, book.numpages],(err, rows, fields)=>{
        if(!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('inserted bookcode :'+element[0].bookcode);
                
            });
        else
            console.log(err);
    })
});

//update any book record

app.put('/books',(req,res)=>{
    let book = res.body;
    var sql = " SET @bookcode = ?; SET @title = ?; SET @author = ?; SET @numpages = ?; \
                CALL Bookaddedit(@bookcode,@title,@author,@numpages);   "

    mysqlConnection.query(sql, [book.bookcode, book.title, book.author, book.numpages],(err, rows, fields)=>{
        if(!err)
            res.send('Updated Sucessfully');
                
        else
            console.log(err);
    })
});
