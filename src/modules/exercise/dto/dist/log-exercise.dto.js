"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LogExerciseDto = void 0;
var class_validator_1 = require("class-validator");
var LogExerciseDto = /** @class */ (function () {
    function LogExerciseDto() {
    }
    __decorate([
        class_validator_1.IsBoolean({ message: 'O valor deve ser verdadeiro ou falso.' })
    ], LogExerciseDto.prototype, "didExercise");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.Min(1),
        class_validator_1.IsOptional()
    ], LogExerciseDto.prototype, "durationMinutes");
    __decorate([
        class_validator_1.IsISO8601({ strict: true }, { message: 'A data deve estar no formato ISO-8601 válido.' })
    ], LogExerciseDto.prototype, "loggedAt");
    return LogExerciseDto;
}());
exports.LogExerciseDto = LogExerciseDto;
