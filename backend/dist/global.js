import path from "path";
Error.stackTraceLimit = 1;
Error.prepareStackTrace = (_, callSites) => {
    console.log(_);
    let stack = [];
    callSites.forEach(call => {
        stack.push({
            file: path.basename(call.getFileName()),
            function: call.getFunctionName(),
            line: call.getLineNumber(),
            path: call.getFileName(),
        });
        console.log(call.getFileName());
    });
    return stack;
};
class AppError extends Error {
    errorCode;
    constructor(errorCode, message) {
        super(message);
        //Error.captureStackTrace(this, AppError);
        this.errorCode = errorCode;
    }
}
//# sourceMappingURL=global.js.map