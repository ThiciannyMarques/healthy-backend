"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateProfileDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateProfileDto = /** @class */ (function () {
    function UpdateProfileDto() {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional(),
        class_validator_1.MaxLength(255)
    ], UpdateProfileDto.prototype, "name");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], UpdateProfileDto.prototype, "timezone");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], UpdateProfileDto.prototype, "avatarUrl");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.Min(500, { message: 'A meta de hidratação mínima é 500ml.' }),
        class_validator_1.IsOptional()
    ], UpdateProfileDto.prototype, "dailyHydrationGoal");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional(),
        class_validator_1.MaxLength(100)
    ], UpdateProfileDto.prototype, "petName");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional(),
        class_validator_1.MaxLength(50)
    ], UpdateProfileDto.prototype, "petStatus");
    return UpdateProfileDto;
}());
exports.UpdateProfileDto = UpdateProfileDto;
