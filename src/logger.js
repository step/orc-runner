function timestamp() {
    return new Date().toISOString();
}

function logParsingError(e) {
    console.error(`[${timestamp()}] Error: Error while parsing message from RabbitMQ\n`);
    console.error("\t", e);
}

function logMessageReceived(data) {
    console.log(`[${data.id}] [${timestamp()}] Received repo :${data.repository.name}, Commit: ${data.commit.id}`);
}

function logSendingReports(id) {
    console.log(`\t [${id}] [${timestamp()}] Sending reports back`);
}

function logReportsSent(id) {
    console.log(`\t [${id}] [${timestamp()}] Reports sent`)
}

function logTaskCompleted(id) {
    console.log(`\t [${id}] [${timestamp()}] Task execution completed`);
}

function logTaskFailed(id, e) {
    console.error(`\t [${id}] [${timestamp()}] Error: Error while executing the task\n`);
    console.error("\t\t", e);
}

function logWaitingMessage(routingKey) {
    console.log(`[${timestamp()}] Waiting for ${routingKey} events. To exit press CTRL+C`);
}

function logDownloadingRepo(id, link, directory) {
    console.log(`\t [${id}] [${timestamp()}] Downloading repository from ${link} to ${directory}`)
}

function logDeletingRepoDirectory(id, directory) {
    console.log(`\t [${id}] [${timestamp()}] Deleting repository directory ${directory}`)
}

function logTaskStarted(id) {
    console.log(`\t [${id}] [${timestamp()}] Starting to execute task`)
}

function logSendingReportsFailed(id, e) {
    console.error(`\t [${id}] [${timestamp()}] Error: Error while sending reports back`)
    console.error("\t\t", e);
}

function logInstallingDependencies(id) {
  console.log(`\t [${id}] [${timestamp()}] Installing dependencies`)
}

export default {
    logParsingError,
    logInstallingDependencies,
    logMessageReceived,
    logSendingReports,
    logReportsSent,
    logTaskCompleted,
    logTaskFailed,
    logWaitingMessage,
    logDeletingRepoDirectory,
    logDownloadingRepo,
    logTaskStarted,
    logSendingReportsFailed
}
