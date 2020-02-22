import route from "riot-route"

const query = () => {
    const query = route.query();
    return query;
}

export {
    query,
}