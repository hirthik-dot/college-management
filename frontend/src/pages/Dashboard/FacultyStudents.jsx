import { useState } from "react";
const demoStudent = {
  name:"Praveen Kumar",
  reg:"CSE123",
  sem:"6",branch:"CSE",email:"pk@college.edu",
  arrears:["CS405 ML Quiz"],
  attendance: "92%",
  gpa: "8.6"
};

export default function FacultyStudents() {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState(demoStudent);

  function handleSearch(e){
    e.preventDefault();
    // Real app: fetch student by search term.
    setStudent(demoStudent);
  }

  return (
    <section style={{
      background:"linear-gradient(135deg,#eefff9 70%,#d0f7ec 100%)",
      borderRadius:"18px",padding:"30px 32px",
      boxShadow:"0 4px 24px #22c55e17",marginBottom:"32px"
    }}>
      <h2 style={{fontWeight:800,fontSize:"1.35rem",color:"#099a49",marginBottom:"16px"}}>Student Records</h2>
      <form style={{display:"flex",gap:"13px",marginBottom:"15px"}} onSubmit={handleSearch}>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name or reg. no." style={{
          flex:1,padding:"12px 18px",fontSize:"1.05rem",borderRadius:"8px",border:"1.2px solid #b4ffe6",background:"#f7faf9"
        }}/>
        <button type="submit" style={{
          padding:"10px 25px",borderRadius:"8px",background:"linear-gradient(90deg,#39d793 80%,#1eec8d 100%)",color:"#fff",fontWeight:700,fontSize:"1.04rem",border:"none",cursor:"pointer"
        }}>Search</button>
      </form>
      {student && (
        <div style={{
          background:"#fff",borderRadius:"10px",boxShadow:"0 2px 10px #099a4910",padding:"17px",marginBottom:"10px"
        }}>
          <div style={{fontWeight:700,fontSize:"1.11rem"}}>{student.name} <span style={{color:"#099a49"}}>({student.reg})</span></div>
          <div>Semester: <b>{student.sem}</b>, Branch: <b>{student.branch}</b>, Email: <b>{student.email}</b></div>
          <div>Attendance: <b style={{color:"#4fd46f"}}>{student.attendance}</b></div>
          <div>GPA: <b style={{color:"#eb7e1e"}}>{student.gpa}</b></div>
          <div style={{margin:"5px 0 0 0"}}>Arrears: <span style={{color:"#fb4d4d",fontWeight:700}}>{student.arrears.join(", ")}</span></div>
          <div style={{marginTop:"10px",display:"flex",gap:"11px"}}>
            <button style={{
              background:"#54d6d6",color:"#344a4e",border:"none",borderRadius:"7px",
              padding:"8px 19px",fontWeight:600,cursor:"pointer"
            }}>Send Reminder</button>
            <button style={{
              background:"#3578fa",color:"#fff",border:"none",borderRadius:"7px",
              padding:"8px 19px",fontWeight:600,cursor:"pointer"
            }}>Export PDF</button>
          </div>
        </div>
      )}
      <div style={{
        background:"#e3fff9",borderRadius:"9px",padding:"13px",fontSize:"0.98rem",color:"#0e8c4c",marginTop:"10px"
      }}>
        <b>Feature:</b> Download marks/arrears report for the whole class (.xlsx)
      </div>
    </section>
  );
}
