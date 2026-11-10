import React from "react";
import { H, Look, Person, TeaGlass, rp, cl, fmt } from "./Hayat";

// Kanal 4 kiti · yayıncılık / internet kafe / canlı yayın ekranı / TikTok canlı / kar-tipi / erişim engeli (2026-11-10, k6-05).

export const CEMAL: Look = { hairStyle: "short", hair: "#6B6B6B", top: "#3E4A3A", top2: "#2F382C", kind: "sweater", mustache: true, skin: "#D7A27C", beard: 0.35 };
export const KARDES: Look = { hairStyle: "short", hair: "#2A1C15", top: "#D8442E", top2: "#B23722", kind: "tshirt" };
const P = "Poppins";
const t_ = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, a: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={P} fontWeight={w} fontSize={size} fill={c} textAnchor={a}>{s}</text>;

// kar taneleri (tipi: yoğun + yatay rüzgâr)
export const Snow: React.FC<{ t: number; n?: number; wind?: number; o?: number }> = ({ t, n = 70, wind = 0.2, o = 0.85 }) => (
  <g opacity={o}>{Array.from({ length: n }, (_, i) => {
    const sp = 60 + (i * 37) % 90;
    const y = ((i * 97 + t * sp) % 1180) - 50;
    const x = ((i * 211 + t * sp * wind * 6 + Math.sin(t + i) * 20) % 2000) - 40;
    return <circle key={i} cx={x} cy={y} r={2 + (i % 4)} fill="#FFF" opacity={0.5 + (i % 3) * 0.2} />;
  })}</g>
);

// internet kafe: sıra sıra bilgisayar, neon tabela, çaydanlık, karlı pencere
export const InternetKafe: React.FC<{ t: number; px?: number; empty?: boolean; hi?: number; last?: boolean }> = ({ t, px = 0, empty, hi = 7, last }) => (
  <g>
    <rect width={1920} height={1080} fill="#1B1F2B" />
    <rect width={1920} height={560} fill="#232838" />
    <g transform={`translate(${1380 + px * 0.3},120)`}><rect width={420} height={300} fill="#0E1626" stroke="#4A5160" strokeWidth={12} /><Snow t={t} n={24} wind={0.4} o={0.9} /><rect y={250} width={420} height={50} fill="#E8EEF5" /></g>
    <g transform={`translate(${520 + px * 0.3},70)`}><rect width={620} height={110} rx={14} fill="#120A1E" stroke="#C77DFF" strokeWidth={4} /><text x={310} y={78} fontFamily={P} fontWeight={800} fontSize={60} fill="#E0AAFF" textAnchor="middle" opacity={0.75 + Math.sin(t * 7) * 0.2}>İNTERNET KAFE</text></g>
    <g transform={`translate(${120 + px * 0.3},240)`}><rect width={300} height={200} rx={10} fill="#F4F1EA" />{t_(150, 60, "Saati 30 TL", 34, "#222", 700, "middle")}{t_(150, 120, "23:00 sonrası", 28, "#C0392B", 700, "middle")}{t_(150, 160, "yarı fiyat", 28, "#C0392B", 700, "middle")}</g>
    {last && <g transform={`translate(${160 + px * 0.3},470)`}><rect width={260} height={70} fill="#FFE66D" />{t_(130, 48, "KAPANIYORUZ", 30, "#222", 800, "middle")}</g>}
    {/* arka sıra bilgisayarlar */}
    {Array.from({ length: 6 }, (_, i) => { const x = 160 + i * 300 + px * 0.6; const n = i + 1; return <g key={i} transform={`translate(${x},640)`}>
      <rect x={-110} y={-150} width={220} height={140} rx={8} fill="#111" /><rect x={-100} y={-140} width={200} height={120} fill={empty ? "#0B0F18" : ["#2B5D9A", "#7A2E2E", "#2E6B4A"][i % 3]} opacity={0.85} />
      <rect x={-12} y={-10} width={24} height={30} fill="#222" />
      <circle cx={-90} cy={-170} r={22} fill={n === hi ? H.red : "#3A4050"} />{t_(-90, -162, String(n), 24, "#FFF", 800, "middle")}
      {!empty && i % 2 === 0 && <g opacity={0.85}><circle cx={0} cy={60} r={36} fill="#1A120D" /><path d="M-70,170 Q-70,90 0,86 Q70,90 70,170Z" fill="#1A120D" /></g>}
    </g>; })}
    <rect y={760} width={1920} height={320} fill="#2A2F3E" />
    <g transform={`translate(${1700 + px * 0.6},740)`}><rect x={-60} y={-90} width={120} height={90} rx={20} fill="#B8BCC4" /><rect x={-40} y={-140} width={80} height={60} rx={14} fill="#D0D3D9" /><path d={`M30,-150 q 20,-30 0,-60`} stroke="#FFF" strokeWidth={6} fill="none" opacity={0.25 + Math.sin(t * 2) * 0.1} /><TeaGlass x={-120} y={0} s={0.8} t={t} /></g>
  </g>
);

