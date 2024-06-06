export const parseMovieType = (type) => {
    switch (type) {
        case "PHIM_BO":
            return "Phim bộ"
        case "PHIM_LE":
            return "Phim lẻ"
        case "PHIM_CHIEU_RAP":
            return "Phim chiếu rạp"
        default:
            return "Không xác định";
    }
}