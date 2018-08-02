const shell = require('shelljs');
shell.config.silent = true;
import logger from "./logger";

function setDebugMode(config) {
    shell.config.silent = !config.debug;
}

export function deleteRepoDirectory(config, data) {
    setDebugMode(config);
    const directoryName = data.directory;
    logger.logDeletingRepoDirectory(data.id, directoryName);
    shell.rm("-rf", directoryName);
}

export function downloadRepository(config, data) {

    function getArchiveLink() {
        let archiveLink = data.repository.archive_url;
        archiveLink = archiveLink.replace("{archive_format}", "tarball");
        return archiveLink.replace("{/ref}", `/${data.commit.id}`);
    }

    function getCommandToDownloadRepo() {
        return `curl -L ${getArchiveLink()} | tar xz --strip=1`
    }

    setDebugMode(config);
    const directoryName = data.directory;
    deleteRepoDirectory(config, data);
    logger.logDownloadingRepo(data.id, getArchiveLink(), directoryName);
    shell.mkdir(directoryName);
    shell.exec(getCommandToDownloadRepo(), {cwd: directoryName});
}

export function installDependencies(config, data) {
  setDebugMode(config);
  logger.logInstallingDependencies(data.id);
  shell.exec("npm install", {cwd: data.directory});
  config.dependencies.forEach(function(dependency) {
    shell.exec(`npm install ${dependency}`, {cwd: data.directory});
  });
}