// oyun karesi (genel savaş oyunu: arazi, nişangâh, mermi sayısı)
export const GameView: React.FC<{ t: number; w?: number; h?: number; dark?: number }> = ({ t, w = 1000, h = 625, dark = 0 }) => (
  <g>
    <rect width={w} height={h} fill="#7FB3D5" />
    <path d={`M0,${h * 0.55} L${w * 0.2},${h * 0.42} L${w * 0.45},${h * 0.5} L${w * 0.7},${h * 0.38} L${w},${h * 0.48} L${w},${h} L0,${h}Z`} fill="#6E7F5A" />
    <path d={`M0,${h * 0.7} L${w},${h * 0.62} L${w},${h} L0,${h}Z`} fill="#8C7A55" />
    {[0.25, 0.62, 0.8].map((x, i) => <g key={i} transform={`translate(${w * x + Math.sin(t * 0.7 + i) * 20},${h * 0.55})`}><rect x={-30} y={-60} width={60} height={60} fill="#5A4A3A" /><path d="M-40,-60 L0,-90 L40,-60Z" fill="#7A3E2E" /></g>)}
    <g transform={`translate(${w / 2 + Math.sin(t * 1.3) * 30},${h / 2 + Math.cos(t * 1.1) * 14})`}><circle r={26} stroke="#FFF" strokeWidth={3} fill="none" /><line x1={-40} x2={-12} stroke="#FFF" strokeWidth={3} /><line x1={12} x2={40} stroke="#FFF" strokeWidth={3} /><line y1={-40} y2={-12} stroke="#FFF" strokeWidth={3} /><line y1={12} y2={40} stroke="#FFF" strokeWidth={3} /></g>
    <path d={`M${w * 0.62},${h} L${w * 0.7},${h * 0.72} L${w * 0.86},${h * 0.7} L${w * 0.9},${h}Z`} fill="#2B2B2B" />
    {t_(w - 30, h - 30, "30 / 90", 30, "#FFF", 700, "end")}
    <rect width={w} height={h} fill="#000" opacity={dark} />
  </g>
);

