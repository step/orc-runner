
function currentDateTimeString() {
    return new Date().toISOString();
}


export function generateSuccessReports(job, data, taskResults) {
    const jobDetails = Object.assign(data.job, {
        name: job.name,
        status: "SUCCESS",
        end_time: currentDateTimeString(),
        results: taskResults
    });
    return Object.assign(data, {job: jobDetails});
}

export function generateFailedReports(job, data, error) {
    const jobDetails = Object.assign(data.job, {
        name: job.name,
        status: "FAILED",
        end_time: currentDateTimeString(),
        error: error
    });
    return Object.assign(data, {job: jobDetails});
}
