import { useState, useEffect, useRef } from "react";

const SERVICES = [
    { icon: "fa-solid fa-oil-can", title: "تغيير الزيت والفلاتر", desc: "تغيير زيت المحرك وفلاتر الهواء والوقود بمنتجات معتمدة وعالية الجودة." },
    { icon: "fa-solid fa-car-battery", title: "فحص وتبديل البطارية", desc: "فحص شامل لحالة البطارية واستبدالها الفوري عند الضرورة مع ضمان." },
    { icon: "fa-solid fa-gauge-high", title: "فحص أنظمة الفرامل", desc: "تشخيص دقيق لنظام الفرامل وتبديل التيل والأسطوانات بأمان تام." },
    { icon: "fa-solid fa-snowflake", title: "صيانة التكييف", desc: "فحص وشحن غاز التكييف وتنظيف فلتر الهواء الداخلي لراحة قصوى." },
    { icon: "fa-solid fa-microchip", title: "تشخيص إلكتروني", desc: "قراءة أكواد الأعطال بأجهزة متطورة وتقرير مفصل فوري على هاتفك." },
    { icon: "fa-solid fa-circle-dot", title: "الإطارات وزوايا الميزان", desc: "تبديل الإطارات وضبط زوايا الميزان وتوازن العجلات بدقة عالية." },
];

const STEPS = [
    { num: "01", title: "سجّل واختر خدمتك", desc: "أنشئ حسابك في دقيقة واحدة واختر الخدمة التي تحتاجها من قائمتنا الشاملة." },
    { num: "02", title: "حدد الموعد والعنوان", desc: "اختر الوقت المناسب لك وأضف عنوانك، وسيصلك الفني في الوقت المحدد." },
    { num: "03", title: "تابع العمل لحظياً", desc: "تتبع حالة طلبك بشكل فوري وتلقَّ إشعارات عند كل تحديث." },
    { num: "04", title: "استلم سيارتك بضمان", desc: "بعد اكتمال الخدمة، وقّع على التقرير الفني واستلم سيارتك مع ضمان الجودة." },
];

const TESTIMONIALS = [
    { name: "أحمد محمد", car: "BMW X5 2022", initial: "أ", stars: 5, text: "خدمة احترافية جداً، الفني وصل في الوقت المحدد وأنجز الشغل بسرعة وبجودة عالية. بالتأكيد سأتعامل معهم مرة أخرى." },
    { name: "سارة علي", car: "Hyundai Tucson 2021", initial: "س", stars: 5, text: "أخيراً وجدت خدمة صيانة يمكن الوثوق بها! التقرير الفني الإلكتروني رائع وبيوضح كل حاجة بالتفصيل." },
    { name: "محمود حسن", car: "Toyota Camry 2020", initial: "م", stars: 4, text: "سهولة الحجز عبر التطبيق ممتازة، والفني كان محترم ومتمكن. السعر معقول جداً مقارنةً بالورش العادية." },
    { name: "كريم إبراهيم", car: "Kia Sportage 2023", initial: "ك", stars: 5, text: "التتبع اللحظي لحالة الطلب شيء مختلف تماماً! عارف في كل لحظة الفني بيعمل إيه. ده المستقبل." },
    { name: "نور الدين", car: "Nissan Altima 2019", initial: "ن", stars: 5, text: "فنيين خبرة عالية جداً. اكتشفوا مشكلة في الفرامل ما كنتش عارفاها وصلحوها فوراً. شكراً AutoCare!" },
];

const STATS = [
    { value: "+12K", label: "عميل راضٍ" },
    { value: "98%", label: "نسبة الرضا" },
    { value: "+240", label: "فني معتمد" },
    { value: "24/7", label: "دعم متواصل" },
];

const C = {
    bg: "#f6f7fb",
    card: "#ffffff",
    alt: "#eef0f6",
    text: "#1c2233",
    muted: "#6b7280",
    border: "rgba(0,0,0,0.08)",
    blue: "#2A5CAF",
    blueDim: "rgba(42,92,175,0.08)",
    blueMid: "rgba(42,92,175,0.16)",
};

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
    const [ref, visible] = useReveal();
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(26px)",
            transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}>{children}</div>
    );
}

