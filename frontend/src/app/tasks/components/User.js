import React from 'react';
import './User.css';

const User = props => {

    const handleDelete = () => {
        props.onDelete(props.id); // Call onDelete function with id
    };

    return (    
        
        
            <div className="list11">
                <div className='exit1'>
                    <h1 className='old1'> {props.task_name} </h1>
                    <button onClick={handleDelete}>X</button>
                </div>
                <h3 className='old11'> {props.pro_name} </h3>
                <h3 className='old11'> {props.in_charge_name} </h3>
                <h3 className='old11'> {props.date} </h3>
                <hr className='bor1' />
                <h3 className='old21'> Completion </h3>
                <h3 className='old21'> [progress Bar] </h3>
            </div>
        
    )
}

export default User;
