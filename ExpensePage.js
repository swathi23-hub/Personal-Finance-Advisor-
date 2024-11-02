import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from 'axios'
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Swal from 'sweetalert2'

const ExpensePage = ()=>{
//--------------------------------------variable--declaration--------------------------------------------------------

const loctn = useLocation();
const [username, setUsername] = useState({uname:''});
const [tabledata ,setData] = useState([]);
const [isAddOrEdit, SetIsAddOrEdit] = useState(false);
const [totalExpensePerMonth, SettotalExpensePerMonth] = useState(0);
const [minExpensePerMonth, SetMinExpensePerMontn] = useState(0);
const[expenseValues, setBudgetValues] = useState({
    expenseId:0,
    description:'',
    cost:0,
    minexp:0,
    userName:''
});

//------------------------------------------------------------------------------------------------------------------

//--------------------------------------useEffects--Functions-------------------------------------------------------

useEffect(()=>{
    setUsername({uname:loctn.state.name}); 
},[loctn.state.name])

useEffect(()=>{
    setBudgetValues(b=>({...expenseValues,userName:username.uname}));
},[username.uname])

useEffect(()=>{
    if (username.uname)
    {
        axios.post('http://localhost:8081/expenseList',username)
        .then((res)=>{ 
            const data2 = res.data.recordsets[0];
            setData(data2);
            console.log(res.data.recordsets[0])
        })
        .catch(err => console.log(err));
    }
},[username])

useEffect(()=>{
    if (username.uname)
    {
        axios.post('http://localhost:8081/getMinExpPerMonth',username)
        .then((res)=>{ 
            SetMinExpensePerMontn(res.data.recordset[0].ExpensePerMonth);
        })
        .catch(err => console.log(err));
    }
},[username.uname])

useEffect(()=>{
    if (username.uname)
    {
        axios.post('http://localhost:8081/getTotExpPerMonth',username)
        .then((res)=>{ 
            if(res.data.recordset[0].Cost !== null)
            {
                SettotalExpensePerMonth(res.data.recordset[0].Cost);
            }
            else
            {
                SettotalExpensePerMonth(0);
            }
        })
        .catch(err => console.log(err));
    }
},[username.uname])

useEffect(()=>{
    setBudgetValues(e=>({...expenseValues,minexp:minExpensePerMonth}));
},[minExpensePerMonth])

//------------------------------------------------------------------------------------------------------------------

//--------------------------------------Toggle--Functions-----------------------------------------------------------

const toggleDiv = ()=>{
    SetIsAddOrEdit(!isAddOrEdit);
    setBudgetValues({...expenseValues,expenseId:0 ,description:'', cost:0});
}



//------------------------------------------------------------------------------------------------------------------



//--------------------------------------Events--Functions-----------------------------------------------------------

const handleSubmit = (e) => {

    e.preventDefault();
   
    if(expenseValues.description !=='' && expenseValues.cost !== 0)
    {
        if(expenseValues.minexp < expenseValues.cost)
        {
            Swal.fire({
                title: "Are you sure?",
                text: "Are you spending expense beyond the limit!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Sure!"
              }).then((result) => {
                if (result.isConfirmed) {
        
                    axios.post('http://localhost:8081/createExpense',expenseValues)
                    .then(res=> {
        
                        Swal.fire({
                            title: "Success!",
                            text: "Expense created Successfully!",
                            icon: "success"
                        })
                        .then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                                toggleDiv();
                            }
                            });
        
                    })
                    .catch(err => {
        
                        Swal.fire({
                            icon: "error",
                            title: "Oops",
                            text: err.response.data.error
                        })
                        .then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                                toggleDiv();
                            }
                            });
                    })
        
                  
                }
              });
        }
        else
        {
            axios.post('http://localhost:8081/createExpense',expenseValues)
            .then(res=> {

                Swal.fire({
                    title: "Success!",
                    text: "Expense created Successfully!",
                    icon: "success"
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                        toggleDiv();
                    }
                    });

            })
            .catch(err => {

                Swal.fire({
                    icon: "error",
                    title: "Oops",
                    text: err.response.data.error
                });
            })
        }
    
        
        
    }
    else
    {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter neccessary details!!"
          });
          
    }
};



