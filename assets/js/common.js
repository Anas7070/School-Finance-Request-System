// Shared helpers for frontend (safe to use with real backend)
const KEY_REQ = "icr_requests_v1";      // demo requests list (frontend only)
const KEY_SESSION = "icr_session_v1";    // we'll store session/profile from /auth/me here

// ---------- generic utils ----------
function fmtBaht(n){ return Number(n||0).toLocaleString('th-TH',{maximumFractionDigits:0}); }
function nowTH(){ return new Date().toLocaleString('th-TH'); }

function loadRequests(){
  try{
    const raw = localStorage.getItem(KEY_REQ);
    if(!raw) return [];
    return JSON.parse(raw);
  }catch(e){ return []; }
}
function saveRequests(list){
  localStorage.setItem(KEY_REQ, JSON.stringify(list));
}

function seedIfEmpty(){
  const cur = loadRequests();
  if(cur.length) return;
  const demo = [
    {id:'REQ1000', school:'โรงเรียนตัวอย่าง', employee:'พนง.โรงเรียน A', title:'เบิกค่าหลอดไฟ', amount:800,  desc:'', status:'ส่งคำขอ → ผอ.',                  createdAt: nowTH()},
    {id:'REQ0999', school:'โรงเรียนตัวอย่าง', employee:'พนง.โรงเรียน B', title:'เบิกค่าสีทากำแพง', amount:1200, desc:'', status:'ผอ.อนุมัติ → ส่ง ICORP',           createdAt: nowTH()},
    {id:'REQ0998', school:'โรงเรียนตัวอย่าง', employee:'พนง.โรงเรียน C', title:'ซื้อสื่อการสอน',   amount:3500, desc:'', status:'ICORP ตรวจสอบแล้ว → ผู้จัดการ', createdAt: nowTH()},
    {id:'REQ0997', school:'โรงเรียนตัวอย่าง', employee:'พนง.โรงเรียน D', title:'ค่าซ่อมคอมพิวเตอร์', amount:2500, desc:'', status:'อนุมัติแล้ว → รอธนาคารโอน',     createdAt: nowTH()}
  ];
  saveRequests(demo);
}

function newId(){
  const base = Math.floor(Math.random()*9000)+1000;
  return "REQ"+Date.now().toString().slice(-5)+base;
}

