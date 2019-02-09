"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var yup = require("yup");
var convector_core_controller_1 = require("@worldsibu/convector-core-controller");
var convector_core_storage_1 = require("@worldsibu/convector-core-storage");
var participant_model_1 = require("./participant.model");
var fabric_shim_1 = require("fabric-shim");
var ParticipantController = (function (_super) {
    tslib_1.__extends(ParticipantController, _super);
    function ParticipantController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ParticipantController.prototype, "fullIdentity", {
        get: function () {
            var stub = convector_core_storage_1.BaseStorage.current.stubHelper;
            return new fabric_shim_1.ClientIdentity(stub.getStub());
        },
        enumerable: true,
        configurable: true
    });
    ;
    ParticipantController.prototype.register = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var existing, participant;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, participant_model_1.Participant.getOne(id)];
                    case 1:
                        existing = _a.sent();
                        if (!(!existing || !existing.id)) return [3, 3];
                        participant = new participant_model_1.Participant();
                        participant.id = id;
                        participant.name = id;
                        participant.msp = this.fullIdentity.getMSPID();
                        participant.identities = [{
                                fingerprint: this.sender,
                                status: true
                            }];
                        console.log(JSON.stringify(participant));
                        return [4, participant.save()];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3: throw new Error('Identity exists already, please call changeIdentity fn for updates');
                    case 4: return [2];
                }
            });
        });
    };
    ParticipantController.prototype.changeIdentity = function (id, newIdentity) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var isAdmin, requesterMSP, existing;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isAdmin = this.fullIdentity.getAttributeValue('admin');
                        console.log(this.fullIdentity);
                        console.log(isAdmin);
                        requesterMSP = this.fullIdentity.getMSPID();
                        return [4, participant_model_1.Participant.getOne(id)];
                    case 1:
                        existing = _a.sent();
                        console.log('Existing participant:');
                        console.log(existing);
                        if (!existing || !existing.id) {
                            throw new Error('No identity exists with that ID');
                        }
                        console.log("existing.msp=" + existing.msp + " requesterMSP=" + requesterMSP);
                        if (existing.msp != requesterMSP) {
                            throw new Error('Unathorized. MSPs do not match');
                        }
                        console.log("isAdmin=" + isAdmin);
                        if (!isAdmin) {
                            throw new Error('Unathorized. Requester identity is not an admin');
                        }
                        existing.identities = existing.identities.map(function (identity) {
                            identity.status = false;
                            return identity;
                        });
                        existing.identities.push({
                            fingerprint: newIdentity,
                            status: true
                        });
                        return [4, existing.save()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ParticipantController.prototype.get = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var existing;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, participant_model_1.Participant.getOne(id)];
                    case 1:
                        existing = _a.sent();
                        if (!existing || !existing.id) {
                            throw new Error("No identity exists with that ID " + id);
                        }
                        return [2, existing];
                }
            });
        });
    };
    tslib_1.__decorate([
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], ParticipantController.prototype, "register", null);
    tslib_1.__decorate([
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string())),
        tslib_1.__param(1, convector_core_controller_1.Param(yup.string()))
    ], ParticipantController.prototype, "changeIdentity", null);
    tslib_1.__decorate([
        convector_core_controller_1.Invokable(),
        tslib_1.__param(0, convector_core_controller_1.Param(yup.string()))
    ], ParticipantController.prototype, "get", null);
    ParticipantController = tslib_1.__decorate([
        convector_core_controller_1.Controller('participant')
    ], ParticipantController);
    return ParticipantController;
}(convector_core_controller_1.ConvectorController));
exports.ParticipantController = ParticipantController;
//# sourceMappingURL=participant.controller.js.map