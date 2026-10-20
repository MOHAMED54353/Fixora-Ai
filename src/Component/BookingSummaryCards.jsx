
// بيوحّد التقييم لأنه كان جاي بشكلين مختلفين في الصفحتين:
// BookingStatus بيستخدم booking.technicianRate
// BookingStatusDetails بيستخدم booking.review?.technicianRating
const getTechnicianRating = (booking) =>
    booking.technicianRate ?? booking.review?.technicianRating ?? null

const BookingSummaryCards = ({ booking, technicianTitle = "بيانات الفني" }) => {
    const rating = getTechnicianRating(booking)

    return (
        <>
            <div className='d-flex flex-column flex-md-row justify-content-around align-items-start gap-3 mb-5'>
                <div
                    className='d-flex flex-column shadow-sm'
                    style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", minHeight: "150px", borderRadius: "16px" }}
                >
                    <h4 className='mb-3'>بيانات السيارة</h4>
                    <div className='d-flex align-items-center gap-3'>
                        <img src="/Frame 429.jpg" alt="" style={{ width: "80px", maxWidth: "100%", height: "auto" }} />
                        <div>
                            <p className='mb-1'>{booking.brand} {booking.model}</p>
                            <p className='mb-1'>رقم اللوحة: {booking.plateNumber}</p>
                        </div>
                    </div>
                </div>

                <div
                    className='d-flex flex-column shadow-sm'
                    style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "1.5rem", minHeight: "150px", borderRadius: "16px" }}
                >
                    <h4 className='mb-3'>{technicianTitle}</h4>
                    <div className='d-flex align-items-center gap-3'>
                        <img src="/wrapper.png" alt="" style={{ width: "80px", maxWidth: "100%", height: "auto" }} />
                        <div>
                            <h5 className="mb-1">
                                {booking.technicianName?.trim() ||
                                    (booking.status === "Pending" ? "لم يتم تعيين فني بعد" : "غير محدد")}
                            </h5>
                            <p className='mb-1'>التخصص: {booking.technicianSpecialization || "غير محدد"}</p>
                            <p className='mb-1'>
                                <i className="fa-solid fa-star" style={{ color: "#FFD700" }}></i> {rating ?? "لا يوجد تقييم"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookingSummaryCards