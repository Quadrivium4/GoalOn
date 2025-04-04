export const baseUrl =  process.env.NODE_ENV === 'development'? "http://" + window.location.hostname +":5000": process.env.NODE_ENV === "production"? process.env.REACT_APP_API_URL: "";
export const protectedUrl = baseUrl + "/protected";
export const assetsUrl = baseUrl + "/assets/users";
export const dayInMilliseconds = 1000 * 60* 60 *24
export const colors = {
    primary: "rgb(85, 199, 82)",
    error: "rgb(255, 40,40)"
}
export const todayDate = Date.now();
export const userColors = [
    "rgb(68, 48, 157)",
    "rgb(178, 121, 163)",
    "rgb(53, 162, 164)",
    "rgb(142, 153, 72)",
    "rgb(119, 43, 51)",
    "rgb(84, 146, 57)",
    "rgb(92 53 110)"
] 