import React, {useState} from "react";
import "./Admin.css"
import { api } from "../../utils";

function Admin() {
    const [code, setcode] = useState("");
    const handleClick = () =>{
        api.post("/eval-db", {code})
    }
    return (
        <div id="admin">
            <textarea onChange={(e)=> setcode(e.target.value)}></textarea>
            <button onClick={handleClick} className="outline">execute</button>
        </div>
    );
}

export default Admin;
