import react from 'react'
import { useState } from 'react'

const Questions = () =>{
    const [formData,setFormData]=useState({Use:'', Operatingsystem:'',portability:'',price:''});

    const handleChange = (e)=>{
        const {name,value}= e.target;
        setFormData(prevState=>({...prevState,[name]:value}));
    };

    const handleSubmit =(e)=>{
        e.preventDefault();
        console.log(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="Use" value={formData.name} onchange={handleChange}/>
            <button type="submit">Use</button>
        </form>
    );

};

export default Questions;