// yayın ekranı (laptop/monitör içi 1000x625): oyun + kamera + sohbet + izleyici
export const StreamUI: React.FC<{ t: number; viewers: number; chat: string[]; chatK?: number; frozen?: boolean; face?: Look; banner?: string; bannerC?: string; noGame?: boolean; sub?: number }> = ({ t, viewers, chat, chatK = 1, frozen, face, banner, bannerC = "#9146FF", noGame, sub = 0 }) => {
  const tt = frozen ? 0 : t;
  return (
    <g>
      <rect width={1000} height={625} fill="#0E0E10" />
      <svg x={0} y={40} width={720} height={585} viewBox="0 0 1000 625" preserveAspectRatio="none">{noGame ? <rect width={1000} height={625} fill="#2A2420" /> : <GameView t={tt} />}</svg>
      {face && <g transform="translate(18,440)"><rect width={190} height={170} rx={8} fill="#1C2533" stroke="#FFF" strokeWidth={3} /><svg width={190} height={170} viewBox="-220 -640 440 400"><Person x={0} y={0} s={1} t={tt} o={face} arms="down" mouth="smile" talk={!frozen} /></svg></g>}
      <rect width={1000} height={40} fill="#18181B" /><circle cx={24} cy={20} r={8} fill={frozen ? "#666" : "#EB0400"} />{t_(40, 28, frozen ? "BAĞLANTI KOPTU" : "CANLI", 18, frozen ? "#AAA" : "#FFF", 800)}
      {t_(700, 28, `👁 ${fmt(viewers)}`, 22, "#FF6B6B", 700, "end")}
      <rect x={720} y={40} width={280} height={585} fill="#18181B" />{t_(735, 70, "SOHBET", 16, "#AAA", 700)}
      {chat.map((m, i) => { const k = cl(chatK * chat.length - i); const [n, ...r] = m.split(":"); return <g key={i} opacity={k}><text x={735} y={110 + i * 46} fontFamily={P} fontSize={17} fontWeight={700} fill={["#FF7A59", "#3EA6FF", "#2BB673", "#E0AAFF", "#FFC531"][i % 5]}>{n}<tspan fill="#EEE" fontWeight={500}>{r.length ? ":" + r.join(":") : ""}</tspan></text></g>; })}
      {banner && <g transform="translate(360,300)" opacity={rp(t, 0, 0.01)}><rect x={-300} y={-60} width={600} height={120} rx={18} fill={bannerC} />{t_(0, 14, banner, 40, "#FFF", 800, "middle")}</g>}
      {sub > 0 && Array.from({ length: 30 }, (_, i) => <rect key={i} x={360 + Math.cos(i * 2.4) * 300 * sub} y={300 + Math.sin(i * 1.7) * 200 * sub + sub * 120} width={12} height={20} fill={["#FFC531", "#FF6B6B", "#3EA6FF", "#2BB673"][i % 4]} opacity={1 - sub * 0.6} transform={`rotate(${i * 40})`} />)}
      {frozen && <g><rect width={720} height={625} y={40} fill="#000" opacity={0.35} /><circle cx={360} cy={330} r={40} stroke="#FFF" strokeWidth={8} fill="none" strokeDasharray="60 200" transform={`rotate(${t * 300} 360 330)`} /></g>}
    </g>
  );
};

// TikTok canlı (telefon içi 360x740): dikey kamera, hediyeler, karşılaşma çubuğu
export const TikLive: React.FC<{ t: number; face: Look; viewers: number; gifts?: number; pk?: number; total?: string; noGifts?: boolean }> = ({ t, face, viewers, gifts = 0, pk, total, noGifts }) => (
  <g>
    <rect width={360} height={740} fill="#24324A" />
    <rect y={420} width={360} height={320} fill="#1A2436" />
    {pk !== undefined ? <g>
      <svg x={0} y={110} width={180} height={330} viewBox="-170 -640 340 620"><rect x={-170} y={-640} width={340} height={620} fill="#2E3E5A" /><Person x={0} y={0} s={1} t={t} o={face} arms="wave" mouth="grin" talk /></svg>
      <svg x={180} y={110} width={180} height={330} viewBox="-170 -640 340 620"><rect x={-170} y={-640} width={340} height={620} fill="#4A2E3E" /><Person x={0} y={0} s={1} t={t + 2} o={{ hairStyle: "curly", top: "#222", top2: "#111", kind: "jacket", beard: 0.6 }} arms="wave" mouth="open" talk /></svg>
      <rect x={0} y={440} width={360} height={22} fill="#3EA6FF" /><rect x={360 * pk} y={440} width={360 * (1 - pk)} height={22} fill="#FE2C55" />
      {t_(180, 100, "KARŞILAŞMA", 22, "#FFF", 800, "middle")}
    </g> : <svg x={0} y={80} width={360} height={560} viewBox="-230 -660 460 720"><Person x={0} y={60} s={1} t={t} o={face} arms="wave" mouth="smile" talk /></svg>}
    <rect x={10} y={40} width={150} height={44} rx={22} fill="#000" opacity={0.4} />{t_(30, 70, `👁 ${fmt(viewers)}`, 18, "#FFF", 700)}
    {!noGifts && Array.from({ length: Math.round(gifts * 7) }, (_, i) => { const f = ((t * 0.5 + i * 0.17) % 1); return <g key={i} transform={`translate(${30 + (i * 53) % 250},${640 - f * 420})`} opacity={1 - f}><text fontSize={38}>{["🌹", "🦁", "🪐", "🌹", "💎", "🌹", "🦁"][i % 7]}</text></g>; })}
    {total && <g><rect x={170} y={40} width={180} height={44} rx={22} fill="#FFC531" />{t_(260, 70, total, 20, "#222", 800, "middle")}</g>}
    {noGifts && <g><rect x={20} y={600} width={320} height={50} rx={12} fill="#000" opacity={0.55} />{t_(180, 633, "Bu yayında hediye kapalı", 18, "#FFF", 700, "middle")}</g>}
    {Array.from({ length: 3 }, (_, i) => <g key={i} opacity={0.9}><rect x={14} y={500 + i * 30} width={200} height={24} rx={12} fill="#000" opacity={0.35} />{t_(24, 518 + i * 30, ["abi kazan 🔥", "selam Erzurum", "aslan geliyor"][i], 14, "#FFF", 600)}</g>)}
  </g>
);

