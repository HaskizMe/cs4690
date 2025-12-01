import { api } from "../api";

export const getCourses = async ({ all }: { all?: boolean }) => {
    const response = await api.get("/courses", {
        params: {
            all,
        },
    });
    return response.data;
};
