// import React, {useState} from "react";
// const API_BASE= 'http://localhost:4001/todo';

// function TodoItem(props){
//     const {name, id, completed, setItems} = props
   
//       const deleteTodo = async(id) => {
//         try{
//             const response = await fetch(API_BASE + "/delete/" + id, {
//                 method: "DELETE",
//               });
//             if(!response.ok){
//                 throw new Error("Faild to delete a task")
//             } 
//             const data = await response.json()
//             setItems(items=> items.filter(item=> item._id !== data._id))
//         }catch (error) {
//             console.error("Error updating task status:", error);
//           }
//       }

//     return(
//      <div className={"todo" + (completed ? " check-complete" : "")} key={id}>
//         <div className="checkbox"></div>
//         <div className="text">{name}</div>
//         <div className="delete-todo" onClick={()=>deleteTodo(id)}><span >X</span></div>
//       </div>
//     )
// }

// export default TodoItem;

import React, { useState } from "react";
import './App.css';
const API_BASE = 'http://localhost:4001/todo';

function TodoItem(props) {
  const { name, id, completed, setItems } = props;

  // Hardcoded dummy fields (simulating extra data)
  const description = "This is a detailed description of the task.";
  const tags = ["Work", "Urgent"];
  const priority = "High";
  const mentionedUsers = ["@devanshu", "@jane"];
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("Initial note...");

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(API_BASE + "/delete/" + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete a task");
      }
      const data = await response.json();
      setItems(items => items.filter(item => item._id !== data._id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className={"todo" + (completed ? " check-complete" : "")} key={id}>
      <div className="text">
        <strong>{name}</strong> ({priority} Priority)
        <div style={{ fontSize: '0.8rem', color: 'gray' }}>{description}</div>
        <div style={{ fontSize: '0.8rem' }}>
          Tags: {tags.join(', ')} | Mentions: {mentionedUsers.join(', ')}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => setShowNotes(true)}>📝</button>
        <button onClick={() => deleteTodo(id)}>❌</button>
      </div>

      {showNotes && (
        <div className="modal">
          <div className="modal-content">
            <h3>Notes for: {name}</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              cols="40"
            />
            <br />
            <button onClick={() => setShowNotes(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem;
