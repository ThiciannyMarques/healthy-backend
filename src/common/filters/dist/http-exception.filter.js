"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GlobalExceptionFilter = void 0;
var common_1 = require("@nestjs/common");
var GlobalExceptionFilter = /** @class */ (function () {
    function GlobalExceptionFilter() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    GlobalExceptionFilter_1 = GlobalExceptionFilter;
    GlobalExceptionFilter.prototype["catch"] = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        var status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        var message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : 'Internal server error';
        this.logger.error("Status: " + status + " Path: " + request.url, exception instanceof Error ? exception.stack : String(exception));
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: typeof message === 'string'
                ? message
                : message.message || message
        });
    };
    var GlobalExceptionFilter_1;
    GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
        common_1.Catch()
    ], GlobalExceptionFilter);
    return GlobalExceptionFilter;
}());
exports.GlobalExceptionFilter = GlobalExceptionFilter;
