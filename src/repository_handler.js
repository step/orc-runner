import shell from "shelljs";

const getArchiveLink = (data) => {
    let archiveLink = data.repository.archive_url;
    archiveLink = archiveLink.replace("{archive_format}", "tarball");
    return archiveLink.replace("{/ref}", `/${data.commit.id}`);
};

const getCommandToDownloadRepo = (data) => {
    return `curl -L ${getArchiveLink(data)} | tar xz --strip=1`
};

const downloadRepository = (data, logger) => {
    const directoryName = data.directory;
    deleteRepoDirectory(data, logger);
    logger.logDownloadingRepo(data.id, getArchiveLink(data), directoryName);
    shell.mkdir(directoryName);
    shell.exec(getCommandToDownloadRepo(data), {cwd: directoryName});
};

const deleteRepoDirectory = (data, logger) => {
    const directoryName = data.directory;
    logger.logDeletingRepoDirectory(data.id, directoryName);
    shell.rm("-rf", directoryName);
};

export default (config, logger) => {
    shell.config.silent = !config.debug;

    const download = (data) => {
        downloadRepository(data, logger);
    };

    const remove = (data) => {
        if (config.debug) {
            logger.logNoDeleteOnDebug(data.id, data.directory)
        } else {
            deleteRepoDirectory(data, logger);
        }
        return data;
    };

    const installDependencies = (data) => {
        logger.logInstallingDependencies(data.id);
        shell.exec("npm install", {cwd: data.directory});
        const dependencies = config.dependencies || [];
        dependencies.forEach((dependency) => {
            shell.exec(`npm install ${dependency}`, {cwd: data.directory});
        });
    };

    return {
        remove,
        download,
        installDependencies
    };
};