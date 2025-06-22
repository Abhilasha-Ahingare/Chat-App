export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = `api/auth`;
export const SINGUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user`;
export const UPDATE_PROFILE = `${AUTH_ROUTES}/update-Profile`;
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/profile-image`;
export const REMOVE_PROFILE_IMAGE = `${AUTH_ROUTES}/remove-profile`;
export const LOGOUT_ROUTER = `${AUTH_ROUTES}/logout`;

export const CONTACT_ROUTE = `api/contacts`;
export const SEARCH_CONTACTS_ROUTE = `${CONTACT_ROUTE}/search`;
export const GET_CONTACTS_DM_LIST_ROUTE = `${CONTACT_ROUTE}/get-contacts`;
export const GET_ALL_CONTACTS_ROUTES = `${CONTACT_ROUTE}/get-all-contacts`;

export const USER_MESSAGES = `api/user`;
export const GET_MESSAGES_ROUTE = `${USER_MESSAGES}/get-messages`;
export const UPLOADS_FILE_ROUTE = `${USER_MESSAGES}/uploads-file`;

export const CHANNEL_ROUTE = `api/channel`;
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`;
