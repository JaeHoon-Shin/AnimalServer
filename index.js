
const express = require('express');
const app = express();
const PORT = 4000;
const mysql = require('mysql');


//CORS란 자신이 속하지 않은 다른 도메인, 다른 프로토콜, 혹은 다른 포트에 있는 리소스를 요청하는 cross-origin HTTP 요청 방식이다
const cors = require('cors');

let corsOption = {
    origin: "*",
    credential: true
}

app.use(cors(corsOption));

app.use(express.json());

//POST request data의 body로부터 파라미터를 편리하게 추출합니다.
const bodyParser = require("body-parser"); 

app.use(bodyParser.urlencoded({ extended: true }));


// db 정보
const db = mysql.createPool({
    host: 'svc.sel3.cloudtype.app',
    port: '32513',
    user: 'user1',
    password: '1234',
    database: 'animal'
})
//테스트 확인용
app.get('/', function (req, res) {

    db.query("select * from member", function (error, result) {
        if (error) throw error;
        res.send(result);
    })
});


//로그인
app.post("/login", (req, res) => {
    var id = req.body.id;
    var pass = req.body.pass;
    console.log(id, pass);
    if (id && pass) {
        db.query("select * from member where member_id = ? and member_pass = ?", [id, pass], function (error, result) {
            if (error) throw error;
            if (result.length > 0) {
                res.json({data:result , meg : '성공'})
            }
            else {
                res.send("아이디와 비밀번호가 다릅니다.")
            }
        })
    }
})
//아이디 체크
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
//회원가입
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
//모든 리스트 출력
app.get("/list", (req, res) => {
    var sqlQuery = "select * from todoList order by todo_no desc"
    db.query(sqlQuery, function (error, result) {
        res.send(result);
    })
})
//저장
app.post('/insert', (req, res) => {
    var title = req.body.title;
    var name = req.body.name;
    var content = req.body.content;
    var sqlQuery = "insert into todoList (todo_title,todo_content,todo_name) value(?,?,?)";
    db.query(sqlQuery, [title, content, name], function (error, result) {
        if (error) throw error;

        res.send();
    })
})

//삭제
app.post('/delete', (req, res) => {
    var no = req.body.no;
    var sqlQuery = "delete from todoList where todo_no = ?"
    db.query(sqlQuery, [no], function (error, result) {
        if (error) throw error;
        res.send("삭제완료");
    })
})
//수정
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
// 검색 근데 front단에서 하는게 더 간단해보임;;;;;; 
app.post('/select', (req, res) => {
    var type = req.body.type;
    var value = req.body.value;
    var sqlQuery;
    switch (type) {
        case 'ALL':
            sqlQuery = "select * from todoList order by todo_no desc";
            break;
        case 'both':
            sqlQuery = `select * from todoList where (todo_title like '%${value}%' or todo_name like '%${value}%') order by todo_no desc`;
            break;
        case 'title':
            sqlQuery = `select * from todoList where todo_title like '%${value}%' order by todo_no desc`;
            break;
        case 'name':
            sqlQuery = `select * from todoList where todo_name like '%${value}%' order by todo_no desc`;
            break;
    }
    
    db.query(sqlQuery, function (error, result) {
        if (error) throw error;
        res.send(result);

    })

})

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});