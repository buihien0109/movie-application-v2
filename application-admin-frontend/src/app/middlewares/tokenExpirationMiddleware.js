import { auth2Api } from "../services/auth2.service";
import { logout } from "../slices/auth.slice";


export const checkStatusMiddleware = ({ dispatch }) => (next) => (action) => {
    if (action.type.endsWith('rejected')) {
        const { payload, error } = action;
        if (error && payload.status === 401) {
            dispatch(logout())
            dispatch(auth2Api.endpoints.logoutApi.initiate());
        }
    }
    return next(action);
};