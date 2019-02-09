"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_model_1 = require("@worldsibu/convector-core-model");
exports.x509Identities = yup.object().shape({
    status: yup.boolean().required(),
    fingerprint: yup.string().required()
});
var Participant = (function (_super) {
    tslib_1.__extends(Participant, _super);
    function Participant() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'io.worldsibu.examples.participant';
        return _this;
    }
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly()
    ], Participant.prototype, "type", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Required(),
        convector_core_model_1.Validate(yup.string())
    ], Participant.prototype, "name", void 0);
    tslib_1.__decorate([
        convector_core_model_1.ReadOnly(),
        convector_core_model_1.Validate(yup.string())
    ], Participant.prototype, "msp", void 0);
    tslib_1.__decorate([
        convector_core_model_1.Validate(yup.array(exports.x509Identities))
    ], Participant.prototype, "identities", void 0);
    return Participant;
}(convector_core_model_1.ConvectorModel));
exports.Participant = Participant;
//# sourceMappingURL=participant.model.js.map