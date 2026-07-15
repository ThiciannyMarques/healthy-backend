"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SocialLoginDto = void 0;
var class_validator_1 = require("class-validator");
var SocialLoginDto = /** @class */ (function () {
    function SocialLoginDto() {
    }
    __decorate([
        class_validator_1.IsEnum(['google', 'apple'], {
            message: 'O provedor deve ser google ou apple.'
        }),
        class_validator_1.IsNotEmpty()
    ], SocialLoginDto.prototype, "provider");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty({ message: 'O ID do provedor é obrigatório.' })
    ], SocialLoginDto.prototype, "providerId");
    __decorate([
        class_validator_1.IsEmail({}, { message: 'E-mail inválido.' }),
        class_validator_1.IsNotEmpty()
    ], SocialLoginDto.prototype, "email");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], SocialLoginDto.prototype, "name");
    return SocialLoginDto;
}());
exports.SocialLoginDto = SocialLoginDto;
