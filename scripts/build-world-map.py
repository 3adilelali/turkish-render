"""World land outline (Natural Earth 50m land, public domain) → public/data/world.json.
python scripts/build-world-map.py <ne_50m_land.geojson>
Equirectangular: x = (lon+180)*W/360, y = (90-lat)*W/360, W=2000 (Antarctica dropped)."""
import json, sys
W = 2000
src = json.load(open(sys.argv[1], encoding="utf-8"))
paths = []
for f in src["features"]:
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for poly in polys:
        ring = poly[0]
        if max(p[1] for p in ring) < -55 or len(ring) < 8:
            continue
        pts, last = [], None
        for lon, lat in ring:
            p = (round((lon + 180) * W / 360, 1), round((90 - lat) * W / 360, 1))
            if last is None or abs(p[0] - last[0]) + abs(p[1] - last[1]) > 1.2:
                pts.append(p); last = p
        if len(pts) >= 4:
            paths.append("M" + "L".join(f"{x} {y}" for x, y in pts) + "Z")
json.dump({"w": W, "h": W / 2, "paths": paths}, open("public/data/world.json", "w"), separators=(",", ":"))
print(len(paths), "polygons")
