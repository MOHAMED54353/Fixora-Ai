import React from "react";
import { Mail, Phone, MapPin , Facebook, Youtube } from "lucide-react";
import { Instagram } from "lucide-react";

const Footer = () => {
  return (
    <>
      <div id="footer" style={{ width: "100%", backgroundColor: "#f5f5f5" }}>
        <div
          style={{
            backgroundColor: "#2A5CAF",
            padding: "60px 30px 30px 0",
            direction: "rtl",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "40px",
                marginBottom: "40px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <img src="/logo.png" alt="logo" />
                  <div style={{ color: "white", fontSize: "30px" }}></div>
                </div>
                <p
                  style={{
                    color: "white",
                    fontSize: "16px",
                    lineHeight: "24px",
                    margin: 0,
                  }}
                >
                  منصة ذكية لإدارة وصيانة السيارات باستخدام الذكاء الاصطناعي
                  والحجوزات السهلة.
                </p>
              </div>

              <div>
                <h3
                  style={{
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  روابط سريعة
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "12px" }}>
                    <a
                      href="privacy"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "16px",
                      }}
                    >
                      سياسة الخصوصية
                    </a>
                  </li>
                  <li style={{ marginBottom: "12px" }}>
                    <a
                      href="terms"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "16px",
                      }}
                    >
                      الشروط والأحكام
                    </a>
                  </li>
                  <li style={{ marginBottom: "12px" }}>
                    <a
                      href="faq"
                      style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "16px",
                      }}
                    >
                      الأسئلة الشائعة
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  style={{
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  تواصل معنا
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                  }}
                >
                  <a
                    href="tel:+20123456789"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "16px",
                    }}
                  >
                    <Phone size={18} />
                    <span>01275989902</span>
                  </a>
                  <a
                    href="mailto:info@FIXORA.com"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "16px",
                    }}
                  >
                    <Mail size={18} />
                    <span>medooomodey33@gmail.com</span>
                  </a>
                  <div
                    style={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "16px",
                    }}
                  >
                    <MapPin size={18} />
                    <span>الزقازيق، مصر</span>
                  </div>
                </div>
              </div>

              <div>
                <h3
                  style={{
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  تابعنا
                </h3>

                <div style={{ display: "flex", gap: "15px" }}>
                  {[
                    { href: "https://www.instagram.com/medo_3289", icon: <Instagram size={24} />, color: "#E1306C" },
                    { href: "https://www.facebook.com/share/17cdQzQnxG/", icon: <Facebook size={24} />, color: "#1877F2" },
                    { href: "https://wa.me/+201275989902", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>, color: "#25D366" },
                    { href: "https://www.youtube.com/@Muhammed-Elsayed557", icon: <Youtube size={24} />, color: "#FF0000" },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: social.color,
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(228, 228, 228, 0.14)",
                        transform: "scale(1)",
                        transition: "all 0.5s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.4)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>

              </div>
            </div>


            <div
              style={{
                borderTop: "1px dashed rgba(255, 255, 255, 0.3)",
                paddingTop: "20px",
              }}
            >
              <p
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "14px",
                  margin: 0,
                  lineHeight: "24px",
                }}
              >
                <i className="fa-solid fa-car-burst" style={{ color: "red" }}></i>
                جميع الحقوق محفوظة .  {new Date().getFullYear()} FIXORA ©
                <i className="fa-solid fa-car-burst" style={{ color: "red" }}></i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
