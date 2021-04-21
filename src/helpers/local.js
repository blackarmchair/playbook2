const set = (label, value) => {
    try {
        localStorage.setItem(label, JSON.stringify(value));
        return value;
    } catch (e) {
        return e;
    }
};
const read = (label) => {
    try {
        return JSON.parse(localStorage.getItem(label));
    } catch (e) {
        return e;
    }
};
const remove = (label) => {
    try {
        const item = read(label);
        localStorage.removeItem(label);
        return item;
    } catch (e) {
        return e;
    }
};

const getRosters = () => {
    try {
        const local = window.localStorage;
        return Object.keys(local)
            .filter((key) => local[key].includes("teamId"))
            .map((key) => JSON.parse(local[key]));
    } catch (e) {
        console.log(e);
        return [];
    }
};

const LOCAL = {
    set,
    read,
    remove,
    getRosters,
};
export default LOCAL;
