// لوحات فحص سريعة بمدخل منفصل (ما بيأثر على Root الأساسي ولا على أي تصدير شغّال)
import { registerRoot } from "remotion";
import { DevRoot } from "./DevRoot";
registerRoot(DevRoot);
