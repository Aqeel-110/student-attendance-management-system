const express=require('express');
const session=require('express-session');
const bodyParser=require('body-parser');
const app=express();
const port=3000;

const attendanceData ={
    'user1':{ 
        password: 'password1',
        present: 20, 
        absent: 5, 
        previous_months: {
            'January': 18,
            'February': 22,
            'March': 20,
            'April': 15,
            'May': 25,
            'June': 18,
        }
    },
    'user2':{ 
        password: 'password2',
        present: 15, 
        absent: 10, 
        previous_months: {
            'January': 12,
            'February': 14,
            'March': 15,
            'April': 20,
            'May': 18,
            'June': 22,
        }
    },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login',(req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    if (attendanceData[username] && attendanceData[username].password === password) {
        req.session.username = username;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/dashboard',(req, res) =>{
    if (!req.session.username) {
        return res.redirect('/login');
    }
    const user = req.session.username;
    const data = attendanceData[user];
    res.render('dashboard',{ user, data });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
