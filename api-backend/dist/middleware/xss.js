import xss from "xss";
const sanitize = (obj) => {
    const options = {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
    };
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = xss(obj[key], options);
        }
        else if (typeof obj[key] === "object") {
            obj[key] = sanitize(obj[key]);
        }
    }
    return obj;
};
const xssMiddleware = (req, res, next) => {
    if (req.body) {
        req.body = sanitize(req.body);
    }
    next();
};
export default xssMiddleware;
