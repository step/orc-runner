import logger from "./logger";
import rabbitMQListener from "./rabbitMQ_listener";
import {downloadRepository, deleteRepoDirectory, installDependencies} from "./repository_handler";
import sendReport from "./reports_adaptor";
import {generateSuccessReports, generateFailedReports} from "./reports_handler";

function start(config, task) {
    function parseMessage(message) {
        return new Promise(function (resolve, reject) {
            try {
                let data = JSON.parse(message);
                resolve(addExtraData(data));
            } catch (e) {
                reject(e);
            }
        });
    }

    function addExtraData(data) {
        return Object.assign(data, {
            directory: `./repos/${data.id}`,
            job: {
                start_time: new Date().toISOString()
            }
        });
    }

    function onMessageReceived(message) {
        parseMessage(message)
            .then(performTask, logger.logParsingError);
    }

    function onTaskCompleted(data, results) {
        logger.logTaskCompleted(data.id);
        deleteRepoDirectory(data);
        const report = generateSuccessReports(config.job, data, results);
        sendReport(config.sauron, data, report);
    }

    function onTaskError(data, e) {
        deleteRepoDirectory(data);
        logger.logTaskFailed(data.id, e);
        const report = generateFailedReports(config.job, data, e);
        sendReport(config.sauron, data, report)
    }

    function performTask(data) {
        logger.logMessageReceived(data);
        downloadRepository(data);
        installDependencies(config.dependencies, data);
        logger.logTaskStarted(data.id);
        task(data)
            .then(onTaskCompleted.bind(null, data), onTaskError.bind(null, data));
    }


    rabbitMQListener(config.rabbitMQ, onMessageReceived);
}

export {start}
