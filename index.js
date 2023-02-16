
const express = require('express');
const app = express();
const PORT = 4000;
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require("body-parser");

let corsOption = {
    origin: "*",
    credential: true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
    host: 'svc.sel3.cloudtype.app',
    port: '32513',
    user: 'user1',
    password: '1234',
    database: 'animal'
})

app.get('/', function (req, res) {

    db.query("select * from member", function (error, result) {
        if (error) throw error;
        res.send(result);
    })
});



app.post("/login", (req, res) => {
    var id = req.body.id;
    var pass = req.body.pass;
    console.log(id, pass);
    if (id && pass) {
        db.query("select * from member where member_id = ? and member_pass = ?", [id, pass], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                res.send('성공')
            }
            else {
                res.send("아이디와 비밀번호가 다릅니다.")
            }
        })
    }
})

app.post("/idCheck", (req, res) => {
    var id = req.body.id;
    console.log(id)
    if (id) {
        db.query("select * from member where member_id =?", [id], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                res.send(false);
            }
            else {
                res.send(true);
            }
        })
    }
})

app.post("/singUp", (req, res) => {
    var id = req.body.id;
    var pass = req.body.pass;
    var name = req.body.name;
    var tel = req.body.tel;
    var email = req.body.email;
    var sqlQuery = "insert into member (member_id, member_pass, member_name, member_tel, member_email) value(?,?,?,?,?)"
    db.query(sqlQuery, [id, pass, name, tel, email], function (error, result) {
        if (error) throw error;
    })
    res.send();

})
app.get("/list", (req, res) => {
    var sqlQuery = "select * from todoList order by todo_no desc"
    db.query(sqlQuery, function (error, result) {
        res.send(result);
    })
})
app.post('/insert', (req, res) => {
    var title = req.body.title;
    var name = req.body.name;
    var content = req.body.content;
    console.log(req.body)
    var sqlQuery = "insert into todoList (todo_title,todo_content,todo_name) value(?,?,?)";
    db.query(sqlQuery, [title, content, name], function (error, result) {
        if (error) throw error;

        res.send('저장완료');
    })
})


app.post('/delete', (req, res) => {
    var no = req.body.no;
    var sqlQuery = "delete from todoList where todo_no = ?"
    db.query(sqlQuery, [no], function (error, result) {
        if (error) throw error;
        res.send("삭제완료");
    })
})
app.post('/update', (req, res) => {
    var no = req.body.no;
    var title = req.body.title;
    var name = req.body.name;
    var content = req.body.content;
    var sqlQuery = "update todoList set todo_title = ? , todo_name = ? , todo_content = ?  where todo_no = ?"
    db.query(sqlQuery, [title, name, content, no], function (error, result) {
        if (error) throw error;
        res.send("수정완료");
    })
})

app.post('/select', (req, res) => {
    var type = req.body.type;
    var value = req.body.value;
    var sqlQuery;
    switch (type) {
        case 'ALL':
            sqlQuery = "select * from todoList order by todo_no desc";
            break;
        case 'both':
            sqlQuery = "select * from todoList where (todo_title like ? or todo_name like ?) order by todo_no desc";
            break;
        case 'title':
            sqlQuery = "select * from todoList where todo_title like ? order by todo_no desc";
            break;
        case 'name':
            sqlQuery = "select * from todoList where todo_name like ? order by todo_no desc";
            break;
    }
    
    db.query(sqlQuery,['%'+value+'%'], function (error, result) {
        if (error) throw error;
        res.send(result);
        console.log(result)
    })

})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});