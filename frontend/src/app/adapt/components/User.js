import React from 'react';
import './User.css';

const User = props => {

    const handleDelete = () => {
        props.onDelete(props.id); // Call onDelete function with id
    };

    return (    
        
        
            <div className="list">
                <div className='old3'>
                <button onClick={handleDelete}>X</button>
                </div>
                
                <div className='exit'>
                    <h1 className='old'> {props.pname} </h1>
                </div>
                <hr className='bor' />
                <h3 className='old2'> Completion </h3>
                <h3 className='old2'> [Progress Bar] </h3>
            </div>
        
    )
}

export default User;
