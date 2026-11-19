import { BoardItem, BoardString } from "../../components/Protokol6";
import { CUE, board } from "./h";

// «قاعدة البيت»: لوحة التحقيق (بدل المقدّم بالكاميرا عند حمزة). كل عنصر بينتثبّت لما نحكي عنه أول مرة.
const c = (p: string, d = 0) => CUE(p) + d;
export const BOARD: BoardItem[] = [
  { id: "bazna", file: "bazna", text: "İLYAS BAZNA", x: 1500, y: 900, rot: -2, w: 330, at: c("Burası Protokol X", -0.1), fy: 0.3 },
  { id: "papen", file: "papenw6", text: "FRANZ VON PAPEN", x: 900, y: 640, rot: -3, w: 300, at: c("İki. Almanya'nın"), fy: 0.3 },
  { id: "ribb", file: "ribb2", text: "RIBBENTROP", x: 2100, y: 640, rot: 3, w: 300, at: c("İki. Almanya'nın", 0.5), fx: 0.85, fy: 0.3 },
  { id: "money", file: "bernhard1", text: "20.000 £", x: 2560, y: 930, rot: 4, w: 330, at: c("Üç. Bu adamın") },
  { id: "moyz", kind: "note", text: "MOYZISCH", sub: "SD · ticaret ataşesi", x: 930, y: 1130, rot: -4, w: 330, at: c("Alman istihbaratçı Ludwig") },
  { id: "hug", kind: "note", text: "HUGESSEN", sub: "İngiliz Büyükelçisi", x: 2080, y: 1130, rot: 3, w: 330, at: c("Büyükelçinin adı"), c: "#BFD7EA" },
  { id: "cam", file: "leicaw2", text: "LEICA (temsili)", x: 440, y: 900, rot: -4, w: 300, at: c("Bazna, küçük bir Layka") },
  { id: "chur", file: "churchill3", text: "CHURCHILL", x: 1500, y: 400, rot: 2, w: 300, at: c("Churchill, Roosevelt ve İnönü"), fy: 0.3 },
  { id: "over", file: "overw4", text: "OVERLORD", x: 1500, y: 1430, rot: -2, w: 360, at: c("Ve bir de, Overlord") },
  { id: "kalt", kind: "note", text: "KALTENBRUNNER", sub: "SS generali", x: 440, y: 1260, rot: 3, w: 330, at: c("Moytsiş'in amiri, SS generali"), c: "#E8B4B4" },
  { id: "nele", kind: "note", text: "NELE KAP", sub: "sekreter", x: 2580, y: 1330, rot: -3, w: 300, at: c("Moytsiş ona Elizabet") },
];
export const STR: BoardString[] = [["bazna", "moyz"], ["moyz", "papen"], ["papen", "ribb"], ["bazna", "hug"], ["bazna", "money"], ["bazna", "cam"], ["moyz", "kalt"], ["moyz", "nele"], ["cam", "over"], ["chur", "over"]];
export const bd = (id: string, z = 1.6, id1?: string, z1?: number) => board(BOARD, STR, { id, z }, id1 ? { id: id1, z: z1 ?? z } : undefined);
