/** Tokens visuales tomados de los wireframes de `interfaces ejemplo/`. */
export const adminStyles = `
:host { display:block; }

.adm-layout { display:flex; min-height:100vh; background:#F4F8F7; color:#17312E;
  font-family:Inter,'Segoe UI',system-ui,sans-serif; }

.adm-sidebar { width:236px; flex:0 0 236px; background:#102825; color:#EAF5F2;
  padding:24px 18px; display:flex; flex-direction:column; gap:28px; }
.adm-brand { display:flex; align-items:center; gap:10px; font-size:16px; font-weight:700; }
.adm-brand-logo { width:34px; height:34px; object-fit:contain; flex:0 0 34px;
  filter:brightness(0) invert(1); }
.adm-login-logo { display:block; width:64px; height:64px; object-fit:contain; margin:0 auto 2px; }
.adm-brand small { display:block; font-size:11px; font-weight:500; color:#9CBDB6; }
.adm-nav { display:flex; flex-direction:column; gap:4px; }
.adm-nav-label { font-size:10px; letter-spacing:.12em; text-transform:uppercase;
  color:#7FA69E; margin:6px 10px; }
.adm-nav a { display:flex; align-items:center; gap:10px; padding:11px 12px; border-radius:10px;
  color:#C4DCD6; text-decoration:none; font-size:13px; font-weight:500; transition:.15s; }
.adm-nav a:hover { background:rgba(255,255,255,.07); color:#fff; }
.adm-nav a.activo { background:#167C6C; color:#fff; box-shadow:0 6px 16px rgba(22,124,108,.35); }
.adm-nav a img.icono { width:18px; height:18px; object-fit:contain; opacity:.82; flex:0 0 18px; }
.adm-nav a.activo img.icono { opacity:1; filter:brightness(0) invert(1); }
.adm-nav a span.texto { white-space:nowrap; }
.adm-sidebar-foot { margin-top:auto; border-top:1px solid rgba(255,255,255,.1);
  padding-top:16px; font-size:11px; color:#8FB0A9; }

.adm-main { flex:1; min-width:0; }
.adm-topbar { position:sticky; top:0; z-index:5; display:flex; align-items:center;
  justify-content:space-between; gap:16px; padding:16px 28px; background:rgba(244,248,247,.82);
  backdrop-filter:blur(14px); border-bottom:1px solid #DCE8E5; }
.adm-breadcrumb { font-size:12px; color:#667975; }
.adm-breadcrumb strong { color:#17312E; }
.adm-user { display:flex; align-items:center; gap:10px; font-size:13px; }
.adm-avatar { width:34px; height:34px; border-radius:50%; background:#D9F0EA; color:#167C6C;
  display:grid; place-items:center; font-weight:700; }
.adm-content { padding:28px; display:flex; flex-direction:column; gap:22px; }

.adm-page-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.adm-title { margin:0; font-size:24px; letter-spacing:-.02em; }
.adm-subtitle { margin:6px 0 0; font-size:13px; color:#667975; }

.adm-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:16px; }
.adm-card { background:rgba(255,255,255,.78); backdrop-filter:blur(10px); border:1px solid #DCE8E5;
  border-radius:16px; padding:18px; box-shadow:0 8px 24px rgba(16,40,37,.05); }
.adm-card-head { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.adm-card-title { margin:0 0 4px; font-size:13px; font-weight:600; color:#667975; }
.adm-stat-value { font-size:30px; font-weight:700; letter-spacing:-.03em; }
.adm-stat-icon { width:36px; height:36px; border-radius:10px; display:grid; place-items:center; font-size:17px; }
.adm-stat-icon.mint { background:#D9F0EA; color:#167C6C; }
.adm-stat-icon.blue { background:#E4F0FC; color:#3778C2; }
.adm-stat-icon.amber { background:#FFF1D6; color:#B7791F; }
.adm-stat-icon.red { background:#FCE8EA; color:#C64B52; }
.adm-two { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:16px; }

.adm-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px;
  font-size:11px; font-weight:600; white-space:nowrap; }
.adm-badge.verde { background:#E1F4E9; color:#27865D; }
.adm-badge.azul { background:#E4F0FC; color:#3778C2; }
.adm-badge.amarillo { background:#FFF1D6; color:#B7791F; }
.adm-badge.rojo { background:#FCE8EA; color:#C64B52; }
.adm-badge.gris { background:#EDF2F1; color:#667975; }
.adm-dot { width:9px; height:9px; border-radius:50%; display:inline-block; flex:0 0 9px; }
.adm-dot.verde { background:#27865D; } .adm-dot.azul { background:#3778C2; }
.adm-dot.amarillo { background:#B7791F; } .adm-dot.rojo { background:#C64B52; }

.adm-toolbar { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.adm-input, .adm-select, .adm-textarea { width:100%; padding:10px 12px; border:1px solid #DCE8E5;
  border-radius:10px; background:#fff; font-size:13px; color:#17312E; font-family:inherit; }
.adm-input:focus, .adm-select:focus, .adm-textarea:focus { outline:2px solid #D9F0EA; border-color:#167C6C; }
.adm-textarea { min-height:80px; resize:vertical; }
.adm-toolbar .adm-input { max-width:260px; }
.adm-field { display:flex; flex-direction:column; gap:6px; }
.adm-field label { font-size:12px; font-weight:600; color:#667975; }
.adm-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
.adm-form .completo { grid-column:1/-1; }

.adm-btn { border:0; border-radius:10px; padding:10px 16px; font-size:13px; font-weight:600;
  font-family:inherit; cursor:pointer; transition:.15s; display:inline-flex; align-items:center;
  justify-content:center; gap:7px; }
.adm-btn.primary { background:#167C6C; color:#fff; box-shadow:0 6px 14px rgba(22,124,108,.22); }
.adm-btn.primary:hover { background:#0F6658; }
.adm-btn.ghost { background:#fff; color:#17312E; border:1px solid #DCE8E5; }
.adm-btn.ghost:hover { background:#F4F8F7; }
.adm-btn.danger { background:#FCE8EA; color:#C64B52; }
.adm-btn.small { padding:6px 11px; font-size:12px; border-radius:8px; }
.adm-btn:disabled { opacity:.55; cursor:not-allowed; }

.adm-table-wrap { overflow:auto; border:1px solid #DCE8E5; border-radius:14px; background:#fff; }
.adm-table { width:100%; border-collapse:collapse; font-size:12.5px; }
.adm-table th { text-align:left; padding:12px 14px; background:#F4F8F7; color:#667975;
  font-size:11px; text-transform:uppercase; letter-spacing:.05em; white-space:nowrap; }
.adm-table td { padding:12px 14px; border-top:1px solid #EDF2F1; vertical-align:middle; }
.adm-table tr:hover td { background:#FAFCFB; }
.adm-thumb { width:38px; height:38px; border-radius:10px; object-fit:cover; background:#D9F0EA; }
.adm-acciones { display:flex; gap:6px; }
.adm-vacio { padding:38px; text-align:center; color:#667975; font-size:13px; }
.adm-error { padding:12px 14px; border-radius:10px; background:#FCE8EA; color:#C64B52; font-size:12.5px; }
.adm-aviso { padding:12px 14px; border-radius:10px; background:#E4F0FC; color:#3778C2; font-size:12.5px; }
.adm-link { color:#167C6C; font-weight:600; text-decoration:none; }
.adm-link:hover { text-decoration:underline; }

.adm-overlay { position:fixed; inset:0; z-index:20; background:rgba(16,40,37,.45);
  backdrop-filter:blur(3px); display:grid; place-items:center; padding:20px; }
.adm-modal { width:min(620px,100%); max-height:90vh; overflow:auto; background:#fff;
  border-radius:18px; padding:24px; box-shadow:0 24px 60px rgba(16,40,37,.25); }
.adm-modal h3 { margin:0 0 4px; font-size:18px; }
.adm-modal-foot { display:flex; justify-content:flex-end; gap:10px; margin-top:20px; }
.adm-login { min-height:100vh; display:grid; place-items:center; background:#F4F8F7; padding:20px; }
.adm-login-card { width:min(400px,100%); background:rgba(255,255,255,.85); backdrop-filter:blur(12px);
  border:1px solid #DCE8E5; border-radius:20px; padding:30px; box-shadow:0 18px 50px rgba(16,40,37,.08); }
.adm-login-card h1 { margin:14px 0 4px; font-size:22px; }
.adm-login-card p { margin:0 0 22px; font-size:13px; color:#667975; }
.adm-login-card .adm-field { margin-bottom:14px; }
.adm-login-card .adm-btn { width:100%; margin-top:8px; }
.adm-login-volver { display:block; margin-top:18px; text-align:center; font-size:12px; }
.adm-password { position:relative; }
.adm-password .adm-input { padding-right:76px; }
.adm-password-toggle { position:absolute; right:7px; top:50%; transform:translateY(-50%);
  border:0; background:transparent; color:#167C6C; font-size:12px; font-weight:700;
  font-family:inherit; cursor:pointer; padding:6px 8px; }
.adm-password-toggle:hover { text-decoration:underline; }

@media (max-width:900px) {
  .adm-sidebar { width:210px; flex-basis:210px; padding:18px 12px; gap:16px; }
  .adm-sidebar .adm-nav-label, .adm-sidebar-foot, .adm-brand small { display:none; }
  .adm-brand { font-size:14px; }
  .adm-nav a { padding:10px 8px; font-size:12px; gap:8px; }
  .adm-content { padding:18px; } .adm-form { grid-template-columns:1fr; }
}

@media (max-width:620px) {
  .adm-layout { flex-direction:column; }
  .adm-sidebar { width:100%; flex-basis:auto; padding:12px 14px; gap:10px; }
  .adm-nav { flex-direction:row; flex-wrap:wrap; gap:6px; }
  .adm-nav a { flex:1 1 auto; justify-content:center; padding:8px; }
  .adm-nav a span.texto { white-space:normal; }
  .adm-topbar { padding:12px 16px; }
  .adm-content { padding:16px; }
}
`;
