import request from "request";

export default (config, logger) => {

    const send = (data, report) => {
        const handleResponse = (response) => {
            if (response.statusCode === 200) {
                logger.logReportsSent(data.id);
            } else {
                const error = new Error(`${response.statusCode} - ${response.statusMessage}`);
                logger.logSendingReportsFailed(data.id, error);
            }
        };

        const handleError = (error) => {
            logger.logSendingReportsFailed(data.id, error);
        };

        const postReports = () => {
            request.post({
                url: config.sauron.postReportsUrl,
                json: report
            }).on('error', handleError).on('response', handleResponse);
        };

        logger.logSendingReports(data.id);
        postReports();
    };

    const getJobDetails = (status, results, error) => {
        return {
            name: config.job.name,
            status: status,
            end_time: new Date().toISOString(),
            results: results,
            error: error
        };
    };

    const generateOnSuccess = (data, taskResults) => {
        const jobDetails = Object.assign(data.job, getJobDetails("SUCCESS", taskResults, null));
        return Object.assign(data, {job: jobDetails});
    };

    const generateOnFailure = (data, error) => {
        const jobDetails = Object.assign(data.job, getJobDetails("FAILED", null, error));
        return Object.assign(data, {job: jobDetails});
    };

    return {send, generateOnSuccess, generateOnFailure}
}