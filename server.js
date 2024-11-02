const sql = require('mssql');
const cors = require('cors');
const express = require('express');
const port = 8081;
const app = express();
const bodyParser = require('body-parser');


 
// config for your database
var config = {
    user: 'sa',
    password: 'ash123',
    server: 'DESKTOP-1JKHG1M\\SQLEXPRESS',
    database: 'PFA_DB' ,
    synchronize: true,
    options: 
    {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

app.use(cors({origin:'*'}))
app.use(bodyParser({extended:true}));
app.use(express.json());

// Connect to MSSQL
sql.connect(config)
  .then(() => console.log('Connected to MSSQL'))
  .catch(err => console.error('Connection failed', err));

// Define routes for CRUD operations
// Implement CRUD operations here


//create new user
app.post('/createUser',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const values = [
            req.body.name,
            req.body.password,
            req.body.income,
            req.body.marritalStatus
        ]
           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);
        request.input('password', sql.NVarChar, values[1]);
        request.input('income', sql.Int, values[2]);
        request.input('marritalstatus', sql.NVarChar, values[3]);
        request.input('Type',sql.VarChar,'CreateUser')

        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error inserting record into the database' });
            }

            if(result.recordset[0].Result === 'userexist')
            {
                return res.status(500).json({ error: 'User already exist' });
            }

            res.json(result);
        });


    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//user login
app.post('/userLogin',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.name,
            req.body.password
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);
        request.input('password', sql.NVarChar, values[1]);
        request.input('Type',sql.VarChar,'userLogin')

        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error inserting record into the database' });
            }

            if(result.recordset[0].Result === 'fail')
            {
                return res.status(500).json({ error: 'Incorrect User Credentials' });
            }

            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})
 
//BudgetList
app.post('/budgetList',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.uname
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);
        request.input('Type',sql.VarChar,'budgetList')

        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error fetching record into the database' });
            }


            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})

//CreateBudget
app.post('/createBudget',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const values = [
            req.body.description,
            req.body.totalBudget,
            req.body.priority,
            req.body.userName
        ]


           
        //query to the database and insert the record
        request.input('description', sql.NVarChar, values[0]);
        request.input('totalBudget', sql.Int, parseInt(values[1]));
        request.input('priority', sql.NVarChar, values[2]);
        request.input('name', sql.NVarChar, values[3]);
        request.input('Type',sql.VarChar,'CreateBudget')



        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error inserting record into the database' });
            }


            res.json(result);
        });


    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//UpdateBudget
app.put('/updateBudget',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const values = [
            req.body.totalBudget,
            req.body.priority,
            req.body.budgetId
        ]


           
        //query to the database and insert the record

        request.input('totalBudget', sql.Int, parseInt(values[0]));
        request.input('priority', sql.NVarChar, values[1]);
        request.input('budgetid', sql.Int, parseInt(values[2]));
        request.input('Type',sql.VarChar,'UpdateBudget');




        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error updating record into the database' });
            }

            res.json(result);
        });


    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//DeleteBudget
app.delete('/deleteBudget/:id',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();



        const id = req.params.id;


           
        //query to the database and insert the record

        request.input('budgetid', sql.Int, id);
        request.input('Type',sql.VarChar,'DeleteBudget');

        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error deleting record into the database' });
            }

            res.json(result);
        });


    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//ExpenseList
app.post('/expenseList',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.uname
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);
        request.input('Type',sql.VarChar,'ExpenseList')

        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error fetching record into the database' });
            }


            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})

//CreateExpense
app.post('/createExpense',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const values = [
            req.body.description,
            req.body.cost,
            req.body.userName,
            req.body.minexp
        ]

           
        //query to the database and insert the record
        request.input('description', sql.NVarChar, values[0]);
        request.input('cost', sql.Int, parseInt(values[1]));
        request.input('name', sql.NVarChar, values[2]);
        request.input('minexp', sql.Int, values[3]);
        request.input('Type',sql.VarChar,'CreateExpense')



        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error inserting record into the database' });
            }

            if(result.recordset[0].Result === 'fail')
            {
                return res.status(500).json({ error: 'Sorry!! the expense limit is reached out of your total savings' });
            }


            res.json(result);
        });


    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//DeleteBudget