const handleDelete = (id)=>{
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {

          axios.delete('http://localhost:8081/deleteExpense/'+id)
            .then(res=> {
                Swal.fire({
                    title: "Success!",
                    text: "Expense Id : "+id+" Deleted Successfully!",
                    icon: "success"
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                  });
            })
            .catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "Oops",
                    text: err.response.data.error
                });
            })

          
        }
      });
    
}

//------------------------------------------------------------------------------------------------------------------

return(
    <div>
        <div className="row my-3">
            <label className="h2 text-primary">&nbsp;Expenses</label>
        </div>

        <div className="row bg-primary mx-2" style={{height:"2px"}}></div>
            

        {
            isAddOrEdit ? (
                <div className="container mt-5">
                    <div className="row mt-4 mx-2">
                        <div className="col-8 d-flex justify-content-start align-items-center">
                            <h2 className="text-primary h4">Add Expense</h2>
                            
                        </div>
                        <div className="col-4 d-flex justify-content-end align-items-center">
                            <Link to="/dashboard/expensepage" state={{name : username.uname}} onClick={()=>{toggleDiv()}} className="btn btn-primary"><KeyboardBackspaceRoundedIcon/>Go Back</Link>
                        </div>
                    </div>
                    
                    <div className="row mt-4 justify-content-center">
                        <div className="col-12 col-md-6 bg-white rounded" style={{height:"400px", padding:"50px"}}>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        value={expenseValues.description}
                                        onChange={(e) => setBudgetValues({...expenseValues,description:e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="totalBudget" className="form-label">Total cost</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="totalBudget"
                                        value={expenseValues.cost}
                                        onChange={(e) => setBudgetValues({...expenseValues,cost:e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="text-center mt-5">
                                            <button type="submit" className="btn btn-info text-white">Submit</button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
            ) : (

                <div>
                    <div className="row mt-4 mx-2">
                        <div className="col-4 d-flex flex-column">
                            <label className="h5" style={{color:"#202896"}}>Total Expense /month : <CurrencyRupeeOutlinedIcon fontSize="large" sx={{ color: "#4ea64b" }}/>{totalExpensePerMonth}</label>
                            <label className="h5" style={{color:"#202896"}}>Minimum Expense /month : <CurrencyRupeeOutlinedIcon fontSize="large" sx={{ color: "#4ea64b" }}/> {minExpensePerMonth}</label>
                        </div>
                        <div className="col-8 d-flex justify-content-end align-items-center">
                            <Link to="/dashboard/expensepage" state={{name : username.uname}} onClick={()=>{toggleDiv()}} className="btn btn-success">+ Add Expense</Link>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="row p-0 m-0">
                            <label className="h4 text-primary text-center">List of Expenses</label>
                        </div>
                        <div className="row d-flex flex-wrap p-0 m-0">
                            
                            <div className="d-flex flex-wrap bg-white rounded mt-4 ms-4 overflow-scroll" style={{width:"95%", maxHeight:"350px"}}>
                                
                                
                                <table className="table fixTableHead">
                                    <thead style={{position:"sticky", top:"0px", height:"86px"}}>
                                        <tr className="text-center h5">
                                            <th >#</th>
                                            <th >Description</th>
                                            <th >Cost</th>
                                            <th >Actions</th>
                                        </tr>
                                    </thead>

                                    
                                    <tbody>
                                        {
                                            tabledata.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-warning h3">No records Found</td>
                                                </tr>
                                            ):(
                                                tabledata.map((expenseList,index)=>{
                                                    return <tr key={index} className="text-center">
                                                        <td>{index + 1}</td>
                                                        <td>{expenseList.Description}</td>
                                                        <td><CurrencyRupeeOutlinedIcon/>{expenseList.Cost}</td>
                                                        <td>
                                                            <span onClick={()=>{ handleDelete(expenseList.Id)}}><DeleteOutlineOutlinedIcon fontSize="large" sx={{ color: "#ff4848" }} /></span>
                                                        </td>
                                                    </tr>
                                                })
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-4 ms-3 text-primary">
                        <label>Total Records : {tabledata.length}</label>
                    </div>
                </div>

                
            )
        }

        

        
    </div>
)
}

export default ExpensePage;