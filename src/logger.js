const timestamp = () => new Date().toISOString();

const logMessageReceived = data => {
  console.log(
    `[${data.id}] [${timestamp()}] Received repo :${
      data.repository.name
    }, Commit: ${data.commit.id}`
  );
};

const logSendingReports = id => {
  console.log(`\t [${id}] [${timestamp()}] Sending reports back`);
};

const logReportsSent = id => {
  console.log(`\t [${id}] [${timestamp()}] Reports sent`);
};

const logTaskCompleted = id => {
  console.log(`\t [${id}] [${timestamp()}] Task execution completed`);
};

const logTaskFailed = (id, e) => {
  console.error(
    `\t [${id}] [${timestamp()}] Error: Error while executing the task\n`
  );
  console.error('\t\t', e);
};

const logWaitingMessage = routingKey => {
  console.log(
    `[${timestamp()}] Waiting for ${routingKey} events. To exit press CTRL+C`
  );
};

const logDownloadingRepo = (id, link, directory) => {
  console.log(
    `\t [${id}] [${timestamp()}] Downloading repository from ${link} to ${directory}`
  );
};

const logDeletingRepoDirectory = (id, directory) => {
  console.log(
    `\t [${id}] [${timestamp()}] Deleting repository directory ${directory}`
  );
};

const logTaskStarted = id => {
  console.log(`\t [${id}] [${timestamp()}] Starting to execute task`);
};

const logSendingReportsFailed = (id, e) => {
  console.error(
    `\t [${id}] [${timestamp()}] Error: Error while sending reports back`
  );
  console.error('\t\t', e);
};

const logInstallingDependencies = id => {
  console.log(`\t [${id}] [${timestamp()}] Installing dependencies`);
};

const error = (e, data) => {
  console.error(`\t [${data.id}] [${timestamp()}] Error:`);
  console.error('\t\t', e);
};

const logNoDeleteOnDebug = (id, directory) => {
  console.log(
    `\t [${id}] [${timestamp()}] Debug Mode: ON, Not deleting the repository directory ${directory}`
  );
};

export default {
  logInstallingDependencies,
  logMessageReceived,
  logSendingReports,
  logReportsSent,
  logTaskCompleted,
  logTaskFailed,
  logWaitingMessage,
  logDeletingRepoDirectory,
  logNoDeleteOnDebug,
  logDownloadingRepo,
  logTaskStarted,
  logSendingReportsFailed,
  error
};
