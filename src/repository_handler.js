const shell = require('shelljs');
shell.config.silent = true;
import logger from "./logger";

export function deleteRepoDirectory(data) {
    const directoryName = data.directory;
    logger.logDeletingRepoDirectory(data.uniqueId, directoryName);
    shell.rm("-rf", directoryName);
}

export function downloadRepository(data) {

    function getArchiveLink() {
        let archiveLink = data.git.repository.archive_url;
        archiveLink = archiveLink.replace("{archive_format}", "tarball");
        return archiveLink.replace("{/ref}", `/${data.git.commit.id}`);
    }

    function getCommandToDownloadRepo() {
        return `curl -L ${getArchiveLink()} | tar xz --strip=1`
    }

    const directoryName = data.directory;
    deleteRepoDirectory(data);
    logger.logDownloadingRepo(data.uniqueId, getArchiveLink(), directoryName);
    shell.mkdir(directoryName);
    shell.exec(getCommandToDownloadRepo(), {cwd: directoryName});
}