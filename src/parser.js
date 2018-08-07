export default (config, logger) => {
    const addExtraData = (data) => {
        return Object.assign(data, {
            directory: `./repos/${data.id}`,
            job: {
                start_time: new Date().toISOString()
            }
        });
    };

    const parse = (message) => {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.parse(message);
                resolve(addExtraData(data));
            } catch (e) {
                reject(e);
            }
        });
    };

    return {parse}
};