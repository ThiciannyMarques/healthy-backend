"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LogMedicationDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var LogMedicationDto = /** @class */ (function () {
    function LogMedicationDto() {
    }
    __decorate([
        class_validator_1.IsEnum(client_1.MedicationStatus, {
            message: 'Status inválido. Use TAKEN, SKIPPED ou MISSED.'
        }),
        class_validator_1.IsNotEmpty()
    ], LogMedicationDto.prototype, "status");
    __decorate([
        class_validator_1.IsISO8601({ strict: true }, { message: 'A data deve ser num formato ISO-8601 válido.' }),
        class_validator_1.IsNotEmpty()
    ], LogMedicationDto.prototype, "loggedAt");
    return LogMedicationDto;
}());
exports.LogMedicationDto = LogMedicationDto;