function ServiceCard({ icon, title, desc, delay }) {
    const [hov, setHov] = useState(false);
    return (
        <Reveal delay={delay}>
            <div
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}
                style={{
                    background: C.card,
                    border: `1.5px solid ${hov ? C.blue : C.border}`,
                    borderRadius: 16, padding: "30px 26px",
                    transform: hov ? "translateY(-5px)" : "translateY(0)",
                    boxShadow: hov ? "0 16px 48px rgba(42,92,175,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                }}
            >
                <div style={{
                    position: "absolute", top: 0, right: 0, left: 0, height: 3,
                    background: `linear-gradient(to left, ${C.blue}, transparent)`,
                    transform: hov ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "right", transition: "transform 0.4s ease",
                    borderRadius: "16px 16px 0 0",
                }} />
                <div style={{
                    width: 52, height: 52, borderRadius: 14, marginBottom: 20,
                    background: hov ? C.blueMid : C.blueDim,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, color: C.blue, transition: "background 0.3s",
                }}>
                    <i className={icon} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: C.text }}>{title}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{desc}</div>
                <div style={{
                    marginTop: 18, color: C.blue, fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 6,
                    opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(8px)",
                    transition: "all 0.3s",
                }}>
                    اعرف أكثر <i className="fa-solid fa-arrow-left" />
                </div>
            </div>
        </Reveal>
    );
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <div style={{ fontFamily: "'Tajawal',sans-serif", background: C.bg, color: C.text, direction: "rtl", overflowX: "hidden" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Bebas+Neue&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        @keyframes heroIn  { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .testi-track { display:flex; gap:20px; width:max-content; animation:marquee 38s linear infinite; }
        .testi-track:hover { animation-play-state:paused; }
        .btn-blue  { background:#2A5CAF; color:#fff; border:none; padding:15px 34px; border-radius:10px; font-family:'Tajawal',sans-serif; font-size:16px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:10px; transition:all 0.2s; box-shadow:0 6px 22px rgba(42,92,175,0.3); }
        .btn-blue:hover { background:#1e4a94; transform:translateY(-2px); box-shadow:0 10px 30px rgba(42,92,175,0.4); }
        .btn-white { background:#fff; color:#2A5CAF; border:none; padding:15px 34px; border-radius:10px; font-family:'Tajawal',sans-serif; font-size:16px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:10px; transition:all 0.2s; box-shadow:0 6px 22px rgba(0,0,0,0.15); }
        .btn-white:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,0,0,0.2); }
        .btn-ghost-white { background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,0.5); padding:15px 34px; border-radius:10px; font-family:'Tajawal',sans-serif; font-size:16px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:10px; transition:all 0.2s; }
        .btn-ghost-white:hover { background:rgba(255,255,255,0.12); border-color:#fff; }
        .btn-ghost-blue { background:transparent; color:#2A5CAF; border:1.5px solid #2A5CAF; padding:15px 34px; border-radius:10px; font-family:'Tajawal',sans-serif; font-size:16px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:10px; transition:all 0.2s; }
        .btn-ghost-blue:hover { background:#2A5CAF; color:#fff; }
        .nav-a { text-decoration:none; font-size:15px; font-weight:500; transition:color 0.2s; cursor:pointer; }
        .step-row:hover .step-num { color:rgba(42,92,175,0.3) !important; }
        ::-webkit-scrollbar { width:5px; } ::-webkit-scrollbar-track { background:#f6f7fb; } ::-webkit-scrollbar-thumb { background:#d1d5db; border-radius:4px; }
        a { transition: color 0.2s; }
      `}</style>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: "fixed", top: 0, right: 0, left: 0, zIndex: 100,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "18px 60px",
                background: scrolled ? "rgba(255,255,255,0.97)" : "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
                borderBottom: scrolled ? `1px solid ${C.border}` : "none",
                backdropFilter: scrolled ? "blur(16px)" : "none",
                boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.35s",
            }}>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, letterSpacing: 4, color: scrolled ? C.blue : "#fff" }}>
                    AUTO<span style={{ color: scrolled ? C.text : "rgba(255,255,255,0.65)" }}>CARE</span>
                </span>
                <div style={{ display: "flex", gap: 36 }}>
                    {[["services", "خدماتنا"], ["how", "كيف نعمل"], ["testimonials", "آراء العملاء"]].map(([id, label]) => (
                        <a key={id} className="nav-a"
                            style={{ color: scrolled ? "rgba(28,34,51,0.65)" : "rgba(255,255,255,0.85)" }}
                            onMouseEnter={e => e.currentTarget.style.color = scrolled ? C.blue : "#fff"}
                            onMouseLeave={e => e.currentTarget.style.color = scrolled ? "rgba(28,34,51,0.65)" : "rgba(255,255,255,0.85)"}
                            onClick={() => scrollTo(id)}
                        >{label}</a>
                    ))}
                </div>
                <button className="btn-blue" style={{ padding: "9px 24px", fontSize: 14 }} onClick={() => scrollTo("cta")}>
                    احجز الآن
                </button>
            </nav>

            {/* ── HERO ── */}
            <section id="hero" style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", overflow: "hidden" }}>
                <video autoPlay muted loop playsInline
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                    src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
                />
                <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to left, rgba(0,0,0,0.05) 0%, rgba(10,20,60,0.72) 50%, rgba(10,20,60,0.9) 100%)" }} />

                <div style={{ position: "relative", zIndex: 2, maxWidth: 700, padding: "0 60px", animation: "heroIn 1s cubic-bezier(0.16,1,0.3,1) both" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.28)",
                        color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: 2.5,
                        padding: "6px 16px", borderRadius: 100, marginBottom: 24, textTransform: "uppercase",
                        backdropFilter: "blur(8px)",
                    }}>
                        <i className="fa-solid fa-shield-halved" style={{ fontSize: 10 }} /> خدمة موثوقة · ضمان شامل
                    </div>
                    <h1 style={{ fontSize: "clamp(46px,6.5vw,82px)", fontWeight: 900, lineHeight: 1.06, marginBottom: 24, color: "#fff", letterSpacing: -1 }}>
                        سيارتك تستحق<br />
                        <span style={{ color: "#7EB3FF" }}>الأفضل.</span>
                    </h1>
                    <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: 40, maxWidth: 500 }}>
                        منصة متكاملة لصيانة سيارتك مع فنيين معتمدين، حجز سريع، وتتبع لحظي لكل خدمة من باب منزلك.
                    </p>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <button className="btn-blue" style={{ fontSize: 17, padding: "16px 36px" }} onClick={() => scrollTo("cta")}>
                            <i className="fa-solid fa-calendar-check" /> احجز موعدك الآن
                        </button>
                        <button className="btn-ghost-white" style={{ fontSize: 17, padding: "16px 36px" }} onClick={() => scrollTo("how")}>
                            <i className="fa-solid fa-play" style={{ fontSize: 12 }} /> كيف يعمل؟
                        </button>
                    </div>
                </div>

                {/* Stats strip */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 2, display: "flex", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                    {STATS.map((s, i) => (
                        <div key={i} style={{ flex: 1, padding: "22px 0", textAlign: "center", borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, letterSpacing: 2, color: C.blue, lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: 13, color: C.muted, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICES ── */}
            <section id="services" style={{ padding: "100px 60px", background: C.bg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, gap: 32, flexWrap: "wrap" }}>
                    <div>
                        <Reveal><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.blue, display: "block", marginBottom: 10 }}>خدماتنا</span></Reveal>
                        <Reveal delay={100}><h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 900, lineHeight: 1.1, color: C.text }}>كل ما تحتاجه<br />في مكان واحد</h2></Reveal>
                    </div>
                    <Reveal delay={200}><p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, maxWidth: 380 }}>نوفر طيفاً واسعاً من خدمات الصيانة والإصلاح بأعلى معايير الجودة وأسرع وقت ممكن.</p></Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 20 }}>
                    {SERVICES.map((s, i) => <ServiceCard key={i} {...s} delay={i * 70} />)}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how" style={{ padding: "100px 60px", background: C.card }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                    <div>
                        <Reveal><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.blue, display: "block", marginBottom: 10 }}>الطريقة</span></Reveal>
                        <Reveal delay={100}><h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 48, color: C.text }}>في 4 خطوات<br />بسيطة فقط</h2></Reveal>
                        {STEPS.map((s, i) => (
                            <Reveal key={i} delay={i * 90}>
                                <div className="step-row" style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: i < STEPS.length - 1 ? `1px solid ${C.border}` : "none" }}>
                                    <div className="step-num" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 48, color: "rgba(42,92,175,0.12)", lineHeight: 1, minWidth: 48, transition: "color 0.3s" }}>{s.num}</div>
                                    <div style={{ paddingTop: 4 }}>
                                        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 7, color: C.text }}>{s.title}</div>
                                        <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>{s.desc}</div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={200}>
                        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4/5" }}>
                            <img src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="فني صيانة" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,20,60,0.7) 0%, transparent 55%)" }} />
                            <div style={{
                                position: "absolute", bottom: 24, right: 24, left: 24,
                                background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)",
                                border: `1px solid ${C.border}`, borderRadius: 14,
                                padding: "18px 20px", display: "flex", alignItems: "center", gap: 14,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: C.blueDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.blue, flexShrink: 0 }}>
                                    <i className="fa-solid fa-circle-check" />
                                </div>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>الخدمة مكتملة ✓</div>
                                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>تم فحص 24 نقطة — Toyota Camry 2023</div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section id="testimonials" style={{ padding: "100px 0", background: C.bg, overflow: "hidden" }}>
                <div style={{ textAlign: "center", marginBottom: 56, padding: "0 60px" }}>
                    <Reveal><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: C.blue, display: "block", marginBottom: 10 }}>آراء العملاء</span></Reveal>
                    <Reveal delay={100}><h2 style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 14, color: C.text }}>ماذا يقول<br />عملاؤنا</h2></Reveal>
                    <Reveal delay={200}><p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, maxWidth: 420, margin: "0 auto" }}>آلاف العملاء وثقوا بنا لصيانة سياراتهم — اقرأ تجاربهم الحقيقية.</p></Reveal>
                </div>
                <div style={{ overflow: "hidden" }}>
                    <div className="testi-track">
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                            <div key={i} style={{ width: 320, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: 26, flexShrink: 0, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                                <div style={{ color: "#F59E0B", fontSize: 13, marginBottom: 14 }}>{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
                                <p style={{ fontSize: 14, lineHeight: 1.78, color: C.muted, marginBottom: 20 }}>{`"${t.text}"`}</p>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, #1e3a70)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", flexShrink: 0 }}>{t.initial}</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{t.name}</div>
                                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.car}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section id="cta" style={{ padding: "100px 60px", textAlign: "center", position: "relative", overflow: "hidden", background: `linear-gradient(135deg, #1c3a7a 0%, ${C.blue} 60%, #3a7bd5 100%)` }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)", pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <Reveal><h2 style={{ fontSize: "clamp(34px,5vw,60px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18, color: "#fff" }}>جاهز تجرّب<br /><span style={{ color: "#7EB3FF" }}>الفرق الحقيقي؟</span></h2></Reveal>
                    <Reveal delay={100}><p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", marginBottom: 44, lineHeight: 1.7 }}>احجز أول خدمة صيانة لسيارتك اليوم واحصل على فحص مجاني شامل بـ 24 نقطة.</p></Reveal>
                    <Reveal delay={200}>
                        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
                            <button className="btn-white" style={{ fontSize: 17, padding: "17px 44px" }}><i className="fa-solid fa-calendar-plus" /> احجز مجاناً الآن</button>
                            <button className="btn-ghost-white" style={{ fontSize: 17, padding: "17px 44px" }}><i className="fa-brands fa-whatsapp" /> تواصل معنا</button>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "60px 60px 40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 60, marginBottom: 48 }}>
                    <div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 4, color: C.blue, marginBottom: 14 }}>
                            AUTO<span style={{ color: C.text }}>CARE</span>
                        </div>
                        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, maxWidth: 230 }}>منصتك الموثوقة لصيانة سيارتك بأعلى معايير الجودة وأسرع وقت ممكن.</p>
                    </div>
                    {[
                        { title: "خدماتنا", links: ["تغيير الزيت", "صيانة الفرامل", "التكييف", "الإطارات"] },
                        { title: "الشركة", links: ["من نحن", "انضم كفني", "المدونة", "الوظائف"] },
                        { title: "الدعم", links: ["مركز المساعدة", "سياسة الخصوصية", "الشروط والأحكام", "تواصل معنا"] },
                    ].map((col) => (
                        <div key={col.title}>
                            <h5 style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: C.muted, marginBottom: 18 }}>{col.title}</h5>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11 }}>
                                {col.links.map(l => (
                                    <li key={l}>
                                        <a href="#" style={{ color: C.muted, textDecoration: "none", fontSize: 14 }}
                                            onMouseEnter={e => e.currentTarget.style.color = C.blue}
                                            onMouseLeave={e => e.currentTarget.style.color = C.muted}
                                        >{l}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: C.muted }}>
                    <span>© 2025 AutoCare. جميع الحقوق محفوظة.</span>
                    <div style={{ display: "flex", gap: 10 }}>
                        {["fa-brands fa-instagram", "fa-brands fa-x-twitter", "fa-brands fa-facebook-f", "fa-brands fa-whatsapp"].map((cls, i) => (
                            <a key={i} href="#" style={{ width: 34, height: 34, border: `1px solid ${C.border}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, textDecoration: "none", fontSize: 13 }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                            >
                                <i className={cls} />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}