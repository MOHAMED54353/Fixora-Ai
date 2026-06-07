const Pagination = ({ pageIndex, totalPages, onPageChange }) => {
    const getPages = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, pageIndex - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">

            {/* Previous */}
            <button
                className="btn btn-light border rounded-3 px-3"
                disabled={pageIndex === 1}
                onClick={() => onPageChange(pageIndex - 1)}
            >
                ‹
            </button>

            {/* First Page + dots */}
            {pages[0] > 1 && (
                <>
                    <button
                        className="btn btn-light border rounded-3 px-3"
                        onClick={() => onPageChange(1)}
                    >
                        1
                    </button>
                    {pages[0] > 2 && <span className="px-2">...</span>}
                </>
            )}

            {/* Page Numbers */}
            {pages.map((page) => (
                <button
                    key={page}
                    className={`btn rounded-3 px-3 ${page === pageIndex
                            ? "btn-primary text-white"
                            : "btn-light border"
                        }`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {/* Last Page + dots */}
            {pages[pages.length - 1] < totalPages && (
                <>
                    {pages[pages.length - 1] < totalPages - 1 && (
                        <span className="px-2">...</span>
                    )}
                    <button
                        className="btn btn-light border rounded-3 px-3"
                        onClick={() => onPageChange(totalPages)}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next */}
            <button
                className="btn btn-light border rounded-3 px-3"
                disabled={pageIndex === totalPages}
                onClick={() => onPageChange(pageIndex + 1)}
            >
                ›
            </button>
        </div>
    );
};

export default Pagination;