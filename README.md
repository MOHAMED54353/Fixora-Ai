# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



    const brand = car.Brand || car.brand || "غير معروف";
    const model = car.Model || car.model || "";
    const year = car.Year || car.year || "";
    const plate = car.PlateNumber || car.plateNumber || car.Plate || car.plate || "غير محدد";
    const lastService = car.LastService || car.lastService || "لم يتم";
    const nextService = car.NextService || car.nextService || "غير محدد";
    const img = car.Image || car.image || car.Img || car.img || null;

                  <select
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className={`form-control ${errors.specialization ? "is-invalid" : ""}`}
                disabled={isSubmitting}
                style={{
                  appearance: "auto",
                  WebkitAppearance: "auto",
                  color: formData.specialization ? "#333" : "#A9A9A9",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <option value="">اختر التخصص</option>
                <option value="ميكانيكا سيارات">🔧 ميكانيكا سيارات</option>
                <option value="كهرباء سيارات">⚡ كهرباء سيارات</option>
                <option value="تكييف سيارات">❄️ تكييف سيارات</option>
                <option value="دهان وسمكرة">🎨 دهان وسمكرة</option>
                <option value="صيانة فرامل وتعليق">🛑 صيانة فرامل وتعليق</option>
                <option value="صيانة البطاريات">🔋 صيانة البطاريات</option>
                <option value="صيانة إطارات وتوازن">🛞 صيانة إطارات وتوازن</option>
                <option value="تشخيص أعطال">🔍 تشخيص أعطال</option>
                <option value="صيانة محركات وناقل الحركة">⚙️ صيانة محركات وناقل الحركة</option>
                <option value="تركيب زجاج أو إكسسوارات">🪟 تركيب زجاج أو إكسسوارات</option>
              </select>


               style={{
                                ,}}



                                {img ? (
                    <img
                        src={img}
                        alt={`صورة ${brand}`}
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#F6F7FB",
                            borderRadius: "8px",
                        }}
                    >
                        <FaCar size={50} color="#9a9b9d" />
                    </div>
                )}
