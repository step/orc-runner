import logger from "./logger";
const request = require("request");

export default function (sauron, data, report) {

    function handleResponse(response) {
        if (response.statusCode === 200) {
            logger.logReportsSent(data.id);
        } else {
            const error = new Error(`${response.statusCode} - ${response.statusMessage}`);
            logger.logSendingReportsFailed(data.id, error);
        }
    }

    function handleError(error) {
        logger.logSendingReportsFailed(data.id, error);
    }

    function postReports() {
        request.post({
            url: sauron.postReportsUrl,
            json: report
        }).on('error', handleError).on('response', handleResponse);
    }

    logger.logSendingReports(data.id);
    postReports();
}