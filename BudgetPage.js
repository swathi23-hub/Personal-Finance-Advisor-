import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '../BudgetPage/BudgetPage.css'
import axios from 'axios'
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import ModeRoundedIcon from '@mui/icons-material/ModeRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CurrencyRupeeOutlinedIcon from '@mui/icons-material/CurrencyRupeeOutlined';
import Swal from 'sweetalert2'


const BudgetPage = ()=>{

    //--------------------------------------variable--declaration--------------------------------------------------------

    const loctn = useLocation();
    const [username, setUsername] = useState({uname:''});
    const [tabledata ,setData] = useState([]);
    const [successCount, setSuccessCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [isAddOrEdit, SetIsAddOrEdit] = useState(false);
    const [isAdd, SetIsAdd] = useState(true);
    const[budgetValues, setBudgetValues] = useState({
        budgetId:0,
        description:'',
        totalBudget:0,
        priority:'',
        userName:''
    });

    //------------------------------------------------------------------------------------------------------------------

    //--------------------------------------useEffects--Functions-------------------------------------------------------

    useEffect(()=>{
        setUsername({uname:loctn.state.name}); 
    },[loctn.state.name])

    useEffect(()=>{
        setBudgetValues(b=>({...budgetValues,userName:username.uname}));
    },[username.uname])

    useEffect(()=>{
        if (username.uname)
        {
            axios.post('http://localhost:8081/budgetList',username)
            .then((res)=>{ 
                const data2 = res.data.recordsets[0];
                setData(data2);
                countStatus(data2);
                console.log(res.data.recordsets[0])
            })
            .catch(err => console.log(err));
        }
    },[username])

    //------------------------------------------------------------------------------------------------------------------

    //--------------------------------------Toggle--Functions-----------------------------------------------------------

    const toggleDiv = ()=>{
        SetIsAddOrEdit(!isAddOrEdit);
        setBudgetValues({...budgetValues,budgetId:0 ,description:'', totalBudget:0, priority:''});
    }

    const toggleisAdd = ()=>{
        SetIsAdd(true);
    }

    const toggleisEdit = (item)=>{
        SetIsAdd(false);
        setBudgetValues({...budgetValues, budgetId:item.Id ,description:item.Description, totalBudget:item.Total_Budget, priority:item.Priority});
    }

    //------------------------------------------------------------------------------------------------------------------

    //--------------------------------------Styles--Functions-----------------------------------------------------------

    const getPriorityStyle = (Priority) => {
        switch (Priority) {
            case 'High':
                return { color: 'red' };
            case 'Medium':
                return { color: 'darkorange' };
            case 'Low':
                return { color: 'blue' };
            default:
                return {};
        }
    };

    //------------------------------------------------------------------------------------------------------------------

    //--------------------------------------dataValid--Functions--------------------------------------------------------

    const countStatus = (data1) => {
        const sucCount = data1.filter(item => item.Status === true).length;
        const penCount = data1.filter(item => item.Status === false).length;
        setSuccessCount(sucCount);
        setPendingCount(penCount);
    };

    //------------------------------------------------------------------------------------------------------------------

    //--------------------------------------Events--Functions-----------------------------------------------------------

    const handleSubmit = (e) => {

        e.preventDefault();
       
        if(budgetValues.description !=='' && budgetValues.totalBudget !== 0 && budgetValues.priority !=='')
        {
            if(isAdd)
            {
                
                console.log(budgetValues.userName);
                axios.post('http://localhost:8081/createBudget',budgetValues)
                .then(res=> {

                    Swal.fire({
                        title: "Success!",
                        text: "Budget created Successfully!",
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
            else
            {
                axios.put('http://localhost:8081/updateBudget',budgetValues)
                .then(res=> {

                    Swal.fire({
                        title: "Success!",
                        text: "Budget Id : "+budgetValues.budgetId+" Updated Successfully!",
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

              axios.delete('http://localhost:8081/deleteBudget/'+id)
                .then(res=> {
                    Swal.fire({
                        title: "Success!",
                        text: "Budget Id : "+id+" Deleted Successfully!",
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
                <label className="h2 text-primary">&nbsp;Budgets</label>
            </div>

            <div className="row bg-primary mx-2" style={{height:"2px"}}></div>
                
            

            {
                isAddOrEdit ? (
                    <div className="container mt-5">
                        <div className="row mt-4 mx-2">
                            <div className="col-8 d-flex justify-content-start align-items-center">
                                { isAdd ? (<h2 className="text-primary h4">Create Budget</h2>):(<h2 className="text-primary h4">Edit Budget - Budget Id : {budgetValues.budgetId}</h2>)}
                                
                            </div>
                            <div className="col-4 d-flex justify-content-end align-items-center">
                                <Link to="/dashboard/budgetpage" state={{name : username.uname}} onClick={()=>{toggleDiv()}} className="btn btn-primary"><KeyboardBackspaceRoundedIcon/>Go Back</Link>
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
                                            disabled={!isAdd}
                                            value={budgetValues.description}
                                            onChange={(e) => setBudgetValues({...budgetValues,description:e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="totalBudget" className="form-label">Total Budget</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="totalBudget"
                                            value={budgetValues.totalBudget}
                                            onChange={(e) => setBudgetValues({...budgetValues,totalBudget:e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="priority" className="form-label">Priority</label>
                                        <select
                                            className="form-select"
                                            id="priority"
                                            value={budgetValues.priority}
                                            onChange={(e) => setBudgetValues({...budgetValues,priority:e.target.value})}
                                            required
                                        >
                                            <option value="">Select priority</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    {
                                        isAdd ? (
                                            <div className="text-center mt-5">
                                                <button type="submit" className="btn btn-info text-white">Submit</button>
                                            </div>
                                        ):(
                                            <div className="text-center mt-5">
                                                <button type="submit" className="btn btn-info text-white">Update</button>
                                            </div>
                                        )
                                    }
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (

                    <div>
                        <div className="row mt-4 mx-2">
                            <div className="col-4 d-flex flex-column">
                                <label className="h5" style={{color:"#202896"}}>Ready to Buy  <DoneAllOutlinedIcon fontSize="large" sx={{ color: "#4ea64b" }}/> : {successCount}</label>
                                <label className="h5" style={{color:"#202896"}}>Pending  <PendingActionsRoundedIcon fontSize="large" sx={{ color: "#ff4848" }}/> : {pendingCount}</label>
                            </div>
                            <div className="col-8 d-flex justify-content-end align-items-center">
                                <Link to="/dashboard/budgetpage" state={{name : username.uname}} onClick={()=>{toggleDiv(); toggleisAdd();}} className="btn btn-success">+ Add Budget</Link>
                            </div>
                        </div>
 
                        <div className="row">
                            <div className="row p-0 m-0">
                                <label className="h4 text-primary text-center">List of Budgets</label>
                            </div>
                            <div className="row d-flex flex-wrap p-0 m-0">
                                
                                <div className="d-flex flex-wrap bg-white rounded mt-4 ms-4 overflow-scroll" style={{width:"95%", maxHeight:"350px"}}>
                                    
                                    
                                    <table className="table fixTableHead">
                                        <thead style={{position:"sticky", top:"0px", height:"86px"}}>
                                            <tr className="text-center h5">
                                                <th >#</th>
                                                <th >Description</th>
                                                <th >Total Budget</th>
                                                <th >Earned money</th>
                                                <th >Priority</th>
                                                <th >Status</th>
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
                                                    tabledata.map((budgetList,index)=>{
                                                        return <tr key={index} className="text-center">
                                                            <td>{index+1}</td>
                                                            <td>{budgetList.Description}</td>
                                                            <td><CurrencyRupeeOutlinedIcon/>{budgetList.Total_Budget}</td>
                                                            <td><CurrencyRupeeOutlinedIcon/>{budgetList.Earned_Money}</td>
                                                            <td style={getPriorityStyle(budgetList.Priority)}>{budgetList.Priority}</td>
                                                            <td>{budgetList.Status ? <DoneAllOutlinedIcon sx={{ color: "#4ea64b" }} /> : <PendingActionsRoundedIcon sx={{ color: "#ff4848" }} />}</td>
                                                            <td>
                                                                <span onClick={()=>{toggleDiv(); toggleisEdit(budgetList);}} className="mx-2"><ModeRoundedIcon fontSize="large" sx={{ color: "#202896" }}/></span>
                                                                <span onClick={()=>{ handleDelete(budgetList.Id)}}><DeleteOutlineOutlinedIcon fontSize="large" sx={{ color: "#ff4848" }} /></span>
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

export default BudgetPage;