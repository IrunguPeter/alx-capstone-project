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
        <div className="p-8 bg-gray-100 rounded-lg shadow-md justify-center">
            <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded-lg shadow-md justify-center">
                <h1>Hello there</h1>
                <input type="text" name="Use" value={formData.Use} onChange={handleChange}/>
                <button type="submit">Use</button>
            </form>
        </div>
    );

};

export default Questions;
