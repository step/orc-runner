const shell = require('shelljs');
shell.config.silent = true;
import logger from "./logger";

export function deleteRepoDirectory(data) {
    const directoryName = data.directory;
    logger.logDeletingRepoDirectory(data.id, directoryName);
    shell.rm("-rf", directoryName);
}

export function downloadRepository(data) {

    function getArchiveLink() {
        let archiveLink = data.repository.archive_url;
        archiveLink = archiveLink.replace("{archive_format}", "tarball");
        return archiveLink.replace("{/ref}", `/${data.commit.id}`);
    }

    function getCommandToDownloadRepo() {
        return `curl -L ${getArchiveLink()} | tar xz --strip=1`
    }

    const directoryName = data.directory;
    deleteRepoDirectory(data);
    logger.logDownloadingRepo(data.id, getArchiveLink(), directoryName);
    shell.mkdir(directoryName);
    shell.exec(getCommandToDownloadRepo(), {cwd: directoryName});
}