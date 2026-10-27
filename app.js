import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const statusEl = document.querySelector("#status");
const uidEl = document.querySelector("#uid");
const pointsEl = document.querySelector("#points");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.querySelector("#offers").addEventListener("click", () => {
  alert("جدار العروض غير مربوط بعد. يجب الحصول على موافقة مزود العروض وإعداد التحقق من إكمال المهام.");
});
document.querySelector("#withdraw").addEventListener("click", () => {
  alert("طلبات السحب غير مفعّلة بعد. لن يتم إرسال أي طلب مالي في النسخة الأولية.");
});

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  uidEl.textContent = user.uid;
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    pointsEl.textContent = snap.exists() ? String(snap.data().points ?? 0) : "0";
    statusEl.textContent = "تم إنشاء المعرّف تلقائيًا. الرصيد يُقرأ من الخادم؛ لا يوجد تسجيل دخول تقليدي.";
  } catch (e) {
    pointsEl.textContent = "—";
    statusEl.textContent = "تعذر تحميل الرصيد. تأكد من إعداد Firebase وقواعد Firestore.";
  }
});

signInAnonymously(auth).catch((e) => {
  statusEl.textContent = "لم يعمل التهيئة التلقائية. راجع إعدادات Firebase Anonymous Authentication.";
  uidEl.textContent = "غير متاح";
});
