
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

app.get('/',function(req,res){
    
    db.query("select * from member" , function(error,result){
        if(error) throw error;
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


app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});