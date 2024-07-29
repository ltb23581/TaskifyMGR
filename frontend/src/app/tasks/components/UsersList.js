'use client';

import User from "./User";
import Card from "./Card";
import React from 'react';

const UsersList = ({ tasks, onDelete }) => {
    console.log(tasks);
    if (!tasks || !Array.isArray(tasks)) {
        console.log("Tasks is undefined or not an array.");
        return <div>Loading tasks...</div>;  // or any other placeholder content
    }
    
    return (
        
            <ul className='realDash'> 
                {tasks.map((task) => (
                    <User 
                        key={task._id}
                        id={task._id}
                        task_name={task.task_name}
                        pro_name={task.pro_name}
                        in_charge_name={task.in_charge_name}
                        date={task.date}
                        onDelete={() => onDelete(task._id)}
                    />
                ))}
            </ul>
        
       
          
        
    );
};

export default UsersList;