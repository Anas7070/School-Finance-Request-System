const BACKEND_URL = window.BACKEND_URL || "http://localhost:4000";

// Keep usage-compatible with existing code:
function setSession(sess){
  localStorage.setItem('icr_session_v1', JSON.stringify(sess));
}
function getSession(){
  try{
    return JSON.parse(localStorage.getItem('icr_session_v1') || "null");
  }catch(e){ return null; }
}

// Override login(username, password) -> { ok, msg?, sess? }
async function login(username, password){
  try{
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if(!res.ok){
      const err = await res.json().catch(()=>({error:'Login failed'}));
      return { ok:false, msg: err.error || 'เข้าสู่ระบบไม่สำเร็จ' };
    }
    const data = await res.json();
    localStorage.setItem('jwt_token', data.token);

    // fetch profile (/me) to get role & name
    const meRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer ' + data.token }
    });
    const me = await meRes.json();
    const sess = { username: me.username, name: me.name, role: me.role, loginAt: new Date().toISOString() };
    setSession(sess);
    return { ok:true, sess };
  }catch(e){
    console.error(e);
    return { ok:false, msg:'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์' };
  }
}

// Override requireRole to also verify token (optional basic check)
function requireRole(roleKey){
  const token = localStorage.getItem('jwt_token');
  const sess = getSession();
  if(!token || !sess || sess.role !== roleKey){
    window.location.href = "index.html";
    return null;
  }
  return sess;
}

// Helper for authorized fetch
async function apiFetch(path, options={}){
  const token = localStorage.getItem('jwt_token');
  return fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      'Authorization': token ? ('Bearer ' + token) : undefined
    }
  });
}