app.delete('/deleteExpense/:id',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();



        const id = req.params.id;


           
        //query to the database and insert the record

        request.input('expenseid', sql.Int, id);
        request.input('Type',sql.VarChar,'DeleteExpense');


        request.execute('SP_DataHandling',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error deleting record into the database' });
            }

            res.json(result);
        });


    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//getMinExpensePerMonth
app.post('/getMinExpPerMonth',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.uname
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);


        request.query('select ExpensePerMonth from UserDetails where Username = @name',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error fetching record into the database' });
            }

            

            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})

//getTotExpensePerMonth
app.post('/getTotExpPerMonth',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.uname
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);


        request.query('select sum(Cost) as Cost from ExpenseList where Username = @name',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error fetching record into the database' });
            }

            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})

//get_Beyond_Expense_And_Total_Savings
app.post('/getBeyondAndTotAmt',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.uname
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);


        request.query('select BeyondExp,TotalSavings from UserDetails where Username = @name',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error fetching record into the database' });
            }

            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})

//getBudgetStatus
app.post('/getBudgetStatus',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object


        var request = new sql.Request();

        const values = [
            req.body.uname
        ]

           
        //query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);


        request.query('select count([Status]) as BudgetCount from BudgetList where [Status] = 1 and Username = @name',
        (err, result) =>{
            if(err)
            {
                return res.status(500).json({ error: 'Error fetching record into the database' });
            }

            res.json(result);
        });


    });
    }
    catch (err)
    {
        //console.log("error",error)
        return res.status(500).json({ error: err });
    }
})

//list the student details
app.get('/', (req, res) =>{
 
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from student',  (err, result)=> {
            
            if (err) console.log(err)

            // send records as a response
            res.json(result);
            
        });
    });
    }
    catch (error)
    {
        console.log("error",error)
    }
});

//add the student
app.post('/addStudent',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const values = [
            req.body.name,
            req.body.email
        ]
           
        // query to the database and insert the record
        request.input('name', sql.NVarChar, values[0]);
        request.input('email', sql.NVarChar, values[1]);

        request.query('INSERT INTO student (Name, Email) VALUES (@name, @email)',
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error inserting record into the database' });
            }

            // send success response
            res.json(result);
        });
    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//read the single student details
app.get('/read/:id', (req, res) =>{
 
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const id = req.params.id;

        // query to the database and insert the record
        request.input('id', sql.Int, id);
           
        // query to the database and get the records
        request.query('select * from student where ID = @id',  (err, result)=> {
            
            if (err) console.log(err)

            // send records as a response
            res.json(result);
            
        });
    });
    }
    catch (error)
    {
        console.log("error",error)
    }
});

//update the student
app.put('/updateStudent/:id',(req,res)=>{
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const id = req.params.id;

        const values = [
            req.body.name,
            req.body.email
        ]

        // query to the database and insert the record
        request.input('id', sql.Int, id);
        request.input('name', sql.NVarChar, values[0]);
        request.input('email', sql.NVarChar, values[1]);
           
        // query to the database and get the records
        request.query('update student set Name=@name, Email=@email where ID = @id',  (err, result)=> {
            
            if (err) console.log(err)

            // send records as a response
            res.json(result);
            
        });
    });
    }
    catch (error)
    {
        console.log("error",error)
    }
})

//delete the single student details
app.delete('/deleteStudent/:id', (req, res) =>{
 
    try
    {
         // connect to your database
        sql.connect(config,  (err)=> {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        const id = req.params.id;

        // query to the database and insert the record
        request.input('id', sql.Int, id);
           
        // query to the database and get the records
        request.query('delete from student where ID = @id',  (err, result)=> {
            
            if (err) console.log(err)

            // send records as a response
            res.json(result);
            
        });
    });
    }
    catch (error)
    {
        console.log("error",error)
    }
});

// Start server

app.listen(port, function () {
    console.log('Server is running..');
});