// erişim engeli sayfası (1000x625)
export const BlockPage: React.FC<{ k?: number; site?: string }> = ({ k = 1, site = "kick.com" }) => (
  <g opacity={k}>
    <rect width={1000} height={625} fill="#F4F4F4" /><rect width={1000} height={50} fill="#DDD" /><rect x={20} y={12} width={600} height={26} rx={13} fill="#FFF" />{t_(36, 31, `https://${site}`, 16, "#555", 500)}
    <circle cx={500} cy={200} r={70} fill="#C0392B" /><rect x={460} y={192} width={80} height={16} rx={4} fill="#FFF" />
    {t_(500, 340, "Bu siteye erişim engellenmiştir.", 40, "#222", 700, "middle")}
    {t_(500, 400, `${site}, 20/02/2024 tarihli ve 2024/5 sayılı`, 22, "#555", 500, "middle")}
    {t_(500, 435, "Milli Piyango İdaresi Genel Müdürlüğü kararıyla", 22, "#555", 500, "middle")}
    {t_(500, 470, "erişime engellenmiştir.", 22, "#555", 500, "middle")}
  </g>
);

// kasa (bilgisayar)
export const PcCase: React.FC<{ x: number; y: number; s?: number; t: number; n?: number }> = ({ x, y, s = 1, t, n }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-90} y={-220} width={180} height={220} rx={12} fill="#2A2E36" /><rect x={-80} y={-210} width={160} height={200} rx={8} fill="#1C1F25" />
    {[0, 1, 2].map((i) => <circle key={i} cx={20} cy={-170 + i * 60} r={22} fill="none" stroke={["#3EA6FF", "#C77DFF", "#2BB673"][i]} strokeWidth={4} opacity={0.6 + Math.sin(t * 3 + i) * 0.3} />)}
    <circle cx={-55} cy={-190} r={7} fill="#2BB673" />
    {n !== undefined && <g><circle cx={-50} cy={-60} r={30} fill={H.red} />{t_(-50, -50, String(n), 30, "#FFF", 800, "middle")}</g>}
  </g>
);

// gece yolu karda (eve yürüyüş)
export const SnowStreet: React.FC<{ t: number; px?: number; temp?: string }> = ({ t, px = 0, temp = "-15°C" }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A1222" />
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${(i * 360 + px * 0.4) % 2200 - 100},300)`}><rect width={260} height={460} fill="#1A2236" /><path d="M-10,0 L130,-70 L270,0Z" fill="#E8EEF5" />{[0, 1, 2].map((j) => <rect key={j} x={40 + j * 70} y={80} width={40} height={60} fill="#FFD27A" opacity={(i + j) % 3 ? 0.15 : 0.6} />)}</g>)}
    {[300, 1000, 1700].map((x, i) => <g key={i} transform={`translate(${(x + px * 0.7) % 2100},760)`}><rect x={-5} y={-380} width={10} height={380} fill="#333" /><circle cy={-390} r={16} fill="#FFE2A8" /><ellipse cy={-200} rx={160} ry={260} fill="url(#hLamp)" opacity={0.35} /></g>)}
    <rect y={760} width={1920} height={320} fill="#DCE4EE" /><rect y={760} width={1920} height={14} fill="#FFF" />
    <Snow t={t} n={110} wind={0.6} />
    <g transform="translate(1620,140)"><rect x={-120} y={-50} width={240} height={90} rx={16} fill="#000" opacity={0.5} />{t_(0, 18, temp, 52, "#9FD4FF", 800, "middle")}</g>
  </g>
);
