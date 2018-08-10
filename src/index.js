import logger from "./logger";
import rabbitMQListener from "./rabbitMQ_listener";
import repositoryHandlerGenerator from "./repository_handler";
import reportHandlerGenerator from "./report_handler";
import parserGenerator from "./parser";

const start = (config, task) => {
    const parser = parserGenerator(config, logger);
    const repositoryHandler = repositoryHandlerGenerator(config, logger);
    const reportHandler = reportHandlerGenerator(config, logger);

    const onMessageReceived = (message) => {
        let data = {};

        const setData = (d) => {
            logger.logMessageReceived(d);
            data = d;
        };

        const downloadRepo = () => {
            repositoryHandler.download(data);
        };

        const installDependencies = () => {
            repositoryHandler.installDependencies(data);
        };

        const runTask = () => {
            logger.logTaskStarted(data.id);
            return task(data,config.task);
        };

        const generateReportForSuccess = (results) => {
            logger.logTaskCompleted(data.id);
            return reportHandler.generateOnSuccess(data, results);
        };

        const sendReport = (report) => {
            reportHandler.send(data, report);
        };

        const removeRepoDir = () => {
            repositoryHandler.remove(data);
        };

        const generateReportForFailure = (e) => {
            logger.logTaskFailed(data.id, e);
            return reportHandler.generateOnFailure(data, e);
        };

        const onError = (error) => {
            logger.error(error, data);
        };

        parser.parse(message)
            .then(setData)
            .then(downloadRepo)
            .then(installDependencies)
            .then(runTask)
            .then(generateReportForSuccess, generateReportForFailure)
            .then(sendReport)
            .catch(onError)
            .then(removeRepoDir);
    };

    rabbitMQListener(config.rabbitMQ, onMessageReceived);
};

export {start}
