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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var argon2 = require("argon2");
var crypto_1 = require("crypto");
var AuthService = /** @class */ (function () {
    function AuthService(usersService, jwtService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    AuthService.prototype.register = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var passwordHash, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, argon2.hash(dto.password)];
                    case 1:
                        passwordHash = _a.sent();
                        return [4 /*yield*/, this.usersService.create(dto.email, passwordHash, dto.name)];
                    case 2:
                        user = _a.sent();
                        if (!user.profile) {
                            throw new common_1.InternalServerErrorException('Erro interno ao gerar o perfil do usuário.');
                        }
                        return [2 /*return*/, this.generateAuthResponse(user)];
                }
            });
        });
    };
    AuthService.prototype.login = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, isPasswordValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findByEmail(dto.email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Credenciais inválidas.');
                        }
                        return [4 /*yield*/, argon2.verify(user.passwordHash, dto.password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new common_1.UnauthorizedException('Credenciais inválidas.');
                        }
                        if (!user.profile) {
                            throw new common_1.UnauthorizedException('Este utilizador não possui um perfil ativo.');
                        }
                        return [2 /*return*/, this.generateAuthResponse(user)];
                }
            });
        });
    };
    AuthService.prototype.socialLogin = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, randomPassword, passwordHash, defaultName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findByEmail(dto.email)];
                    case 1:
                        user = _a.sent();
                        if (!!user) return [3 /*break*/, 4];
                        randomPassword = crypto_1.randomUUID() + crypto_1.randomUUID();
                        return [4 /*yield*/, argon2.hash(randomPassword)];
                    case 2:
                        passwordHash = _a.sent();
                        defaultName = dto.name ||
                            (dto.provider === 'apple' ? 'Usuário Apple' : 'Usuário Convidado');
                        return [4 /*yield*/, this.usersService.create(dto.email, passwordHash, defaultName)];
                    case 3:
                        user = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!user.profile) {
                            throw new common_1.UnauthorizedException('Este utilizador não possui um perfil ativo.');
                        }
                        return [2 /*return*/, this.generateAuthResponse(user)];
                }
            });
        });
    };
    AuthService.prototype.forgotPassword = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, token, expires;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findByEmail(dto.email)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 4];
                        token = Math.floor(100000 + Math.random() * 900000).toString();
                        expires = new Date();
                        expires.setHours(expires.getHours() + 1);
                        return [4 /*yield*/, this.usersService.updateResetToken(user.id, token, expires)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.mailService.sendResetPasswordEmail(user.email, token)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            message: 'Se o e-mail estiver cadastrado, um token de redefinição foi enviado.'
                        }];
                }
            });
        });
    };
    AuthService.prototype.resetPassword = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var user, newPasswordHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersService.findByResetToken(dto.token)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Token inválido ou expirado.');
                        }
                        return [4 /*yield*/, argon2.hash(dto.newPassword)];
                    case 2:
                        newPasswordHash = _a.sent();
                        return [4 /*yield*/, this.usersService.updatePassword(user.id, newPasswordHash)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { message: 'Senha redefinida com sucesso!' }];
                }
            });
        });
    };
    AuthService.prototype.generateAuthResponse = function (user) {
        var payload = {
            sub: user.id,
            email: user.email,
            profileId: user.profile.id
        };
        var accessToken = this.jwtService.sign(payload);
        return {
            accessToken: accessToken,
            user: {
                id: user.id,
                email: user.email,
                profile: {
                    id: user.profile.id,
                    name: user.profile.name,
                    streakDays: user.profile.streakDays,
                    currentXp: user.profile.currentXp
                }
            }
        };
    };
    AuthService = __decorate([
        common_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
