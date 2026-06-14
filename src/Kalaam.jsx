import { useState, useRef, useEffect, useCallback } from "react";

// ─── CSS ────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Amiri:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{height:100%;font-family:'Sora',sans-serif;background:#D4CBB8}
.shell{width:100%;max-width:480px;min-height:100vh;margin:0 auto;background:#FAF8F3;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,0.18)}
@media(min-width:768px){body{background:#EDE8DF}.shell{max-width:100%;box-shadow:none}}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(196,146,46,0.2);border-radius:2px}

/* SPLASH */
.splash{background:linear-gradient(155deg,#1A1207 0%,#2E1E0A 55%,#1A1207 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 24px;text-align:center;position:relative;overflow:hidden}
.sp-glow{position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(196,146,46,0.12) 0%,transparent 70%);top:40%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.sp-ic{width:84px;height:84px;background:linear-gradient(135deg,#C4922E,#E8BC5A);border-radius:22px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:40px;color:#1A1207;font-weight:700;box-shadow:0 14px 44px rgba(196,146,46,0.4);margin-bottom:18px;position:relative;z-index:1}
.sp-n{font-size:46px;font-weight:800;color:#FFF;letter-spacing:-2px;line-height:1;margin-bottom:4px;position:relative;z-index:1}
.sp-a{font-family:'Amiri',serif;font-size:28px;color:#E0B055;margin-bottom:6px;position:relative;z-index:1}
.sp-t{font-size:12px;font-weight:300;color:rgba(255,255,255,0.36);letter-spacing:.5px;margin-bottom:40px;position:relative;z-index:1}
.sp-lbl{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#E0B055;font-weight:600;margin-bottom:12px;position:relative;z-index:1;align-self:stretch;text-align:left}
.lg{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;margin-bottom:18px;position:relative;z-index:1}
@media(min-width:500px){.lg{grid-template-columns:repeat(4,1fr)}}
.lo{background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);border-radius:12px;padding:12px 8px;cursor:pointer;text-align:center;transition:all .2s}
.lo.sl{background:rgba(196,146,46,0.15);border-color:rgba(196,146,46,0.5)}
.lo .lof{font-size:22px;display:block;margin-bottom:4px}
.lo .lon{font-size:11px;font-weight:600;color:#fff}
.lo .los{font-size:9px;color:rgba(255,255,255,0.35);margin-top:1px}
.gb{width:100%;background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border:none;border-radius:14px;padding:16px;font-size:15px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;box-shadow:0 8px 28px rgba(196,146,46,0.35);position:relative;z-index:1}

/* TOPBAR */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px 10px;background:#fff;border-bottom:1px solid rgba(26,18,7,0.07);flex-shrink:0}
.tbl{display:flex;align-items:center;gap:8px}
.tbm{width:30px;height:30px;background:linear-gradient(135deg,#C4922E,#E8BC5A);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:15px;color:#1A1207;font-weight:700}
.tbt{font-size:17px;font-weight:800;color:#1A1207;letter-spacing:-.5px}
.tba{font-family:'Amiri',serif;font-size:13px;color:#C4922E;margin-left:2px}
.tbp{background:#FDF4E3;border:1px solid rgba(196,146,46,0.2);border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;color:#C4922E;cursor:pointer}
.tbp.premium{background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border:none}

/* TABS */
.tabs{display:flex;background:#fff;border-bottom:1px solid rgba(26,18,7,0.07);flex-shrink:0;overflow-x:auto;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:1;min-width:60px;padding:8px 2px 7px;text-align:center;font-size:8px;font-weight:700;color:#A0876A;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap}
.tab .ti{font-size:16px;display:block;margin-bottom:2px}
.tab.on{color:#C4922E;border-bottom-color:#C4922E}

/* PANE */
.pane{flex:1;overflow-y:auto;display:flex;flex-direction:column}

/* LEARN */
.lh{padding:20px 16px 16px;background:linear-gradient(135deg,#1A1207,#2E1E0A);flex-shrink:0}
.lh-r{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.lh-g{font-size:19px;font-weight:700;color:#fff;margin-bottom:2px}
.lh-s{font-size:11px;color:rgba(255,255,255,0.36);font-weight:300}
.lh-x{background:rgba(196,146,46,0.2);border:1px solid rgba(196,146,46,0.28);border-radius:20px;padding:4px 11px;font-size:11px;font-weight:700;color:#E0B055}
.prog-bg{background:rgba(255,255,255,0.08);border-radius:3px;height:5px}
.prog-fg{height:5px;background:linear-gradient(to right,#C4922E,#E8BC5A);border-radius:3px;transition:width .5s ease}
.prog-labels{display:flex;justify-content:space-between;margin-top:4px}
.prog-labels span{font-size:9px;color:rgba(255,255,255,0.26)}
.ll{padding:12px 16px 24px;display:flex;flex-direction:column;gap:9px}
.lc{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:14px;padding:14px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .15s}
.lc:hover{border-color:rgba(196,146,46,0.2);box-shadow:0 2px 12px rgba(196,146,46,0.08)}
.li{width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.lif{flex:1;min-width:0}
.lcn{font-size:13px;font-weight:600;color:#1A1207;margin-bottom:2px}
.lcd{font-size:10px;color:#A0876A;font-weight:300}
.badge{font-size:9px;font-weight:700;border-radius:20px;padding:3px 9px;flex-shrink:0;letter-spacing:.3px}
.bd-done{background:#EAF5EF;color:#2A7A4C}
.bd-next{background:#FDF4E3;color:#C4922E}
.bd-new{background:#F2EDE4;color:#A0876A;border:1px solid rgba(26,18,7,0.07)}

/* MODAL */
.ov{position:fixed;inset:0;background:rgba(26,18,7,0.75);z-index:200;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px)}
.mod{background:#FAF8F3;border-radius:22px 22px 0 0;padding:22px 18px 34px;width:100%;max-width:600px;border-top:2px solid #C4922E;max-height:85vh;overflow-y:auto}
.mh{width:32px;height:3px;background:rgba(26,18,7,0.08);border-radius:2px;margin:0 auto 16px}
.mt{font-size:18px;font-weight:700;color:#1A1207;margin-bottom:3px}
.ms{font-size:11px;color:#A0876A;margin-bottom:16px}
.vi{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:10px;padding:12px;margin-bottom:7px}
.vi-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px}
.ve{font-size:12px;font-weight:500;color:#A0876A}
.vi-main{font-family:'Amiri',serif;font-size:26px;color:#1A1207;direction:rtl;text-align:right;line-height:1.4;display:block;margin-bottom:4px}
.vi-main.latin{font-family:'Sora',sans-serif;font-size:16px;direction:ltr;text-align:left;color:#1A1207}
.vi-roman{font-size:11px;color:#A0876A;font-style:italic;margin-bottom:3px}
.vi-en{font-size:12px;color:#6B5535;font-weight:500}
.mcl{width:100%;background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border:none;border-radius:14px;padding:13px;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;margin-top:12px}

/* CHAT */
.cp{display:flex;flex-direction:column;flex:1;overflow:hidden;min-height:0}
.ch{padding:11px 16px;background:#fff;border-bottom:1px solid rgba(26,18,7,0.07);display:flex;align-items:center;gap:10px;flex-shrink:0}
.cav{width:36px;height:36px;background:linear-gradient(135deg,#C4922E,#E8BC5A);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Amiri',serif;font-size:17px;color:#1A1207;font-weight:700;flex-shrink:0}
.cn{font-size:13px;font-weight:700;color:#1A1207}
.cs{font-size:10px;color:#2A7A4C;display:flex;align-items:center;gap:4px;margin-top:1px}
.sd{width:5px;height:5px;background:#2A7A4C;border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.msgs{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;min-height:0}
.bubble-row{display:flex;gap:7px;align-items:flex-end;max-width:88%}
.bubble-row.me{align-self:flex-end;flex-direction:row-reverse}
.bubble-row.ai{align-self:flex-start}
.bav{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;font-family:'Amiri',serif;font-weight:700}
.bav.ai{background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207}
.bav.me{background:#F2EDE4;border:1px solid rgba(26,18,7,0.07);color:#6B5535;font-family:'Sora',sans-serif}
.bub{padding:10px 13px;border-radius:13px;font-size:13px;line-height:1.65}
.bub.ai{background:#fff;border:1px solid rgba(26,18,7,0.07);color:#1A1207;border-bottom-left-radius:3px}
.bub.me{background:linear-gradient(135deg,#1A1207,#2E1E0A);color:rgba(255,255,255,.88);border-bottom-right-radius:3px}
.bscript{display:block;margin-top:8px;padding:8px 10px;border-radius:8px;line-height:1.6;font-size:22px;background:rgba(196,146,46,0.07);border:1px solid rgba(196,146,46,0.15)}
.bscript.ar,.bscript.ur{font-family:'Amiri',serif;font-size:26px;color:#C4922E;direction:rtl;text-align:right}
.bscript.hi,.bscript.bn,.bscript.ne{font-family:'Noto Sans Devanagari',sans-serif;font-size:20px;color:#3B5FC0;direction:ltr}
.bscript.zh{font-size:22px;color:#2A7A4C}
.bscript.fil,.bscript.en{font-size:16px;color:#2A7A4C}
.btip{font-size:11px;color:#A0876A;display:block;margin-top:6px;font-style:italic;padding-top:6px;border-top:1px solid rgba(26,18,7,0.05)}
.typ{display:flex;gap:7px;align-items:flex-end;align-self:flex-start}
.tyb{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:13px;border-bottom-left-radius:3px;padding:11px 14px;display:flex;gap:4px;align-items:center}
.td{width:6px;height:6px;background:#C4922E;border-radius:50%;animation:tda 1.2s infinite}
.td:nth-child(2){animation-delay:.2s}.td:nth-child(3){animation-delay:.4s}
@keyframes tda{0%,60%,100%{transform:translateY(0);opacity:.3}30%{transform:translateY(-5px);opacity:1}}
.qr{padding:8px 12px 6px;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;flex-shrink:0}
.qr::-webkit-scrollbar{display:none}
.qc{background:#FDF4E3;border:1px solid rgba(196,146,46,0.2);border-radius:18px;padding:6px 12px;font-size:11px;font-weight:600;color:#C4922E;white-space:nowrap;cursor:pointer;flex-shrink:0}
.qc:hover{background:#FDEDC0}
.ib{display:flex;gap:7px;padding:9px 12px 13px;background:#fff;border-top:1px solid rgba(26,18,7,0.07);flex-shrink:0;align-items:center}
.ib input{flex:1;background:#F2EDE4;border:1px solid rgba(26,18,7,0.07);border-radius:11px;padding:10px 13px;font-size:13px;color:#1A1207;font-family:'Sora',sans-serif;outline:none;transition:border-color .2s}
.ib input:focus{border-color:rgba(196,146,46,0.4);background:#fff}
.ib input::placeholder{color:#A0876A}
.sndb{width:40px;height:40px;background:linear-gradient(135deg,#C4922E,#E8BC5A);border:none;border-radius:10px;cursor:pointer;font-size:15px;color:#1A1207;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.micb{width:40px;height:40px;background:#F2EDE4;border:1.5px solid rgba(26,18,7,0.07);border-radius:10px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
.micb.rec{background:rgba(220,38,38,.08);border-color:rgba(220,38,38,.3);animation:rp 1s infinite}
@keyframes rp{0%,100%{box-shadow:none}50%{box-shadow:0 0 0 6px rgba(220,38,38,.1)}}
.err-banner{background:#FEF2F2;border:1px solid rgba(220,38,38,.2);border-radius:10px;padding:10px 13px;font-size:12px;color:#dc2626;margin:8px 16px;text-align:center}

/* LIVEBRIDGE */
.lbp{padding:16px;display:flex;flex-direction:column;gap:11px}
.lbh{background:linear-gradient(135deg,#1A1207,#2E1E0A);border-radius:14px;padding:20px;text-align:center;position:relative;overflow:hidden}
.lbh::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#C4922E,#E8BC5A)}
.lbl3{display:inline-flex;align-items:center;gap:5px;background:rgba(42,122,76,.18);border:1px solid rgba(42,122,76,.28);border-radius:20px;padding:3px 10px;margin-bottom:10px;font-size:9px;font-weight:700;color:#4ADE80;letter-spacing:1.5px;text-transform:uppercase}
.lbt{font-size:24px;font-weight:800;color:#E0B055;margin-bottom:4px;letter-spacing:-.5px}
.lbs2{font-size:12px;color:rgba(255,255,255,.38);font-weight:300}
.lsr{display:flex;gap:7px;align-items:center}
.lss{flex:1;background:#fff;border:1px solid rgba(26,18,7,0.08);border-radius:10px;padding:9px 11px;font-size:13px;font-weight:500;color:#1A1207;font-family:'Sora',sans-serif;outline:none;cursor:pointer}
.lsw{width:36px;height:36px;background:#FDF4E3;border:1px solid rgba(196,146,46,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;color:#C4922E;flex-shrink:0}
.lpp{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.lpa{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:14px;padding:12px;min-height:130px;display:flex;flex-direction:column}
.lpl{font-size:8px;text-transform:uppercase;letter-spacing:2px;color:#A0876A;margin-bottom:8px;font-weight:700}
.lta{flex:1;background:transparent;border:none;outline:none;font-family:'Sora',sans-serif;font-size:12px;color:#1A1207;resize:none;line-height:1.6;width:100%}
.lta::placeholder{color:#A0876A;font-style:italic;font-size:11px}
.lro{flex:1;font-size:13px;color:#6B5535;line-height:1.6;min-height:50px;word-break:break-word}
.lro.ar,.lro.ur{font-family:'Amiri',serif;font-size:22px;color:#C4922E;direction:rtl;text-align:right}
.lro.hi,.lro.bn,.lro.ne{font-size:18px;color:#3B5FC0}
.lro.fil,.lro.en,.lro.zh{font-size:14px;color:#1A1207}
.lro.loading{color:#A0876A;font-style:italic;font-size:12px}
.lb-vrow{display:flex;gap:8px}
.lbtn{flex:1;background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border:none;border-radius:14px;padding:13px;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer}
.lbtn:disabled{opacity:.6;cursor:not-allowed}
.lmic{width:46px;background:#F2EDE4;border:1.5px solid rgba(26,18,7,0.07);border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;flex-shrink:0;transition:all .2s}
.lmic.rec{background:rgba(220,38,38,.08);border-color:rgba(220,38,38,.25);animation:rp 1s infinite}
.exc{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:14px;padding:13px}
.exl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#C4922E;font-weight:700;margin-bottom:10px}
.ei{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(26,18,7,0.05);cursor:pointer;gap:8px}
.ei:last-child{border-bottom:none;padding-bottom:0}
.ei:first-of-type{padding-top:0}
.een{font-size:12px;font-weight:600;color:#1A1207}
.etr{font-size:9px;color:#A0876A;margin-top:1px}
.ear{font-family:'Amiri',serif;font-size:17px;color:#C4922E;direction:rtl;flex-shrink:0;max-width:50%;text-align:right}

/* GAMES */
.gmp{padding:16px;display:flex;flex-direction:column;gap:11px}
.gmh{background:linear-gradient(135deg,#1A1207,#2E1E0A);border-radius:14px;padding:18px;position:relative;overflow:hidden}
.gmh::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#C4922E,#E8BC5A)}
.gmt{font-size:22px;font-weight:800;color:#E0B055;margin-bottom:4px}
.gms{font-size:12px;color:rgba(255,255,255,.38)}
.gm-pts{display:inline-flex;align-items:center;gap:6px;background:rgba(196,146,46,.15);border:1px solid rgba(196,146,46,.25);border-radius:20px;padding:4px 12px;font-size:12px;font-weight:700;color:#E0B055;margin-top:10px}
.game-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.gc{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:14px;padding:16px;cursor:pointer;text-align:center;transition:all .15s;position:relative;overflow:hidden}
.gc:hover{border-color:rgba(196,146,46,.2);box-shadow:0 3px 14px rgba(196,146,46,.1)}
.gc.locked{opacity:.55;cursor:not-allowed}
.gc.locked::after{content:'🔒 Premium';position:absolute;top:8px;right:8px;font-size:9px;font-weight:700;background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border-radius:10px;padding:2px 7px}
.gc-ic{font-size:28px;margin-bottom:8px}
.gc-n{font-size:13px;font-weight:700;color:#1A1207;margin-bottom:3px}
.gc-d{font-size:10px;color:#A0876A}
.gc-pts{font-size:10px;font-weight:700;color:#C4922E;margin-top:5px}

/* GAME ACTIVE */
.game-box{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:16px;padding:18px;margin-bottom:11px}
.game-title{font-size:15px;font-weight:700;color:#1A1207;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between}
.game-sub{font-size:11px;color:#A0876A;margin-bottom:16px}
.game-q{font-size:18px;font-weight:700;color:#1A1207;text-align:center;padding:16px;background:#FAF8F3;border-radius:12px;margin-bottom:14px;line-height:1.4}
.game-q.script{font-family:'Amiri',serif;font-size:28px;direction:rtl;color:#C4922E}
.game-q.hn{font-size:22px;color:#3B5FC0}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.opt{padding:11px 8px;border:1.5px solid rgba(26,18,7,0.1);border-radius:11px;font-size:12px;font-weight:600;color:#1A1207;cursor:pointer;text-align:center;transition:all .2s;background:#fff;line-height:1.3}
.opt:hover:not(.correct):not(.wrong):not(.revealed){border-color:rgba(196,146,46,.4);background:#FDF4E3}
.opt.correct{border-color:#2A7A4C;background:#EAF5EF;color:#2A7A4C}
.opt.wrong{border-color:#dc2626;background:#FEF2F2;color:#dc2626}
.opt.revealed{border-color:#2A7A4C;background:#EAF5EF;color:#2A7A4C}
.game-fb{padding:11px 14px;border-radius:10px;font-size:13px;font-weight:600;margin-bottom:10px;text-align:center}
.game-fb.ok{background:#EAF5EF;color:#2A7A4C;border:1px solid rgba(42,122,76,.2)}
.game-fb.bad{background:#FEF2F2;color:#dc2626;border:1px solid rgba(220,38,38,.2)}
.game-progress{display:flex;gap:4px;margin-bottom:12px}
.gp-dot{flex:1;height:5px;border-radius:3px;background:rgba(26,18,7,0.08)}
.gp-dot.done{background:#2A7A4C}
.gp-dot.cur{background:#C4922E}
.game-score-card{background:linear-gradient(135deg,#1A1207,#2E1E0A);border-radius:16px;padding:24px;text-align:center}
.gsc-title{font-size:22px;font-weight:800;color:#E0B055;margin-bottom:4px}
.gsc-score{font-size:48px;font-weight:800;color:#fff;line-height:1;margin-bottom:6px}
.gsc-sub{font-size:13px;color:rgba(255,255,255,.4)}
.gsc-btns{display:flex;gap:8px;margin-top:18px}
.gsc-btn{flex:1;padding:12px;border-radius:12px;font-size:13px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;border:none}
.gsc-btn.pri{background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207}
.gsc-btn.sec{background:rgba(255,255,255,.08);color:#fff}
.fill-input{width:100%;background:#FAF8F3;border:1.5px solid rgba(26,18,7,0.12);border-radius:11px;padding:11px 13px;font-size:14px;color:#1A1207;font-family:'Sora',sans-serif;outline:none;margin-bottom:10px;transition:border-color .2s}
.fill-input:focus{border-color:rgba(196,146,46,.5)}
.match-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.match-col{display:flex;flex-direction:column;gap:7px}
.match-item{padding:10px 13px;border:1.5px solid rgba(26,18,7,0.1);border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;text-align:center;transition:all .2s;background:#fff;min-height:44px;display:flex;align-items:center;justify-content:center;word-break:break-word}
.match-item.selected{border-color:#C4922E;background:#FDF4E3;color:#C4922E}
.match-item.matched{border-color:#2A7A4C;background:#EAF5EF;color:#2A7A4C;cursor:default;opacity:.7}
.match-item.wrong-match{border-color:#dc2626;background:#FEF2F2;animation:shake .3s ease}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.back-btn{width:100%;padding:10px;border-radius:12px;font-size:12px;background:#F2EDE4;color:#6B5535;border:none;cursor:pointer;font-family:'Sora',sans-serif;font-weight:600}

/* PROGRESS */
.pgp{padding:16px;display:flex;flex-direction:column;gap:11px}
.xc{background:linear-gradient(135deg,#1A1207,#2E1E0A);border-radius:14px;padding:20px}
.xr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:13px}
.xl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#E0B055;margin-bottom:4px;font-weight:600}
.xn{font-size:38px;font-weight:800;color:#fff;line-height:1;letter-spacing:-1px}
.xs{font-size:11px;color:rgba(255,255,255,.3);margin-top:3px}
.xlv{background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border-radius:8px;padding:7px 13px;font-size:12px;font-weight:700}
.sr{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
.sc{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:10px;padding:13px 10px;text-align:center}
.sv{font-size:23px;font-weight:800;color:#C4922E;margin-bottom:3px;letter-spacing:-.5px}
.sl2{font-size:8px;text-transform:uppercase;letter-spacing:1.5px;color:#A0876A;font-weight:600}
.ag{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.ac{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:14px;padding:14px;text-align:center}
.ac.on{border-color:rgba(196,146,46,.2);background:#FDF4E3}
.ac.off .ai3{filter:grayscale(1);opacity:.22}
.ac.off .an3{color:#A0876A}
.ai3{font-size:28px;display:block;margin-bottom:6px}
.an3{font-size:12px;font-weight:700;color:#1A1207;margin-bottom:2px}
.ad3{font-size:10px;color:#A0876A}
.lang-prog-row{background:#fff;border:1px solid rgba(26,18,7,0.07);border-radius:12px;padding:13px 14px;display:flex;align-items:center;gap:12px}
.lpr-icon{font-size:20px;flex-shrink:0}
.lpr-info{flex:1}
.lpr-name{font-size:13px;font-weight:600;color:#1A1207;margin-bottom:5px}
.lpr-bar-bg{height:5px;background:rgba(26,18,7,0.07);border-radius:3px}
.lpr-bar-fg{height:5px;background:linear-gradient(to right,#C4922E,#E8BC5A);border-radius:3px}
.lpr-pct{font-size:12px;font-weight:700;color:#C4922E;flex-shrink:0}

/* PREMIUM */
.prem-bg{background:linear-gradient(155deg,#1A1207 0%,#2E1E0A 55%,#1A1207 100%);border-radius:18px;padding:24px;text-align:center;position:relative;overflow:hidden;margin:16px}
.prem-crown{font-size:42px;margin-bottom:10px}
.prem-title{font-size:22px;font-weight:800;color:#E0B055;margin-bottom:5px}
.prem-sub{font-size:13px;color:rgba(255,255,255,.4);margin-bottom:20px;line-height:1.5}
.prem-price{display:flex;align-items:baseline;justify-content:center;gap:4px;margin-bottom:6px}
.prem-amt{font-size:40px;font-weight:800;color:#fff;letter-spacing:-1px}
.prem-mo{font-size:14px;color:rgba(255,255,255,.4)}
.prem-label{font-size:10px;color:#E0B055;margin-bottom:20px;letter-spacing:1px}
.prem-features{text-align:left;margin-bottom:20px}
.pf{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;color:rgba(255,255,255,.8)}
.pf:last-child{border-bottom:none}
.pf-ic{font-size:16px;flex-shrink:0}
.prem-btn{width:100%;background:linear-gradient(135deg,#C4922E,#E8BC5A);color:#1A1207;border:none;border-radius:14px;padding:15px;font-size:15px;font-weight:700;font-family:'Sora',sans-serif;cursor:pointer;box-shadow:0 8px 28px rgba(196,146,46,.3)}
.prem-note{font-size:10px;color:rgba(255,255,255,.25);margin-top:10px}

/* TOAST */
.toast{position:fixed;bottom:76px;left:50%;transform:translateX(-50%);background:rgba(26,18,7,.92);color:#fff;border-radius:20px;padding:9px 18px;font-size:12px;font-weight:500;z-index:300;white-space:nowrap;font-family:'Sora',sans-serif;pointer-events:none;max-width:88vw;text-align:center}
.spin{display:inline-block;width:11px;height:11px;border:2px solid rgba(196,146,46,.3);border-top-color:#C4922E;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:5px}
@keyframes spin{to{transform:rotate(360deg)}}
`;

// ─── LANGUAGE DATA ───────────────────────────────────────────────────────────
const LANGS = [
  {code:"ar", name:"Arabic",   flag:"🇧🇭", script:"العربية",    speechCode:"ar-SA"},
  {code:"en", name:"English",  flag:"🇬🇧", script:"English",    speechCode:"en-US"},
  {code:"hi", name:"Hindi",    flag:"🇮🇳", script:"हिन्दी",      speechCode:"hi-IN"},
  {code:"fil",name:"Filipino", flag:"🇵🇭", script:"Tagalog",    speechCode:"fil-PH"},
  {code:"ur", name:"Urdu",     flag:"🇵🇰", script:"اردو",        speechCode:"ur-PK"},
  {code:"bn", name:"Bengali",  flag:"🇧🇩", script:"বাংলা",       speechCode:"bn-BD"},
  {code:"ne", name:"Nepali",   flag:"🇳🇵", script:"नेपाली",      speechCode:"ne-NP"},
  {code:"zh", name:"Chinese",  flag:"🇨🇳", script:"中文",        speechCode:"zh-CN"},
];
const LANG_NAMES = Object.fromEntries(LANGS.map(l=>[l.code,l.name]));

// ─── LESSON DATA: each vocab item has e=English, n=native script, r=romanization, a=Arabic translation ──
const LESSON_DATA = {
  ar:{
    gr:{t:"التحيات والتعارف",s:"Greetings & Introductions",v:[
      {e:"Hello / Peace be upon you",n:"السلام عليكم",r:"As-salamu alaykum",a:"السلام عليكم"},
      {e:"Good morning",n:"صباح الخير",r:"Sabah al-khayr",a:"صباح الخير"},
      {e:"Good evening",n:"مساء الخير",r:"Masa' al-khayr",a:"مساء الخير"},
      {e:"How are you?",n:"كيف حالك؟",r:"Kayfa halak?",a:"كيف حالك؟"},
      {e:"My name is...",n:"اسمي...",r:"Ismi...",a:"اسمي..."},
      {e:"Nice to meet you",n:"يسعدني لقاءك",r:"Yus'iduni liqa'ak",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"مع السلامة",r:"Ma'a as-salama",a:"مع السلامة"},
    ]},
    lm:{t:"في مكتب LMRA",s:"At the Government Office",v:[
      {e:"I need help",n:"أحتاج مساعدة",r:"Ahtaj musa'ada",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"أين النموذج؟",r:"Ayna an-namudhaj?",a:"أين النموذج؟"},
      {e:"Renew my visa",n:"تجديد التأشيرة",r:"Tajdid at-ta'ashira",a:"تجديد التأشيرة"},
      {e:"Please wait",n:"من فضلك انتظر",r:"Min fadlak intazir",a:"من فضلك انتظر"},
    ]},
    rs:{t:"في المطعم",s:"At the Restaurant",v:[
      {e:"A table for two",n:"طاولة لشخصين",r:"Tawila li-shakhsayn",a:"طاولة لشخصين"},
      {e:"The menu please",n:"القائمة من فضلك",r:"Al-qa'ima min fadlak",a:"القائمة من فضلك"},
      {e:"How much is the bill?",n:"كم الحساب؟",r:"Kam al-hisab?",a:"كم الحساب؟"},
      {e:"Delicious!",n:"لذيذ!",r:"Ladhidh!",a:"لذيذ!"},
    ]},
    nm:{t:"الأرقام",s:"Numbers 1–10",v:[
      {e:"One / Two",n:"واحد / اثنان",r:"Wahid / Ithnan",a:"واحد / اثنان"},
      {e:"Three / Four",n:"ثلاثة / أربعة",r:"Thalatha / Arba'a",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"خمسة / ستة",r:"Khamsa / Sitta",a:"خمسة / ستة"},
      {e:"Seven / Eight",n:"سبعة / ثمانية",r:"Sab'a / Thamaniya",a:"سبعة / ثمانية"},
      {e:"How much?",n:"بكم؟",r:"Bikam?",a:"بكم؟"},
    ]},
    hp:{t:"في المستشفى",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"أحتاج طبيباً",r:"Ahtaj tabiban",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"أشعر بألم",r:"Ash'ur bi-alam",a:"أشعر بألم"},
      {e:"Where is the emergency?",n:"أين الطوارئ؟",r:"Ayna at-tawari'?",a:"أين الطوارئ؟"},
    ]},
    wk:{t:"في بيئة العمل",s:"Workplace Essentials",v:[
      {e:"Good morning sir",n:"صباح الخير سيدي",r:"Sabah al-khayr sayyidi",a:"صباح الخير سيدي"},
      {e:"I don't understand",n:"لا أفهم",r:"La afham",a:"لا أفهم"},
      {e:"Where is the manager?",n:"أين المدير؟",r:"Ayna al-mudir?",a:"أين المدير؟"},
    ]},
  },
  en:{
    gr:{t:"Greetings & Introductions",s:"Essential English phrases",v:[
      {e:"Hello!",n:"Hello! How are you?",r:"Standard greeting",a:"مرحباً! كيف حالك؟"},
      {e:"Good morning",n:"Good morning! Have a great day!",r:"Morning greeting",a:"صباح الخير!"},
      {e:"Nice to meet you",n:"It's a pleasure to meet you.",r:"First meeting",a:"يسعدني لقاءك"},
      {e:"How are you?",n:"I'm doing well, thank you!",r:"Polite inquiry",a:"أنا بخير، شكراً!"},
      {e:"My name is...",n:"My name is [your name].",r:"Introduction",a:"اسمي..."},
      {e:"Goodbye / See you later",n:"Goodbye! Take care.",r:"Farewell",a:"وداعاً! اعتنِ بنفسك"},
    ]},
    lm:{t:"At Government Offices",s:"Official service phrases",v:[
      {e:"I need assistance",n:"Could you help me please?",r:"Polite request",a:"هل يمكنك مساعدتي؟"},
      {e:"Where do I submit this?",n:"Where should I hand this form in?",r:"Document submission",a:"أين أسلّم هذا النموذج؟"},
      {e:"What is the process?",n:"Can you explain the procedure?",r:"Process inquiry",a:"هل يمكنك شرح الإجراءات؟"},
    ]},
    rs:{t:"At the Restaurant",s:"Dining vocabulary",v:[
      {e:"A table for two",n:"A table for two, please.",r:"Reservation",a:"طاولة لشخصين من فضلك"},
      {e:"The menu please",n:"Could we see the menu?",r:"Menu request",a:"القائمة من فضلك"},
      {e:"The bill please",n:"Could we have the bill, please?",r:"Payment request",a:"الحساب من فضلك"},
    ]},
    nm:{t:"Numbers & Shopping",s:"Counting and bargaining",v:[
      {e:"How much does this cost?",n:"How much is this?",r:"Price inquiry",a:"بكم هذا؟"},
      {e:"That's too expensive",n:"That's a bit pricey. Any discount?",r:"Negotiation",a:"هذا غالٍ. هل هناك خصم؟"},
      {e:"I'll take it",n:"I'll take it, thank you.",r:"Purchase",a:"سآخذه، شكراً"},
    ]},
    hp:{t:"At the Hospital",s:"Medical vocabulary",v:[
      {e:"I need a doctor",n:"I need to see a doctor urgently.",r:"Medical emergency",a:"أحتاج طبيباً بشكل عاجل"},
      {e:"I am in pain",n:"I'm experiencing pain here.",r:"Symptom description",a:"أشعر بألم هنا"},
      {e:"Call an ambulance",n:"Please call an ambulance!",r:"Emergency call",a:"اتصل بالإسعاف من فضلك!"},
    ]},
    wk:{t:"Workplace Essentials",s:"Professional English",v:[
      {e:"Good morning everyone",n:"Good morning team!",r:"Team greeting",a:"صباح الخير للجميع!"},
      {e:"Could you clarify?",n:"Could you clarify that point?",r:"Clarification",a:"هل يمكنك توضيح هذه النقطة؟"},
      {e:"I'll send it over",n:"I'll email that to you shortly.",r:"Follow-up",a:"سأرسله إليك قريباً"},
    ]},
  },
  hi:{
    gr:{t:"अभिवादन और परिचय",s:"Greetings in Hindi",v:[
      {e:"Hello / Namaste",n:"नमस्ते",r:"Namaste",a:"مرحباً / تحية"},
      {e:"Good morning",n:"शुभ प्रभात",r:"Shubh prabhat",a:"صباح الخير"},
      {e:"How are you?",n:"आप कैसे हैं?",r:"Aap kaise hain?",a:"كيف حالك؟"},
      {e:"My name is...",n:"मेरा नाम ... है",r:"Mera naam ... hai",a:"اسمي..."},
      {e:"Nice to meet you",n:"आपसे मिलकर खुशी हुई",r:"Aapase milakar khushi hui",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"अलविदा",r:"Alvida",a:"وداعاً"},
    ]},
    lm:{t:"सरकारी कार्यालय में",s:"At Government Office",v:[
      {e:"I need help",n:"मुझे मदद चाहिए",r:"Mujhe madad chahiye",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"फ़ॉर्म कहाँ है?",r:"Form kahan hai?",a:"أين النموذج؟"},
      {e:"Please wait",n:"कृपया प्रतीक्षा करें",r:"Kripaya pratiksha karen",a:"من فضلك انتظر"},
    ]},
    rs:{t:"रेस्तरां में",s:"At the Restaurant",v:[
      {e:"A table for two",n:"दो के लिए मेज",r:"Do ke liye mez",a:"طاولة لشخصين"},
      {e:"The menu please",n:"मेनू लाइए",r:"Menu laiye",a:"القائمة من فضلك"},
      {e:"The bill please",n:"बिल लाइए",r:"Bill laiye",a:"الحساب من فضلك"},
      {e:"Delicious!",n:"बहुत स्वादिष्ट!",r:"Bahut swadisht!",a:"لذيذ!"},
    ]},
    nm:{t:"संख्याएँ",s:"Numbers 1–10 in Hindi",v:[
      {e:"One / Two",n:"एक / दो",r:"Ek / Do",a:"واحد / اثنان"},
      {e:"Three / Four",n:"तीन / चार",r:"Teen / Char",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"पाँच / छह",r:"Panch / Chha",a:"خمسة / ستة"},
      {e:"How much?",n:"कितना?",r:"Kitna?",a:"بكم؟"},
    ]},
    hp:{t:"अस्पताल में",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"मुझे डॉक्टर चाहिए",r:"Mujhe doctor chahiye",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"मुझे दर्द है",r:"Mujhe dard hai",a:"أشعر بألم"},
      {e:"Call an ambulance",n:"एम्बुलेंस बुलाइए",r:"Ambulance bulaiye",a:"اتصل بالإسعاف"},
    ]},
    wk:{t:"कार्यस्थल",s:"Workplace Essentials",v:[
      {e:"Good morning sir",n:"सुप्रभात श्रीमान",r:"Suprabhat shriman",a:"صباح الخير سيدي"},
      {e:"I don't understand",n:"मुझे समझ नहीं आया",r:"Mujhe samajh nahi aaya",a:"لا أفهم"},
      {e:"Where is the manager?",n:"प्रबंधक कहाँ हैं?",r:"Prabandhak kahan hain?",a:"أين المدير؟"},
    ]},
  },
  fil:{
    gr:{t:"Mga Pagbati at Pagpapakilala",s:"Greetings in Filipino",v:[
      {e:"Hello / Hi",n:"Kumusta!",r:"Kumusta",a:"مرحباً!"},
      {e:"Good morning",n:"Magandang umaga",r:"Magandang umaga",a:"صباح الخير"},
      {e:"Good afternoon",n:"Magandang hapon",r:"Magandang hapon",a:"مساء الخير"},
      {e:"How are you?",n:"Kumusta ka?",r:"Kumusta ka?",a:"كيف حالك؟"},
      {e:"My name is...",n:"Ang pangalan ko ay...",r:"Ang pangalan ko ay...",a:"اسمي..."},
      {e:"Nice to meet you",n:"Ikinagagalak kitang makilala",r:"Ikinagagalak",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"Paalam!",r:"Paalam",a:"وداعاً!"},
    ]},
    lm:{t:"Sa Government Office",s:"Government Office Phrases",v:[
      {e:"I need help",n:"Kailangan ko ng tulong",r:"Kailangan ko ng tulong",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"Nasaan ang form?",r:"Nasaan ang form?",a:"أين النموذج؟"},
      {e:"Please wait",n:"Mangyaring maghintay",r:"Mangyaring maghintay",a:"من فضلك انتظر"},
    ]},
    rs:{t:"Sa Restaurant",s:"At the Restaurant",v:[
      {e:"A table for two",n:"Mesa para sa dalawa",r:"Mesa para sa dalawa",a:"طاولة لشخصين"},
      {e:"The menu please",n:"Ang menu nga",r:"Ang menu nga",a:"القائمة من فضلك"},
      {e:"How much?",n:"Magkano?",r:"Magkano?",a:"بكم؟"},
    ]},
    nm:{t:"Mga Numero",s:"Numbers in Filipino",v:[
      {e:"One / Two",n:"Isa / Dalawa",r:"Isa / Dalawa",a:"واحد / اثنان"},
      {e:"Three / Four",n:"Tatlo / Apat",r:"Tatlo / Apat",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"Lima / Anim",r:"Lima / Anim",a:"خمسة / ستة"},
      {e:"How much?",n:"Magkano?",r:"Magkano?",a:"بكم؟"},
    ]},
    hp:{t:"Sa Ospital",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"Kailangan ko ng doktor",r:"Kailangan ko ng doktor",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"Masakit ako",r:"Masakit ako",a:"أشعر بألم"},
      {e:"Call an ambulance",n:"Tumawag ng ambulansya",r:"Tumawag ng ambulansya",a:"اتصل بالإسعاف"},
    ]},
    wk:{t:"Sa Trabaho",s:"Workplace Phrases",v:[
      {e:"Good morning",n:"Magandang umaga po",r:"Magandang umaga po",a:"صباح الخير"},
      {e:"I don't understand",n:"Hindi ko maintindihan",r:"Hindi ko maintindihan",a:"لا أفهم"},
      {e:"Where is the manager?",n:"Nasaan ang manager?",r:"Nasaan ang manager?",a:"أين المدير؟"},
    ]},
  },
  ur:{
    gr:{t:"ملاقات اور تعارف",s:"Greetings in Urdu",v:[
      {e:"Hello / Peace be upon you",n:"السلام علیکم",r:"As-salamu alaykum",a:"السلام عليكم"},
      {e:"Good morning",n:"صبح بخیر",r:"Subah bakhair",a:"صباح الخير"},
      {e:"Good evening",n:"شام بخیر",r:"Sham bakhair",a:"مساء الخير"},
      {e:"How are you?",n:"آپ کیسے ہیں؟",r:"Aap kaise hain?",a:"كيف حالك؟"},
      {e:"My name is...",n:"میرا نام ... ہے",r:"Mera naam ... hai",a:"اسمي..."},
      {e:"Nice to meet you",n:"آپ سے مل کر خوشی ہوئی",r:"Aap se mil ke khushi hui",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"خدا حافظ",r:"Khuda hafiz",a:"وداعاً"},
    ]},
    lm:{t:"سرکاری دفتر میں",s:"At the Government Office",v:[
      {e:"I need help",n:"مجھے مدد چاہیے",r:"Mujhe madad chahiye",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"فارم کہاں ہے؟",r:"Form kahan hai?",a:"أين النموذج؟"},
      {e:"Please wait",n:"براہ کرم انتظار کریں",r:"Barahkaram intezar karain",a:"من فضلك انتظر"},
    ]},
    rs:{t:"ریستوران میں",s:"At the Restaurant",v:[
      {e:"A table for two",n:"دو افراد کے لیے میز",r:"Do afrad ke liye mez",a:"طاولة لشخصين"},
      {e:"The menu please",n:"مینو لائیں",r:"Menu laayein",a:"القائمة من فضلك"},
      {e:"How much is the bill?",n:"بل کتنا ہے؟",r:"Bill kitna hai?",a:"كم الحساب؟"},
      {e:"Delicious!",n:"بہت مزیدار!",r:"Bohat mazedaar!",a:"لذيذ!"},
    ]},
    nm:{t:"گنتی",s:"Numbers in Urdu",v:[
      {e:"One / Two",n:"ایک / دو",r:"Ek / Do",a:"واحد / اثنان"},
      {e:"Three / Four",n:"تین / چار",r:"Teen / Char",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"پانچ / چھ",r:"Paanch / Chha",a:"خمسة / ستة"},
      {e:"How much?",n:"کتنا؟",r:"Kitna?",a:"بكم؟"},
    ]},
    hp:{t:"ہسپتال میں",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"مجھے ڈاکٹر چاہیے",r:"Mujhe doctor chahiye",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"مجھے درد ہے",r:"Mujhe dard hai",a:"أشعر بألم"},
      {e:"Call an ambulance",n:"ایمبولینس بلائیں",r:"Ambulance bulaayein",a:"اتصل بالإسعاف"},
    ]},
    wk:{t:"کام کی جگہ",s:"Workplace Essentials",v:[
      {e:"Good morning sir",n:"صبح بخیر جناب",r:"Subah bakhair janab",a:"صباح الخير سيدي"},
      {e:"I don't understand",n:"مجھے سمجھ نہیں آیا",r:"Mujhe samajh nahi aaya",a:"لا أفهم"},
      {e:"Where is the manager?",n:"منیجر کہاں ہیں؟",r:"Manager kahan hain?",a:"أين المدير؟"},
    ]},
  },
  bn:{
    gr:{t:"শুভেচ্ছা ও পরিচয়",s:"Greetings in Bengali",v:[
      {e:"Hello / Greetings",n:"নমস্কার",r:"Namaskaar",a:"مرحباً / تحية"},
      {e:"Good morning",n:"শুভ সকাল",r:"Shubho shokal",a:"صباح الخير"},
      {e:"How are you?",n:"আপনি কেমন আছেন?",r:"Apni kemon achen?",a:"كيف حالك؟"},
      {e:"My name is...",n:"আমার নাম...",r:"Amar naam...",a:"اسمي..."},
      {e:"Nice to meet you",n:"আপনার সাথে পরিচিত হয়ে ভালো লাগল",r:"Apnar shathe porichito hoye bhalo laglo",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"বিদায়",r:"Biday",a:"وداعاً"},
    ]},
    lm:{t:"সরকারি অফিসে",s:"At the Government Office",v:[
      {e:"I need help",n:"আমার সাহায্য দরকার",r:"Amar sahajjo dorkar",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"ফর্ম কোথায়?",r:"Form kothay?",a:"أين النموذج؟"},
      {e:"Please wait",n:"অনুগ্রহ করে অপেক্ষা করুন",r:"Onugroho kore opekkha korun",a:"من فضلك انتظر"},
    ]},
    rs:{t:"রেস্তোরাঁয়",s:"At the Restaurant",v:[
      {e:"A table for two",n:"দুজনের জন্য টেবিল",r:"Dujoner jonno table",a:"طاولة لشخصين"},
      {e:"The menu please",n:"মেনু দিন",r:"Menu din",a:"القائمة من فضلك"},
      {e:"How much?",n:"কত?",r:"Koto?",a:"بكم؟"},
    ]},
    nm:{t:"সংখ্যা",s:"Numbers in Bengali",v:[
      {e:"One / Two",n:"এক / দুই",r:"Ek / Dui",a:"واحد / اثنان"},
      {e:"Three / Four",n:"তিন / চার",r:"Teen / Char",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"পাঁচ / ছয়",r:"Panch / Chhoy",a:"خمسة / ستة"},
      {e:"How much?",n:"কত?",r:"Koto?",a:"بكم؟"},
    ]},
    hp:{t:"হাসপাতালে",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"আমার ডাক্তার দরকার",r:"Amar doctor dorkar",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"আমি ব্যথায় আছি",r:"Ami byatha-y achi",a:"أشعر بألم"},
      {e:"Call an ambulance",n:"অ্যাম্বুলেন্স ডাকুন",r:"Ambulance dakun",a:"اتصل بالإسعاف"},
    ]},
    wk:{t:"কর্মক্ষেত্র",s:"Workplace Essentials",v:[
      {e:"Good morning sir",n:"শুভ সকাল স্যার",r:"Shubho shokal sir",a:"صباح الخير سيدي"},
      {e:"I don't understand",n:"আমি বুঝতে পারছি না",r:"Ami bujhte parchi na",a:"لا أفهم"},
      {e:"Where is the manager?",n:"ম্যানেজার কোথায়?",r:"Manager kothay?",a:"أين المدير؟"},
    ]},
  },
  ne:{
    gr:{t:"अभिवादन र परिचय",s:"Greetings in Nepali",v:[
      {e:"Hello / Namaste",n:"नमस्ते",r:"Namaste",a:"مرحباً / تحية"},
      {e:"Good morning",n:"शुभ प्रभात",r:"Shubha prabhat",a:"صباح الخير"},
      {e:"How are you?",n:"तपाईं कस्तो हुनुहुन्छ?",r:"Tapain kasto hunuhuncha?",a:"كيف حالك؟"},
      {e:"My name is...",n:"मेरो नाम ... हो",r:"Mero naam ... ho",a:"اسمي..."},
      {e:"Nice to meet you",n:"तपाईंलाई भेट्दा खुशी लाग्यो",r:"Tapailai bhetda khushi lagyo",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"बिदाइ",r:"Bidai",a:"وداعاً"},
    ]},
    lm:{t:"सरकारी कार्यालयमा",s:"At the Government Office",v:[
      {e:"I need help",n:"मलाई सहायता चाहिन्छ",r:"Malai sahayata chahincha",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"फारम कहाँ छ?",r:"Pharam kaha chha?",a:"أين النموذج؟"},
      {e:"Please wait",n:"कृपया पर्खनुहोस्",r:"Kripaya parkhanuhosa",a:"من فضلك انتظر"},
    ]},
    rs:{t:"रेस्टुराँमा",s:"At the Restaurant",v:[
      {e:"A table for two",n:"दुई जनाको लागि टेबुल",r:"Dui janako laagi table",a:"طاولة لشخصين"},
      {e:"The menu please",n:"मेनु दिनुहोस्",r:"Menu dinuhosa",a:"القائمة من فضلك"},
      {e:"How much?",n:"कति?",r:"Kati?",a:"بكم؟"},
    ]},
    nm:{t:"संख्याहरू",s:"Numbers in Nepali",v:[
      {e:"One / Two",n:"एक / दुई",r:"Ek / Dui",a:"واحد / اثنان"},
      {e:"Three / Four",n:"तीन / चार",r:"Teen / Char",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"पाँच / छ",r:"Panch / Chhha",a:"خمسة / ستة"},
      {e:"How much?",n:"कति?",r:"Kati?",a:"بكم؟"},
    ]},
    hp:{t:"अस्पतालमा",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"मलाई डाक्टर चाहिन्छ",r:"Malai doctor chahincha",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"मलाई दुखाइ छ",r:"Malai dukhai chha",a:"أشعر بألم"},
      {e:"Call an ambulance",n:"एम्बुलेन्स बोलाउनुस्",r:"Ambulance bolaunusa",a:"اتصل بالإسعاف"},
    ]},
    wk:{t:"कार्यस्थलमा",s:"Workplace Essentials",v:[
      {e:"Good morning sir",n:"शुभ प्रभात सर",r:"Shubha prabhat sir",a:"صباح الخير سيدي"},
      {e:"I don't understand",n:"मलाई बुझिएन",r:"Malai bujhiena",a:"لا أفهم"},
      {e:"Where is the manager?",n:"म्यानेजर कहाँ छन्?",r:"Manager kahan chhan?",a:"أين المدير؟"},
    ]},
  },
  zh:{
    gr:{t:"问候与介绍",s:"Greetings in Chinese",v:[
      {e:"Hello",n:"你好",r:"Nǐ hǎo",a:"مرحباً"},
      {e:"Good morning",n:"早上好",r:"Zǎoshang hǎo",a:"صباح الخير"},
      {e:"Good evening",n:"晚上好",r:"Wǎnshang hǎo",a:"مساء الخير"},
      {e:"How are you?",n:"你好吗？",r:"Nǐ hǎo ma?",a:"كيف حالك؟"},
      {e:"My name is...",n:"我叫...",r:"Wǒ jiào...",a:"اسمي..."},
      {e:"Nice to meet you",n:"很高兴认识你",r:"Hěn gāoxìng rènshi nǐ",a:"يسعدني لقاءك"},
      {e:"Goodbye",n:"再见",r:"Zàijiàn",a:"وداعاً"},
    ]},
    lm:{t:"政府办公室",s:"At the Government Office",v:[
      {e:"I need help",n:"我需要帮助",r:"Wǒ xūyào bāngzhù",a:"أحتاج مساعدة"},
      {e:"Where is the form?",n:"表格在哪里？",r:"Biǎogé zài nǎlǐ?",a:"أين النموذج؟"},
      {e:"Please wait",n:"请稍等",r:"Qǐng shāo děng",a:"من فضلك انتظر"},
    ]},
    rs:{t:"在餐厅",s:"At the Restaurant",v:[
      {e:"A table for two",n:"两位",r:"Liǎng wèi",a:"طاولة لشخصين"},
      {e:"The menu please",n:"请给我菜单",r:"Qǐng gěi wǒ càidān",a:"القائمة من فضلك"},
      {e:"How much?",n:"多少钱？",r:"Duōshao qián?",a:"بكم؟"},
      {e:"Delicious!",n:"好吃！",r:"Hǎochī!",a:"لذيذ!"},
    ]},
    nm:{t:"数字",s:"Numbers in Chinese",v:[
      {e:"One / Two",n:"一 / 二",r:"Yī / Èr",a:"واحد / اثنان"},
      {e:"Three / Four",n:"三 / 四",r:"Sān / Sì",a:"ثلاثة / أربعة"},
      {e:"Five / Six",n:"五 / 六",r:"Wǔ / Liù",a:"خمسة / ستة"},
      {e:"How much?",n:"多少？",r:"Duōshao?",a:"بكم؟"},
    ]},
    hp:{t:"在医院",s:"At the Hospital",v:[
      {e:"I need a doctor",n:"我需要医生",r:"Wǒ xūyào yīshēng",a:"أحتاج طبيباً"},
      {e:"I am in pain",n:"我很痛",r:"Wǒ hěn tòng",a:"أشعر بألم"},
      {e:"Call an ambulance",n:"叫救护车",r:"Jiào jiùhù chē",a:"اتصل بالإسعاف"},
    ]},
    wk:{t:"职场用语",s:"Workplace Essentials",v:[
      {e:"Good morning",n:"早上好",r:"Zǎoshang hǎo",a:"صباح الخير"},
      {e:"I don't understand",n:"我不明白",r:"Wǒ bù míngbái",a:"لا أفهم"},
      {e:"Where is the manager?",n:"经理在哪里？",r:"Jīnglǐ zài nǎlǐ?",a:"أين المدير؟"},
    ]},
  },
};

const isRTLLang = (code) => ["ar","ur"].includes(code);
const isDevanagari = (code) => ["hi","ne"].includes(code);
const isCJK = (code) => code === "zh";

// ─── OPENROUTER API ──────────────────────────────────────────────────────────
const OPENROUTER_API_KEY = "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";

// Try the auto free-router first, then fall back to specific free models
// if one is temporarily rate-limited/unavailable upstream.
const OPENROUTER_MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "deepseek/deepseek-chat-v3.1:free",
  "qwen/qwen3-30b-a3b:free",
  "google/gemini-2.0-flash-exp:free",
];

async function callClaude(system, userMsg, maxTokens=600) {
  for (let i = 0; i < OPENROUTER_MODELS.length; i++) {
    const model = OPENROUTER_MODELS[i];
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://kalaam.app",
          "X-Title": "Kalaam",
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages: [
            { role: "system", content: system },
            { role: "user", content: userMsg }
          ]
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`API error (${model}):`, res.status, errText);
        if (res.status === 429 || res.status === 404 || res.status === 503) {
          continue;
        }
        return null;
      }

      const d = await res.json();
      const text = d.choices?.[0]?.message?.content?.trim();
      if (text) return text;
      continue;
    } catch (e) {
      console.error(`Fetch error (${model}):`, e);
      continue;
    }
  }
  return null;
}

// ─── TRANSLATION (LiveBridge) ─────────────────────────────────────────────────
async function translateText(text, from, to) {
  const fromName = LANG_NAMES[from] || from;
  const toName   = LANG_NAMES[to]   || to;

  const scriptRules = {
    ar: "Output MUST be in Arabic script (Unicode Arabic characters like ع ا ل ب ر). No romanization.",
    ur: "Output MUST be in Urdu/Nastaliq Arabic script (Unicode like ا ب پ ت). No romanization.",
    hi: "Output MUST be in Devanagari script (like नमस्ते धन्यवाद). No romanization.",
    bn: "Output MUST be in Bengali script (like ধন্যবাদ নমস্কার). No romanization.",
    ne: "Output MUST be in Devanagari/Nepali script (like नमस्ते धन्यवाद). No romanization.",
    zh: "Output MUST be in Simplified Chinese characters (like 你好 谢谢). No pinyin.",
    fil: "Output MUST be in natural Filipino/Tagalog text using standard spelling.",
    en: "Output MUST be in clear natural English.",
  };

  const rule = scriptRules[to] || `Output in ${toName} language.`;

  const system = `You are a professional translator specializing in all 8 languages used in Bahrain: Arabic, English, Hindi, Filipino, Urdu, Bengali, Nepali, Chinese.
Translate the given text from ${fromName} to ${toName}.
${rule}
CRITICAL RULES:
- Return ONLY the translated text. Nothing else.
- No labels, no explanations, no quotes, no extra punctuation.
- No phrases like "Translation:" or "In Arabic:".
- If the input is a greeting, translate it naturally as a greeting.
- Keep the translation natural and culturally appropriate for Bahrain.`;

  const result = await callClaude(system, text, 400);
  if (!result) return null;

  // Strip common artifacts some models add despite instructions
  let cleaned = result.trim();
  cleaned = cleaned.replace(/^(translation|in \w+|output)\s*:\s*/i, "");
  cleaned = cleaned.replace(/^["'「『]+|["'」』]+$/g, "");
  return cleaned.trim();
}

// ─── AI TUTOR CHAT ────────────────────────────────────────────────────────────
async function chatWithTutor(msg, langCode, langName) {
  const scriptRules = {
    ar: "When showing Arabic phrases, use proper Arabic Unicode script ONLY (e.g. مرحباً شكراً كيف حالك). Never romanize in the script field.",
    ur: "When showing Urdu phrases, use Nastaliq/Arabic Unicode script ONLY (e.g. شکریہ ہیلو). Never romanize in the script field.",
    hi: "When showing Hindi phrases, use Devanagari Unicode ONLY (e.g. नमस्ते धन्यवाद). Never romanize in the script field.",
    bn: "When showing Bengali phrases, use Bengali Unicode ONLY (e.g. ধন্যবাদ নমস্কার). Never romanize in the script field.",
    ne: "When showing Nepali phrases, use Devanagari Unicode ONLY (e.g. नमस्ते धन्यवाद). Never romanize in the script field.",
    zh: "When showing Chinese phrases, use Simplified Chinese characters ONLY (e.g. 你好 谢谢). Never use pinyin in the script field.",
    fil: "When showing Filipino phrases, use standard Filipino/Tagalog spelling.",
    en: "When showing English phrases, use clear natural English.",
  };

  const rule = scriptRules[langCode] || "";

  const system = `You are Kalaam AI, a warm and encouraging language tutor helping people living and working in Bahrain learn ${langName}.
You are expert in: Arabic, English, Hindi, Filipino, Urdu, Bengali, Nepali, Chinese.
Script rule: ${rule}
IMPORTANT: You must respond with ONLY valid JSON (no markdown, no backticks, no extra text before or after).
Respond with this exact JSON structure:
{"text":"Your friendly 1-2 sentence English explanation or teaching","script":"A key phrase or word in ${langName} native script","scriptType":"${langCode}","tip":"One practical tip for life/work in Bahrain"}`;

  const raw = await callClaude(system, msg, 500);
  if (!raw) return null;

  // Clean up any markdown wrappers
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

  // Find JSON object
  const start = cleaned.indexOf("{");
  const end   = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (e) {
      console.error("JSON parse error:", e, "Raw:", raw);
    }
  }

  // Fallback: model returned plain text instead of JSON — still show it
  return { text: cleaned, script: null, scriptType: langCode, tip: null };
}

// ─── TOAST HOOK ──────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState("");
  const t = useRef(null);
  const show = useCallback((msg, ms = 3000) => {
    setToast(msg);
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast(""), ms);
  }, []);
  return [toast, show];
}

// ─── MIC HOOK ────────────────────────────────────────────────────────────────
function useMic(langCode, onResult, showToast) {
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  const startRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast("🎤 Voice recognition isn't supported in this browser — try Chrome"); return; }

    const r = new SR();
    ref.current = r;
    const lang = LANGS.find(l => l.code === langCode);
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;
    r.lang = lang?.speechCode || "en-US";

    let finalTranscript = "";
    let gotResult = false;

    r.onstart = () => { setActive(true); showToast(`🎤 Listening in ${lang?.name || "English"}… speak now`); };

    r.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += transcript;
        else interim += transcript;
      }
      const t = (finalTranscript || interim).trim();
      if (t) {
        gotResult = true;
        if (finalTranscript.trim()) {
          showToast(`✓ Heard: "${finalTranscript.trim()}"`);
          onResult(finalTranscript.trim());
        }
      }
    };

    r.onerror = e => {
      setActive(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        showToast("❌ Mic permission denied — allow microphone access in your browser/site settings");
      } else if (e.error === "no-speech") {
        showToast("💬 No speech detected — tap the mic and try again");
      } else if (e.error === "audio-capture") {
        showToast("❌ No microphone found on this device");
      } else if (e.error === "network") {
        showToast("❌ Network error — voice recognition needs an internet connection");
      } else if (e.error === "aborted") {
        // user stopped it manually, no message needed
      } else {
        showToast("❌ Mic error: " + e.error);
      }
    };

    r.onend = () => {
      setActive(false);
      if (!gotResult) {
        // no-op; onerror usually fires with "no-speech" in this case
      }
    };

    try {
      r.start();
    } catch (err) {
      showToast("❌ Could not start microphone — try again");
      setActive(false);
    }
  }, [langCode, onResult, showToast]);

  const toggle = useCallback(() => {
    // Stop if already listening
    if (active) {
      ref.current?.abort();
      setActive(false);
      return;
    }

    // Must be a secure context (HTTPS or localhost) for mic access
    if (typeof window !== "undefined" && !window.isSecureContext) {
      showToast("❌ Voice input requires a secure (HTTPS) connection");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast("🎤 Voice recognition isn't supported in this browser — try Chrome"); return; }

    // Explicitly request mic permission first so SpeechRecognition doesn't
    // fail silently on phones where permission was never prompted.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Release the stream immediately — SpeechRecognition manages its own mic access,
          // we only needed this to trigger/confirm the permission prompt.
          stream.getTracks().forEach(track => track.stop());
          startRecognition();
        })
        .catch(err => {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            showToast("❌ Mic permission denied — allow microphone access in your browser/site settings");
          } else if (err.name === "NotFoundError") {
            showToast("❌ No microphone found on this device");
          } else {
            // Some browsers (e.g. older iOS Safari) may throw on getUserMedia
            // even though SpeechRecognition itself would work — fall back.
            startRecognition();
          }
        });
    } else {
      // getUserMedia unavailable — try SpeechRecognition directly
      startRecognition();
    }
  }, [active, startRecognition, showToast]);

  return [active, toggle];
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
export default function Kalaam() {
  const [screen,   setScreen]   = useState("splash");
  const [selLang,  setSelLang]  = useState(LANGS[0]);
  const [tab,      setTab]      = useState("learn");
  const [modal,    setModal]    = useState(null);
  const [showPrem, setShowPrem] = useState(false);
  const [isPremium,setIsPremium]= useState(false);
  const [toast,    showToast]   = useToast();
  const [xp,       setXp]       = useState(120);
  const [streak]                = useState(3);
  const [lessonsD, setLessonsD] = useState(1);
  const [gamesP,   setGamesP]   = useState(0);
  const addXp = useCallback(n => setXp(p => p + n), []);

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        {screen === "splash"
          ? <Splash selLang={selLang} setSelLang={setSelLang} onLaunch={() => setScreen("app")} />
          : <AppShell
              selLang={selLang} tab={tab} setTab={setTab}
              modal={modal}
              setModal={m => {
                setModal(m);
                if (m) { setLessonsD(p => p + 1); addXp(10); }
              }}
              showPrem={showPrem} setShowPrem={setShowPrem}
              isPremium={isPremium} setIsPremium={setIsPremium}
              showToast={showToast} xp={xp} streak={streak}
              lessonsD={lessonsD} gamesP={gamesP} setGamesP={setGamesP} addXp={addXp}
            />
        }
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ─── SPLASH ──────────────────────────────────────────────────────────────────
function Splash({ selLang, setSelLang, onLaunch }) {
  return (
    <div className="splash">
      <div className="sp-glow" />
      <div className="sp-ic">ك</div>
      <div className="sp-n">Kalaam</div>
      <div className="sp-a">كلام</div>
      <div className="sp-t">Speak the Language of Opportunity in Bahrain</div>
      <div className="sp-lbl">Choose your language to learn</div>
      <div className="lg">
        {LANGS.map(l => (
          <div key={l.code} className={`lo${selLang.code === l.code ? " sl" : ""}`} onClick={() => setSelLang(l)}>
            <span className="lof">{l.flag}</span>
            <div className="lon">{l.name}</div>
            <div className="los">{l.script}</div>
          </div>
        ))}
      </div>
      <button className="gb" onClick={onLaunch}>Start Learning Free →</button>
    </div>
  );
}

// ─── APP SHELL ───────────────────────────────────────────────────────────────
function AppShell({ selLang, tab, setTab, modal, setModal, showPrem, setShowPrem, isPremium, setIsPremium, showToast, xp, streak, lessonsD, gamesP, setGamesP, addXp }) {
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning! 👋" : h < 18 ? "Good afternoon! 👋" : "Good evening! 👋";
  const tabs = [
    { id: "learn", icon: "📚", label: "Learn" },
    { id: "chat",  icon: "🤖", label: "AI Tutor" },
    { id: "lb",    icon: "🌐", label: "Bridge" },
    { id: "games", icon: "🎮", label: "Games" },
    { id: "pg",    icon: "🏅", label: "Progress" },
  ];
  return (
    <>
      <div className="topbar">
        <div className="tbl">
          <div className="tbm">ك</div>
          <span className="tbt">Kalaam</span>
          <span className="tba">كلام</span>
        </div>
        <div className={`tbp${isPremium ? " premium" : ""}`} onClick={() => !isPremium && setShowPrem(true)}>
          {isPremium ? "⭐ Premium" : selLang.flag + " " + selLang.name}
        </div>
      </div>
      <div className="tabs">
        {tabs.map(t => (
          <div key={t.id} className={`tab${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
            <span className="ti">{t.icon}</span>{t.label}
          </div>
        ))}
      </div>
      {tab === "learn"  && <LearnPane  greet={greet} selLang={selLang} setModal={setModal} />}
      {tab === "chat"   && <ChatPane   selLang={selLang} showToast={showToast} />}
      {tab === "lb"     && <LiveBridge selLang={selLang} showToast={showToast} />}
      {tab === "games"  && <GamesPane  selLang={selLang} showToast={showToast} isPremium={isPremium} setShowPrem={setShowPrem} addXp={addXp} gamesP={gamesP} setGamesP={setGamesP} />}
      {tab === "pg"     && <ProgressPane xp={xp} streak={streak} lessonsD={lessonsD} gamesP={gamesP} />}

      {modal && (
        <div className="ov" onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="mod">
            <div className="mh" />
            <div className="mt">{modal.t}</div>
            <div className="ms">{modal.s} · Tap a card to study</div>
            {modal.v.map((v, i) => {
              const isRTL = isRTLLang(modal.code);
              const isDev = isDevanagari(modal.code);
              const isChinese = isCJK(modal.code);
              const isLatin = ["fil","en"].includes(modal.code);
              return (
                <div key={i} className="vi">
                  <div className="vi-top">
                    <div className="ve">🇬🇧 {v.e}</div>
                    <div style={{fontSize:11,color:"#2A7A4C",fontWeight:600,flexShrink:0}}>
                      🇧🇭 {v.a}
                    </div>
                  </div>
                  <div className={`vi-main${isLatin ? " latin" : ""}`}
                    style={isRTL ? {fontFamily:"'Amiri',serif",fontSize:26,color:"#1A1207",direction:"rtl",textAlign:"right"} :
                           isDev ? {fontSize:20,color:"#1A1207"} :
                           isChinese ? {fontSize:24,color:"#1A1207"} :
                           {fontSize:15,color:"#1A1207"}}>
                    {v.n}
                  </div>
                  <div className="vi-roman">{v.r}</div>
                </div>
              );
            })}
            <button className="mcl" onClick={() => setModal(null)}>✓ Got it — back to lessons</button>
          </div>
        </div>
      )}
      {showPrem && <PremiumModal onClose={() => setShowPrem(false)} onSubscribe={() => { setIsPremium(true); setShowPrem(false); }} showToast={showToast} />}
    </>
  );
}

// ─── LEARN ───────────────────────────────────────────────────────────────────
function LearnPane({ greet, selLang, setModal }) {
  const ld = LESSON_DATA[selLang.code] || LESSON_DATA.ar;
  const cards = [
    { id: "gr", icon: "👋", bg: "#FDF4E3", badge: "✓ Done",  bc: "bd-done" },
    { id: "lm", icon: "🏢", bg: "#EDF2FB", badge: "▶ Next",  bc: "bd-next" },
    { id: "rs", icon: "🍽️", bg: "#EAF5EF", badge: "New",     bc: "bd-new"  },
    { id: "nm", icon: "🔢", bg: "#F2EDFC", badge: "New",     bc: "bd-new"  },
    { id: "hp", icon: "🏥", bg: "#FDF4E3", badge: "New",     bc: "bd-new"  },
    { id: "wk", icon: "💼", bg: "#EDF2FB", badge: "New",     bc: "bd-new"  },
  ];
  return (
    <div className="pane">
      <div className="lh">
        <div className="lh-r">
          <div>
            <div className="lh-g">{greet}</div>
            <div className="lh-s">Studying {selLang.name} {selLang.flag} · Arabic included</div>
          </div>
          <div className="lh-x">⭐ 120 XP</div>
        </div>
        <div className="prog-bg"><div className="prog-fg" style={{ width: "24%" }} /></div>
        <div className="prog-labels"><span>Beginner</span><span>Intermediate →</span></div>
      </div>
      <div className="ll">
        {cards.map(c => {
          const lesson = ld[c.id];
          if (!lesson) return null;
          return (
            <div key={c.id} className="lc" onClick={() => setModal({ ...lesson, code: selLang.code })}>
              <div className="li" style={{ background: c.bg }}>{c.icon}</div>
              <div className="lif">
                <div className="lcn">{lesson.t}</div>
                <div className="lcd">{lesson.s} · 🇧🇭 Arabic included</div>
              </div>
              <div className={`badge ${c.bc}`}>{c.badge}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CHAT ────────────────────────────────────────────────────────────────────
function ChatPane({ selLang, showToast }) {
  const initMsg = {
    ai: true,
    text: `مرحباً! I'm your Kalaam AI tutor. I'll help you learn ${selLang.name}! Ask me anything — vocabulary, phrases, grammar, or just practise a conversation. 🇧🇭`,
    script: null,
    scriptType: null,
    tip: "Type a question or tap a suggestion below."
  };
  const [msgs,    setMsgs]   = useState([initMsg]);
  const [input,   setInput]  = useState("");
  const [loading, setLoading]= useState(false);
  const [apiErr,  setApiErr] = useState(false);
  const msgsRef = useRef(null);

  // Reset chat when language changes
  useEffect(() => {
    setMsgs([{
      ...initMsg,
      text: `مرحباً! I'm your Kalaam AI tutor. Ask me anything about ${selLang.name} — vocabulary, phrases, or everyday conversation. 🇧🇭`
    }]);
    setApiErr(false);
  }, [selLang.code]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, loading]);

  const send = useCallback(async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput("");
    setApiErr(false);
    setMsgs(m => [...m, { ai: false, text: t }]);
    setLoading(true);

    const r = await chatWithTutor(t, selLang.code, selLang.name);
    setLoading(false);

    if (r && r.text) {
      setMsgs(m => [...m, { ai: true, text: r.text, script: r.script || null, scriptType: r.scriptType || selLang.code, tip: r.tip || null }]);
    } else {
      setApiErr(true);
      setMsgs(m => [...m, {
        ai: true,
        text: `I encountered a connection issue. Please check your internet and try again. I'm here to help you learn ${selLang.name}! 🌟`,
        script: null, scriptType: null, tip: null
      }]);
    }
  }, [input, selLang, loading]);

  const [micActive, toggleMic] = useMic(selLang.code, t => send(t), showToast);

  const suggestions = [
    `Teach me hello in ${selLang.name}`,
    `How do I say thank you in ${selLang.name}?`,
    `Numbers 1-5 in ${selLang.name}`,
    `How to order food in ${selLang.name}`,
    `Common words for work in ${selLang.name}`,
    `How to introduce myself in ${selLang.name}`,
  ];

  return (
    <div className="cp">
      <div className="ch">
        <div className="cav">ك</div>
        <div>
          <div className="cn">Kalaam AI · {selLang.flag} {selLang.name} Tutor</div>
          <div className="cs"><div className="sd" />Online · Ready to teach</div>
        </div>
      </div>
      {apiErr && <div className="err-banner">⚠️ Connection issue — check internet & try again</div>}
      <div className="msgs" ref={msgsRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`bubble-row ${m.ai ? "ai" : "me"}`}>
            <div className={`bav ${m.ai ? "ai" : "me"}`}>{m.ai ? "ك" : "👤"}</div>
            <div className={`bub ${m.ai ? "ai" : "me"}`}>
              {m.text}
              {m.script && (
                <span className={`bscript ${m.scriptType || selLang.code}`}>{m.script}</span>
              )}
              {m.tip && <span className="btip">💡 {m.tip}</span>}
            </div>
          </div>
        ))}
        {loading && (
          <div className="typ">
            <div className="bav ai">ك</div>
            <div className="tyb"><div className="td" /><div className="td" /><div className="td" /></div>
          </div>
        )}
      </div>
      <div className="qr">
        {suggestions.map((s, i) => (
          <div key={i} className="qc" onClick={() => !loading && send(s)}>{s}</div>
        ))}
      </div>
      <div className="ib">
        <button className={`micb${micActive ? " rec" : ""}`} onClick={toggleMic}>{micActive ? "⏹" : "🎤"}</button>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={`Ask about ${selLang.name}…`}
          disabled={loading} />
        <button className="sndb" onClick={() => send()} disabled={loading}>➤</button>
      </div>
    </div>
  );
}

// ─── LIVEBRIDGE ──────────────────────────────────────────────────────────────
function LiveBridge({ selLang, showToast }) {
  const [from,   setFrom]   = useState("en");
  const [to,     setTo]     = useState(selLang.code !== "en" ? selLang.code : "ar");
  const [inp,    setInp]    = useState("");
  const [outTxt, setOutTxt] = useState("");
  const [outCls, setOutCls] = useState("");
  const [busy,   setBusy]   = useState(false);
  const [copied, setCopied] = useState(false);

  const placeholder = "Translation appears here…";

  const doTranslate = useCallback(async (override) => {
    const t = (override !== undefined ? override : inp).trim();
    if (!t) { showToast("Please type or speak something first"); return; }
    if (from === to) { showToast("Please choose two different languages"); return; }
    setBusy(true);
    setOutTxt("Translating…");
    setOutCls("loading");
    const res = await translateText(t, from, to);
    setBusy(false);
    if (res && res.trim()) {
      setOutTxt(res.trim());
      setOutCls(to);
    } else {
      setOutTxt("Translation failed — please try again.");
      setOutCls("");
      showToast("❌ Translation failed — check connection");
    }
  }, [inp, from, to, showToast]);

  const [micActive, toggleMic] = useMic(from, t => {
    setInp(t);
    setTimeout(() => doTranslate(t), 300);
  }, showToast);

  function swap() {
    const tmp = from;
    setFrom(to);
    setTo(tmp);
    setOutTxt(placeholder);
    setOutCls("");
    setInp("");
  }

  function copyResult() {
    if (!outTxt || outTxt === placeholder || outTxt === "Translating…") return;
    navigator.clipboard?.writeText(outTxt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const examples = [
    { e: "Where is the nearest hospital?", from: "en", to: "ar" },
    { e: "Thank you very much",            from: "en", to: "ar" },
    { e: "How much does this cost?",       from: "en", to: "hi" },
    { e: "I need help please",             from: "en", to: "fil" },
    { e: "Good morning",                   from: "en", to: "ur" },
    { e: "Where is the bathroom?",         from: "en", to: "bn" },
    { e: "How are you?",                   from: "en", to: "ne" },
    { e: "Excuse me",                      from: "en", to: "zh" },
  ];

  return (
    <div className="pane">
      <div className="lbp">
        <div className="lbh">
          <div className="lbl3"><div className="sd" />Live Feature</div>
          <div className="lbt">LiveBridge™</div>
          <div className="lbs2">Speak your language — they hear theirs. 8 languages, real-time.</div>
        </div>

        <div className="lsr">
          <select className="lss" value={from} onChange={e => { setFrom(e.target.value); setOutTxt(placeholder); setOutCls(""); }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
          </select>
          <div className="lsw" onClick={swap} title="Swap languages">⇅</div>
          <select className="lss" value={to} onChange={e => { setTo(e.target.value); setOutTxt(placeholder); setOutCls(""); }}>
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
          </select>
        </div>

        <div className="lpp">
          <div className="lpa">
            <div className="lpl">You say ({LANG_NAMES[from]})</div>
            <textarea className="lta"
              placeholder={`Type in ${LANG_NAMES[from]}…`}
              value={inp}
              onChange={e => setInp(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doTranslate(); } }}
              style={isRTLLang(from) ? { direction: "rtl", fontFamily: "'Amiri',serif", fontSize: 18 } : {}}
            />
          </div>
          <div className="lpa" style={{ cursor: outTxt && outTxt !== placeholder ? "pointer" : "default" }} onClick={copyResult}>
            <div className="lpl">{copied ? "✓ Copied!" : `They hear (${LANG_NAMES[to]})`}</div>
            <div className={`lro${outCls ? " " + outCls : ""}${outCls === "loading" ? " loading" : ""}`}>
              {busy && <span className="spin" />}
              {outTxt || placeholder}
            </div>
          </div>
        </div>

        <div className="lb-vrow">
          <button className="lbtn" onClick={() => doTranslate()} disabled={busy}>
            {busy ? "⏳ Translating…" : "🌐 Translate Now"}
          </button>
          <div className={`lmic${micActive ? " rec" : ""}`} onClick={toggleMic} title="Voice input">
            {micActive ? "⏹" : "🎤"}
          </div>
        </div>

        <div className="exc">
          <div className="exl">Tap an example to translate instantly</div>
          {examples.map((ex, i) => (
            <div key={i} className="ei" onClick={() => {
              setFrom(ex.from);
              setTo(ex.to);
              setInp(ex.e);
              setOutTxt("Translating…");
              setOutCls("loading");
              setTimeout(() => doTranslate(ex.e), 50);
            }}>
              <div>
                <div className="een">{ex.e}</div>
                <div className="etr">{LANG_NAMES[ex.from]} → {LANG_NAMES[ex.to]}</div>
              </div>
              <div style={{ fontSize: 11, color: "#C4922E", flexShrink: 0 }}>
                {LANGS.find(l => l.code === ex.to)?.flag}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────
const QUIZ_WORDS = {
  ar:[
    {q:"شكراً",        a:"Thank you",   opts:["Thank you","Good morning","Goodbye","Help"]},
    {q:"مرحباً",       a:"Hello",       opts:["Hello","Please","Sorry","Water"]},
    {q:"كيف حالك؟",   a:"How are you?",opts:["How are you?","Where is it?","How much?","Goodbye"]},
    {q:"مستشفى",       a:"Hospital",    opts:["Hospital","Restaurant","Office","School"]},
    {q:"ماء",          a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"أين؟",         a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  hi:[
    {q:"धन्यवाद",      a:"Thank you",   opts:["Thank you","Hello","Goodbye","Sorry"]},
    {q:"नमस्ते",       a:"Hello",       opts:["Hello","Goodbye","Please","Help"]},
    {q:"कैसे हैं?",    a:"How are you?",opts:["How are you?","Where is it?","How much?","What?"]},
    {q:"अस्पताल",      a:"Hospital",    opts:["Hospital","Restaurant","Office","Market"]},
    {q:"पानी",         a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"कहाँ?",        a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  ur:[
    {q:"شکریہ",        a:"Thank you",   opts:["Thank you","Hello","Goodbye","Sorry"]},
    {q:"السلام علیکم", a:"Hello",       opts:["Hello","Goodbye","Please","Help"]},
    {q:"کیسے ہیں؟",    a:"How are you?",opts:["How are you?","Where is it?","How much?","What?"]},
    {q:"ہسپتال",       a:"Hospital",    opts:["Hospital","Restaurant","Office","School"]},
    {q:"پانی",         a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"کہاں؟",        a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  bn:[
    {q:"ধন্যবাদ",      a:"Thank you",   opts:["Thank you","Hello","Goodbye","Sorry"]},
    {q:"নমস্কার",      a:"Hello",       opts:["Hello","Goodbye","Please","Help"]},
    {q:"কেমন আছেন?",   a:"How are you?",opts:["How are you?","Where is it?","How much?","What?"]},
    {q:"হাসপাতাল",     a:"Hospital",    opts:["Hospital","Restaurant","Office","School"]},
    {q:"জল",           a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"কোথায়?",       a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  ne:[
    {q:"धन्यवाद",      a:"Thank you",   opts:["Thank you","Hello","Goodbye","Sorry"]},
    {q:"नमस्ते",       a:"Hello",       opts:["Hello","Goodbye","Please","Help"]},
    {q:"कस्तो हुनुहुन्छ?",a:"How are you?",opts:["How are you?","Where is it?","How much?","What?"]},
    {q:"अस्पताल",      a:"Hospital",    opts:["Hospital","Restaurant","Office","School"]},
    {q:"पानी",         a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"कहाँ?",        a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  zh:[
    {q:"谢谢",          a:"Thank you",   opts:["Thank you","Hello","Goodbye","Sorry"]},
    {q:"你好",          a:"Hello",       opts:["Hello","Goodbye","Please","Help"]},
    {q:"你好吗？",      a:"How are you?",opts:["How are you?","Where is it?","How much?","What?"]},
    {q:"医院",          a:"Hospital",    opts:["Hospital","Restaurant","Office","School"]},
    {q:"水",            a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"在哪里？",      a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  fil:[
    {q:"Salamat",      a:"Thank you",   opts:["Thank you","Hello","Goodbye","Sorry"]},
    {q:"Kumusta",      a:"Hello",       opts:["Hello","Goodbye","Please","Help"]},
    {q:"Kumusta ka?",  a:"How are you?",opts:["How are you?","Where is it?","How much?","What?"]},
    {q:"Ospital",      a:"Hospital",    opts:["Hospital","Restaurant","Office","School"]},
    {q:"Tubig",        a:"Water",       opts:["Water","Food","Money","Doctor"]},
    {q:"Nasaan?",      a:"Where?",      opts:["Where?","When?","Why?","Who?"]},
  ],
  en:[
    {q:"Excuse me",    a:"To get attention politely",opts:["To get attention politely","A farewell","A greeting","A question"]},
    {q:"How much?",    a:"Asking the price",         opts:["Asking the price","A greeting","A farewell","Your name"]},
    {q:"Hospital",     a:"Medical facility",          opts:["Medical facility","Restaurant","Office","School"]},
    {q:"Please",       a:"Polite request word",       opts:["Polite request word","Greeting","Farewell","Question"]},
    {q:"Thank you",    a:"Expressing gratitude",      opts:["Expressing gratitude","An apology","A request","A question"]},
    {q:"Goodbye",      a:"Farewell expression",       opts:["Farewell expression","A greeting","Thanks","Sorry"]},
  ],
};

const FILL_WORDS = {
  ar: [
    {sentence:"___ عليكم",  answer:"السلام",  hint:"Peace be upon you"},
    {sentence:"شكراً ___",  answer:"جزيلاً",  hint:"Thank you very much"},
    {sentence:"أين ___؟",   answer:"المستشفى",hint:"Where is the hospital?"},
    {sentence:"كم ___؟",    answer:"الحساب",  hint:"How much is the bill?"},
  ],
  hi: [
    {sentence:"नमस्___",    answer:"ते",        hint:"Namaste"},
    {sentence:"धन्य___",    answer:"वाद",       hint:"Thank you"},
    {sentence:"मुझे ___ चाहिए",answer:"मदद",   hint:"I need help"},
    {sentence:"कितना ___?", answer:"है",        hint:"How much is it?"},
  ],
  ur: [
    {sentence:"السلام ___", answer:"علیکم",    hint:"Peace be upon you"},
    {sentence:"شکریہ ___",  answer:"بہت",      hint:"Thank you very much"},
    {sentence:"مجھے ___ چاہیے",answer:"مدد",  hint:"I need help"},
    {sentence:"آپ ___ ہیں؟",answer:"کیسے",    hint:"How are you?"},
  ],
  bn: [
    {sentence:"নমস্___",    answer:"কার",       hint:"Namaskaar"},
    {sentence:"ধন্য___",    answer:"বাদ",       hint:"Thank you"},
    {sentence:"আমার ___ দরকার",answer:"সাহায্য",hint:"I need help"},
    {sentence:"কত ___?",    answer:"টাকা",      hint:"How much money?"},
  ],
  ne: [
    {sentence:"नमस्___",    answer:"ते",        hint:"Namaste"},
    {sentence:"धन्य___",    answer:"वाद",       hint:"Thank you"},
    {sentence:"मलाई ___ चाहिन्छ",answer:"सहायता",hint:"I need help"},
    {sentence:"कति ___?",   answer:"पैसा",      hint:"How much money?"},
  ],
  zh: [
    {sentence:"谢___",      answer:"谢",        hint:"Thank you"},
    {sentence:"你___",      answer:"好",        hint:"Hello"},
    {sentence:"在___里",    answer:"哪",        hint:"Where is it?"},
    {sentence:"多少___",    answer:"钱",        hint:"How much money?"},
  ],
  fil: [
    {sentence:"Sala___",    answer:"mat",       hint:"Thank you"},
    {sentence:"Kumus___",   answer:"ta",        hint:"Hello"},
    {sentence:"Mag___ng umaga",answer:"and",    hint:"Good morning"},
    {sentence:"Kailangan ko ng ___",answer:"tulong",hint:"I need help"},
  ],
  en: [
    {sentence:"Good ___",   answer:"morning",  hint:"Morning greeting"},
    {sentence:"Thank ___",  answer:"you",      hint:"Expressing gratitude"},
    {sentence:"How are ___?",answer:"you",     hint:"Common greeting"},
    {sentence:"Nice to ___ you",answer:"meet", hint:"First meeting"},
  ],
};

const MATCH_PAIRS = {
  ar: [{l:"شكراً",r:"Thank you"},{l:"مرحباً",r:"Hello"},{l:"مع السلامة",r:"Goodbye"},{l:"ماء",r:"Water"}],
  hi: [{l:"धन्यवाद",r:"Thank you"},{l:"नमस्ते",r:"Hello"},{l:"पानी",r:"Water"},{l:"अलविदा",r:"Goodbye"}],
  ur: [{l:"شکریہ",r:"Thank you"},{l:"ہیلو",r:"Hello"},{l:"پانی",r:"Water"},{l:"خدا حافظ",r:"Goodbye"}],
  bn: [{l:"ধন্যবাদ",r:"Thank you"},{l:"নমস্কার",r:"Hello"},{l:"জল",r:"Water"},{l:"বিদায়",r:"Goodbye"}],
  ne: [{l:"धन्यवाद",r:"Thank you"},{l:"नमस्ते",r:"Hello"},{l:"पानी",r:"Water"},{l:"बिदाइ",r:"Goodbye"}],
  zh: [{l:"谢谢",r:"Thank you"},{l:"你好",r:"Hello"},{l:"水",r:"Water"},{l:"再见",r:"Goodbye"}],
  fil:[{l:"Salamat",r:"Thank you"},{l:"Kumusta",r:"Hello"},{l:"Tubig",r:"Water"},{l:"Paalam",r:"Goodbye"}],
  en: [{l:"Thank you",r:"Gratitude"},{l:"Hello",r:"Greeting"},{l:"Water",r:"H₂O drink"},{l:"Goodbye",r:"Farewell"}],
};

// ─── GAMES PANE ──────────────────────────────────────────────────────────────
const GAME_LIST = [
  {id:"mcq",   icon:"🎯",name:"Word Quiz",     desc:"Pick the correct translation",  pts:"+10 XP/question",free:true},
  {id:"fill",  icon:"✏️",name:"Fill the Gap",  desc:"Type the missing word",         pts:"+15 XP/question",free:true},
  {id:"match", icon:"🔗",name:"Match It!",     desc:"Match words to translations",   pts:"+20 XP/round",   free:true},
  {id:"listen",icon:"👂",name:"Listening Quiz",desc:"Hear it, pick the meaning",     pts:"+12 XP/question",free:true},
  {id:"speed", icon:"⚡",name:"Speed Round",   desc:"Race the clock — 60 seconds",   pts:"+25 XP",         free:false},
  {id:"story", icon:"📖",name:"Story Mode",    desc:"Learn through a mini-story",    pts:"+30 XP",         free:false},
];

function GamesPane({ selLang, showToast, isPremium, setShowPrem, addXp, gamesP, setGamesP }) {
  const [activeGame, setActiveGame] = useState(null);
  const [pts,        setPts]        = useState(gamesP);

  const earn = (n) => {
    setPts(p => p + n);
    setGamesP(p => p + n);
    addXp(n);
    showToast(`+${n} XP earned! 🎉`);
  };

  if (activeGame === "mcq")    return <MCQGame    selLang={selLang} onEarn={earn} onBack={() => setActiveGame(null)} />;
  if (activeGame === "fill")   return <FillGame   selLang={selLang} onEarn={earn} onBack={() => setActiveGame(null)} />;
  if (activeGame === "match")  return <MatchGame  selLang={selLang} onEarn={earn} onBack={() => setActiveGame(null)} />;
  if (activeGame === "listen") return <ListenGame selLang={selLang} onEarn={earn} onBack={() => setActiveGame(null)} />;

  return (
    <div className="pane">
      <div className="gmp">
        <div className="gmh">
          <div className="gmt">🎮 Language Games</div>
          <div className="gms">Learn {selLang.name} through fun challenges</div>
          <div className="gm-pts">🏆 {pts} Game Points</div>
        </div>
        <div className="game-grid">
          {GAME_LIST.map(g => (
            <div key={g.id}
              className={`gc${!g.free && !isPremium ? " locked" : ""}`}
              onClick={() => {
                if (!g.free && !isPremium) { setShowPrem(true); return; }
                if (["speed","story"].includes(g.id)) { showToast("Coming soon in Premium! 🚀"); return; }
                setActiveGame(g.id);
              }}>
              <div className="gc-ic">{g.icon}</div>
              <div className="gc-n">{g.name}</div>
              <div className="gc-d">{g.desc}</div>
              <div className="gc-pts">{g.pts}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MCQ GAME ────────────────────────────────────────────────────────────────
function MCQGame({ selLang, onEarn, onBack }) {
  const [words] = useState(() =>
    [...(QUIZ_WORDS[selLang.code] || QUIZ_WORDS.ar)].sort(() => Math.random() - 0.5)
  );
  const [qi,    setQi]    = useState(0);
  const [sel,   setSel]   = useState(null);
  const [score, setScore] = useState(0);
  const [done,  setDone]  = useState(false);
  const [fb,    setFb]    = useState(null);

  const q = words[qi];
  const rtl = isRTLLang(selLang.code);
  const dev  = isDevanagari(selLang.code);

  function pick(opt) {
    if (sel) return;
    setSel(opt);
    const correct = opt === q.a;
    setFb(correct ? { ok: true, msg: "✓ Correct! +10 XP 🌟" } : { ok: false, msg: `✗ Correct answer: "${q.a}"` });
    if (correct) { setScore(s => s + 1); onEarn(10); }
    setTimeout(() => {
      setFb(null); setSel(null);
      if (qi + 1 >= words.length) setDone(true);
      else setQi(i => i + 1);
    }, 1500);
  }

  if (done) return (
    <div className="pane"><div className="gmp">
      <div className="game-score-card">
        <div className="gsc-title">🎯 Word Quiz Complete!</div>
        <div className="gsc-score">{score}/{words.length}</div>
        <div className="gsc-sub">
          {score === words.length ? "Perfect! Outstanding! 🌟" : score >= words.length * 0.7 ? "Great job! Keep going! 💪" : "Keep practising! You'll get there! 📚"}
        </div>
        <div className="gsc-btns">
          <button className="gsc-btn pri" onClick={() => { setQi(0); setSel(null); setScore(0); setDone(false); setFb(null); }}>↩ Try Again</button>
          <button className="gsc-btn sec" onClick={onBack}>← All Games</button>
        </div>
      </div>
    </div></div>
  );

  return (
    <div className="pane"><div className="gmp">
      <div className="game-box">
        <div className="game-title">🎯 Word Quiz <span style={{fontSize:12,color:"#A0876A",fontWeight:400}}>{qi+1}/{words.length}</span></div>
        <div className="game-sub">What does this {selLang.name} word mean in English?</div>
        <div className="game-progress">
          {words.map((_,i) => <div key={i} className={`gp-dot${i < qi ? " done" : i === qi ? " cur" : ""}`} />)}
        </div>
        <div className={`game-q${rtl ? " script" : dev ? " hn" : ""}`}>{q.q}</div>
        {fb && <div className={`game-fb${fb.ok ? " ok" : " bad"}`}>{fb.msg}</div>}
        <div className="opts">
          {q.opts.map((opt, i) => (
            <div key={i}
              className={`opt${sel === opt ? (opt === q.a ? " correct" : " wrong") : sel && opt === q.a ? " revealed" : ""}`}
              onClick={() => pick(opt)}>
              {opt}
            </div>
          ))}
        </div>
        <button className="back-btn" onClick={onBack}>← Back to Games</button>
      </div>
    </div></div>
  );
}

// ─── FILL GAME ───────────────────────────────────────────────────────────────
function FillGame({ selLang, onEarn, onBack }) {
  const [words] = useState(() =>
    [...(FILL_WORDS[selLang.code] || FILL_WORDS.ar)].sort(() => Math.random() - 0.5)
  );
  const [qi,    setQi]    = useState(0);
  const [val,   setVal]   = useState("");
  const [fb,    setFb]    = useState(null);
  const [score, setScore] = useState(0);
  const [done,  setDone]  = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (!fb) inputRef.current?.focus(); }, [fb, qi]);

  const q = words[qi];
  const rtl = isRTLLang(selLang.code);

  function check() {
    if (!val.trim() || fb) return;
    const correct = val.trim().toLowerCase() === q.answer.toLowerCase();
    setFb(correct ? { ok: true, msg: `✓ Correct! "${q.answer}" — +15 XP` } : { ok: false, msg: `✗ Answer: "${q.answer}"` });
    if (correct) { setScore(s => s + 1); onEarn(15); }
    setTimeout(() => {
      setFb(null); setVal("");
      if (qi + 1 >= words.length) setDone(true);
      else setQi(i => i + 1);
    }, 1600);
  }

  if (done) return (
    <div className="pane"><div className="gmp">
      <div className="game-score-card">
        <div className="gsc-title">✏️ Fill the Gap Complete!</div>
        <div className="gsc-score">{score}/{words.length}</div>
        <div className="gsc-sub">
          {score === words.length ? "All correct! Amazing! 🌟" : score >= words.length * 0.5 ? "Good effort! Keep practising! 💪" : "Practice makes perfect! 📚"}
        </div>
        <div className="gsc-btns">
          <button className="gsc-btn pri" onClick={() => { setQi(0); setVal(""); setScore(0); setDone(false); setFb(null); }}>↩ Try Again</button>
          <button className="gsc-btn sec" onClick={onBack}>← All Games</button>
        </div>
      </div>
    </div></div>
  );

  return (
    <div className="pane"><div className="gmp">
      <div className="game-box">
        <div className="game-title">✏️ Fill the Gap <span style={{fontSize:12,color:"#A0876A",fontWeight:400}}>{qi+1}/{words.length}</span></div>
        <div className="game-sub">💡 Hint: {q.hint}</div>
        <div className="game-progress">
          {words.map((_,i) => <div key={i} className={`gp-dot${i < qi ? " done" : i === qi ? " cur" : ""}`} />)}
        </div>
        <div className={`game-q${rtl ? " script" : ""}`}>{q.sentence}</div>
        {fb && <div className={`game-fb${fb.ok ? " ok" : " bad"}`}>{fb.msg}</div>}
        <input ref={inputRef} className="fill-input"
          placeholder="Type your answer…"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          disabled={!!fb}
          style={rtl ? { direction: "rtl", fontFamily: "'Amiri',serif", fontSize: 18 } : {}}
        />
        <button
          style={{width:"100%",padding:12,borderRadius:12,fontSize:13,border:"none",cursor:fb?"not-allowed":"pointer",background:"linear-gradient(135deg,#C4922E,#E8BC5A)",color:"#1A1207",fontWeight:700,fontFamily:"Sora,sans-serif",marginBottom:8,opacity:fb?0.6:1}}
          onClick={check} disabled={!!fb}>
          Check Answer ✓
        </button>
        <button className="back-btn" onClick={onBack}>← Back to Games</button>
      </div>
    </div></div>
  );
}

// ─── MATCH GAME ──────────────────────────────────────────────────────────────
function MatchGame({ selLang, onEarn, onBack }) {
  const pairs = MATCH_PAIRS[selLang.code] || MATCH_PAIRS.ar;
  // Shuffle right-side ONCE on mount
  const [rOrder] = useState(() => [...pairs].sort(() => Math.random() - 0.5).map(p => p.r));
  const [matched, setMatched] = useState([]);
  const [selL,    setSelL]    = useState(null);
  const [selR,    setSelR]    = useState(null);
  const [wrongL,  setWrongL]  = useState(null);
  const [wrongR,  setWrongR]  = useState(null);
  const [done,    setDone]    = useState(false);
  const [locked,  setLocked]  = useState(false);
  const rtl = isRTLLang(selLang.code);
  const dev  = isDevanagari(selLang.code);

  function tryMatch(newL, newR) {
    if (locked) return;
    const currentL = newL || selL;
    const currentR = newR || selR;
    if (!currentL || !currentR) return;

    setLocked(true);
    const pair = pairs.find(p => p.l === currentL);
    if (pair && pair.r === currentR) {
      const newMatched = [...matched, currentL];
      setMatched(newMatched);
      onEarn(20);
      setSelL(null); setSelR(null);
      setWrongL(null); setWrongR(null);
      if (newMatched.length >= pairs.length) setTimeout(() => setDone(true), 400);
    } else {
      setWrongL(currentL); setWrongR(currentR);
      setTimeout(() => { setWrongL(null); setWrongR(null); setSelL(null); setSelR(null); }, 700);
    }
    setTimeout(() => setLocked(false), 750);
  }

  function pickL(l) {
    if (matched.includes(l) || locked) return;
    const newL = selL === l ? null : l;
    setSelL(newL);
    if (newL && selR) tryMatch(newL, selR);
  }

  function pickR(r) {
    const matchedL = pairs.find(p => matched.includes(p.l) && p.r === r);
    if (matchedL || locked) return;
    const newR = selR === r ? null : r;
    setSelR(newR);
    if (selL && newR) tryMatch(selL, newR);
  }

  function reset() { setMatched([]); setSelL(null); setSelR(null); setWrongL(null); setWrongR(null); setDone(false); setLocked(false); }

  if (done) return (
    <div className="pane"><div className="gmp">
      <div className="game-score-card">
        <div className="gsc-title">🔗 Match Complete!</div>
        <div className="gsc-score">+{pairs.length * 20} XP</div>
        <div className="gsc-sub">You matched all {pairs.length} pairs! Amazing! 🌟</div>
        <div className="gsc-btns">
          <button className="gsc-btn pri" onClick={reset}>↩ Try Again</button>
          <button className="gsc-btn sec" onClick={onBack}>← All Games</button>
        </div>
      </div>
    </div></div>
  );

  return (
    <div className="pane"><div className="gmp">
      <div className="game-box">
        <div className="game-title">🔗 Match It!</div>
        <div className="game-sub">Tap a {selLang.name} word, then tap its English meaning</div>
        <div className="match-grid">
          <div className="match-col">
            {pairs.map((p, i) => {
              const isMatched = matched.includes(p.l);
              const isSelected = selL === p.l;
              const isWrong = wrongL === p.l;
              return (
                <div key={i}
                  className={`match-item${isMatched ? " matched" : isSelected ? " selected" : isWrong ? " wrong-match" : ""}`}
                  style={rtl ? { fontFamily: "'Amiri',serif", fontSize: 20, direction: "rtl" } : dev ? { fontSize: 16 } : {}}
                  onClick={() => pickL(p.l)}>
                  {p.l}
                </div>
              );
            })}
          </div>
          <div className="match-col">
            {rOrder.map((r, i) => {
              const matchedPair = pairs.find(p => p.r === r);
              const isMatched = matchedPair && matched.includes(matchedPair.l);
              const isSelected = selR === r;
              const isWrong = wrongR === r;
              return (
                <div key={i}
                  className={`match-item${isMatched ? " matched" : isSelected ? " selected" : isWrong ? " wrong-match" : ""}`}
                  onClick={() => pickR(r)}>
                  {r}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ height: 12 }} />
        <div style={{ fontSize: 11, color: "#A0876A", textAlign: "center", marginBottom: 8 }}>
          Matched: {matched.length}/{pairs.length}
        </div>
        <button className="back-btn" onClick={onBack}>← Back to Games</button>
      </div>
    </div></div>
  );
}

// ─── LISTEN GAME ─────────────────────────────────────────────────────────────
function ListenGame({ selLang, onEarn, onBack }) {
  const [words] = useState(() =>
    [...(QUIZ_WORDS[selLang.code] || QUIZ_WORDS.ar)].sort(() => Math.random() - 0.5)
  );
  const [qi,       setQi]      = useState(0);
  const [sel,      setSel]     = useState(null);
  const [fb,       setFb]      = useState(null);
  const [score,    setScore]   = useState(0);
  const [done,     setDone]    = useState(false);
  const [speaking, setSpeaking]= useState(false);

  const q = words[qi];

  function speak() {
    if (!window.speechSynthesis || speaking) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(q.q);
    const lang = LANGS.find(l => l.code === selLang.code);
    u.lang = lang?.speechCode || "en-US";
    u.rate = 0.75;
    u.pitch = 1;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }

  // Auto-speak when question changes
  useEffect(() => {
    const timer = setTimeout(() => speak(), 500);
    return () => clearTimeout(timer);
  }, [qi]);

  function pick(opt) {
    if (sel) return;
    setSel(opt);
    const correct = opt === q.a;
    setFb(correct ? { ok: true, msg: "✓ Correct! +12 XP 🌟" } : { ok: false, msg: `✗ Correct: "${q.a}"` });
    if (correct) { setScore(s => s + 1); onEarn(12); }
    setTimeout(() => {
      setFb(null); setSel(null);
      if (qi + 1 >= words.length) setDone(true);
      else setQi(i => i + 1);
    }, 1500);
  }

  if (done) return (
    <div className="pane"><div className="gmp">
      <div className="game-score-card">
        <div className="gsc-title">👂 Listening Complete!</div>
        <div className="gsc-score">{score}/{words.length}</div>
        <div className="gsc-sub">{score === words.length ? "Perfect ear! Outstanding! 🌟" : "Keep listening and practising! 📚"}</div>
        <div className="gsc-btns">
          <button className="gsc-btn pri" onClick={() => { setQi(0); setSel(null); setScore(0); setDone(false); setFb(null); }}>↩ Try Again</button>
          <button className="gsc-btn sec" onClick={onBack}>← All Games</button>
        </div>
      </div>
    </div></div>
  );

  return (
    <div className="pane"><div className="gmp">
      <div className="game-box">
        <div className="game-title">👂 Listening Quiz <span style={{fontSize:12,color:"#A0876A",fontWeight:400}}>{qi+1}/{words.length}</span></div>
        <div className="game-sub">Listen to the word and pick the correct English meaning</div>
        <div className="game-progress">
          {words.map((_,i) => <div key={i} className={`gp-dot${i < qi ? " done" : i === qi ? " cur" : ""}`} />)}
        </div>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <button onClick={speak}
            style={{
              background: speaking ? "rgba(196,146,46,0.3)" : "linear-gradient(135deg,#C4922E,#E8BC5A)",
              border: "none", borderRadius: "50%", width: 72, height: 72,
              fontSize: 28, cursor: "pointer", boxShadow: "0 8px 24px rgba(196,146,46,0.3)",
              transition: "all .2s"
            }}>
            {speaking ? "🔊" : "🔊"}
          </button>
          <div style={{ fontSize: 11, color: "#A0876A", marginTop: 8 }}>
            {speaking ? "Playing…" : "Tap to listen"}
          </div>
        </div>
        {fb && <div className={`game-fb${fb.ok ? " ok" : " bad"}`}>{fb.msg}</div>}
        <div className="opts">
          {q.opts.map((opt, i) => (
            <div key={i}
              className={`opt${sel === opt ? (opt === q.a ? " correct" : " wrong") : sel && opt === q.a ? " revealed" : ""}`}
              onClick={() => pick(opt)}>
              {opt}
            </div>
          ))}
        </div>
        <button className="back-btn" onClick={onBack}>← Back to Games</button>
      </div>
    </div></div>
  );
}

// ─── PROGRESS ────────────────────────────────────────────────────────────────
function ProgressPane({ xp, streak, lessonsD, gamesP }) {
  const level  = xp < 200 ? "Beginner" : xp < 500 ? "Elementary" : xp < 900 ? "Intermediate" : xp < 1500 ? "Advanced" : "Expert";
  const nextXp = xp < 200 ? 200 : xp < 500 ? 500 : xp < 900 ? 900 : xp < 1500 ? 1500 : 2000;
  const pct    = Math.min(100, Math.round((xp / nextXp) * 100));
  const achievements = [
    { icon: "🌟", name: "First Step",      desc: "Complete first lesson",  earned: lessonsD >= 1 },
    { icon: "🔥", name: "On Fire",         desc: "3-day streak",           earned: streak >= 3 },
    { icon: "🎮", name: "Game On",         desc: "Earn 50 game points",    earned: gamesP >= 50 },
    { icon: "🌐", name: "Bridge Builder",  desc: "Use LiveBridge 5×",      earned: false },
    { icon: "🏆", name: "Bahrain Pro",     desc: "Complete 10 lessons",    earned: lessonsD >= 10 },
    { icon: "💎", name: "Master",          desc: "Reach 1000 XP",          earned: xp >= 1000 },
  ];
  return (
    <div className="pane">
      <div className="pgp">
        <div className="xc">
          <div className="xr">
            <div>
              <div className="xl">Total XP</div>
              <div className="xn">{xp}</div>
              <div className="xs">{nextXp - xp} XP to next level</div>
            </div>
            <div className="xlv">{level}</div>
          </div>
          <div className="prog-bg"><div className="prog-fg" style={{ width: pct + "%" }} /></div>
          <div className="prog-labels"><span>0 XP</span><span>{nextXp} XP</span></div>
        </div>
        <div className="sr">
          <div className="sc"><div className="sv">{streak}</div><div className="sl2">Day Streak</div></div>
          <div className="sc"><div className="sv">{lessonsD}</div><div className="sl2">Lessons</div></div>
          <div className="sc"><div className="sv">{gamesP}</div><div className="sl2">Game Pts</div></div>
        </div>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: "#C4922E", fontWeight: 700, marginBottom: 8 }}>
          Language Progress
        </div>
        {LANGS.slice(0, 4).map((l, i) => (
          <div key={l.code} className="lang-prog-row">
            <div className="lpr-icon">{l.flag}</div>
            <div className="lpr-info">
              <div className="lpr-name">{l.name}</div>
              <div className="lpr-bar-bg">
                <div className="lpr-bar-fg" style={{ width: [24, 8, 5, 3][i] + "%" }} />
              </div>
            </div>
            <div className="lpr-pct">{[24, 8, 5, 3][i]}%</div>
          </div>
        ))}
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 2, color: "#C4922E", fontWeight: 700, marginBottom: 8, marginTop: 4 }}>
          Achievements
        </div>
        <div className="ag">
          {achievements.map((a, i) => (
            <div key={i} className={`ac${a.earned ? " on" : " off"}`}>
              <span className="ai3">{a.icon}</span>
              <div className="an3">{a.name}</div>
              <div className="ad3">{a.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PREMIUM MODAL ───────────────────────────────────────────────────────────
function PremiumModal({ onClose, onSubscribe, showToast }) {
  const features = [
    { icon: "🌐", text: "All 8 languages — Arabic, English, Hindi, Filipino, Urdu, Bengali, Nepali, Chinese" },
    { icon: "🎮", text: "All 6 games including Speed Round & Story Mode" },
    { icon: "🤖", text: "Unlimited AI Tutor conversations" },
    { icon: "🎤", text: "Voice recognition in all 8 languages" },
    { icon: "📊", text: "Detailed progress analytics & weekly reports" },
    { icon: "🌙", text: "Offline mode — learn anywhere, anytime" },
    { icon: "🏆", text: "Exclusive Premium achievements & badges" },
    { icon: "❤️", text: "Priority support from our language experts" },
  ];
  return (
    <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="mod" style={{ background: "#1A1207", border: "none", borderTop: "2px solid #C4922E" }}>
        <div className="mh" style={{ background: "rgba(196,146,46,.2)" }} />
        <div className="prem-bg" style={{ margin: 0, borderRadius: 0, background: "transparent" }}>
          <div className="prem-crown">👑</div>
          <div className="prem-title">Kalaam Premium</div>
          <div className="prem-sub">Unlock your full language learning potential with all 8 languages and exclusive features</div>
          <div className="prem-price">
            <div className="prem-amt">$3.99</div>
            <div className="prem-mo">/ month</div>
          </div>
          <div className="prem-label">PER INDIVIDUAL · CANCEL ANYTIME</div>
          <div className="prem-features">
            {features.map((f, i) => (
              <div key={i} className="pf">
                <span className="pf-ic">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <button className="prem-btn" onClick={() => {
            showToast("🎉 Premium activated! Welcome to Kalaam Premium");
            onSubscribe();
          }}>
            Start Premium — $3.99/month
          </button>
          <div className="prem-note">7-day free trial · No commitment · Cancel anytime · Secure payment</div>
        </div>
      </div>
    </div>
  );
}
