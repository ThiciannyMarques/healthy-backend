"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LogWeightDto = void 0;
var class_validator_1 = require("class-validator");
var LogWeightDto = /** @class */ (function () {
    function LogWeightDto() {
    }
    __decorate([
        class_validator_1.IsNumber({}, { message: 'O peso deve ser um número válido.' }),
        class_validator_1.Min(1, { message: 'O peso deve ser maior que 0.' })
    ], LogWeightDto.prototype, "weightKg");
    __decorate([
        class_validator_1.IsISO8601({ strict: true }, { message: 'A data deve estar no formato ISO-8601 válido.' })
    ], LogWeightDto.prototype, "loggedAt");
    return LogWeightDto;
}());
exports.LogWeightDto = LogWeightDto;
