"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MailService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
var MailService = /** @class */ (function () {
    function MailService() {
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = null;
        var host = process.env.SMTP_HOST;
        var port = process.env.SMTP_PORT;
        var user = process.env.SMTP_USER;
        var pass = process.env.SMTP_PASS;
        if (host && port && user && pass) {
            this.transporter = nodemailer.createTransport({
                host: host,
                port: parseInt(port, 10),
                secure: parseInt(port, 10) === 465,
                auth: { user: user, pass: pass }
            });
            this.logger.log('Serviço de e-mail SMTP real inicializado.');
        }
        else {
            this.logger.warn('Credenciais SMTP ausentes. O sistema rodará em MODO SIMULADO de envio de e-mails.');
        }
    }
    MailService_1 = MailService;
    MailService.prototype.sendResetPasswordEmail = function (email, token) {
        return __awaiter(this, void 0, Promise, function () {
            var resetUrl, subject, textContent, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resetUrl = "healthy://reset-password?token=" + token;
                        subject = 'Recuperação de Senha - Healthy App';
                        textContent = "Voc\u00EA solicitou a recupera\u00E7\u00E3o de sua senha. Use o seguinte token para redefini-la no aplicativo: " + token + "\n\nOu clique no link para abrir o app: " + resetUrl;
                        if (!this.transporter) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.transporter.sendMail({
                                from: "\"Healthy Team\" <" + (process.env.SMTP_FROM || 'no-reply@healthy.app') + ">",
                                to: email,
                                subject: subject,
                                text: textContent
                            })];
                    case 2:
                        _a.sent();
                        this.logger.log("E-mail de recupera\u00E7\u00E3o enviado com sucesso para: " + email);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error("Falha ao enviar e-mail real de recupera\u00E7\u00E3o para " + email, error_1);
                        throw new Error('Falha ao enviar e-mail de recuperação.');
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.logger.warn('=== [SIMULAÇÃO DE ENVIO DE E-MAIL] ===');
                        this.logger.warn("Para: " + email);
                        this.logger.warn("Assunto: " + subject);
                        this.logger.warn("Token: " + token);
                        this.logger.warn("Link (Deep Link): " + resetUrl);
                        this.logger.warn('======================================');
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    var MailService_1;
    MailService = MailService_1 = __decorate([
        common_1.Injectable()
    ], MailService);
    return MailService;
}());
exports.MailService = MailService;
