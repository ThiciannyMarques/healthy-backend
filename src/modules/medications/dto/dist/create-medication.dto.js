"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateMedicationDto = void 0;
var class_validator_1 = require("class-validator");
var CreateMedicationDto = /** @class */ (function () {
    function CreateMedicationDto() {
    }
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty({ message: 'O nome do medicamento é obrigatório.' })
    ], CreateMedicationDto.prototype, "name");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsNotEmpty({ message: 'A dosagem é obrigatória (ex: 1 comprimido, 500mg).' })
    ], CreateMedicationDto.prototype, "dosage");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.Min(0, { message: 'O stock não pode ser negativo.' })
    ], CreateMedicationDto.prototype, "stockCount");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: 'O horário deve estar no formato HH:MM (ex: 08:00, 22:30).'
        })
    ], CreateMedicationDto.prototype, "timeOfDay");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateMedicationDto.prototype, "color");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateMedicationDto.prototype, "icon");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateMedicationDto.prototype, "frequency");
    return CreateMedicationDto;
}());
exports.CreateMedicationDto = CreateMedicationDto;
