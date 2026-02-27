var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SpuriousAlertSchema = new Schema({
    dedupeKey: { type: String, unique: true, index: true, required: true },
    userId: Schema.Types.ObjectId,
    userEmail: String,
    userName: String,
    provider: String,
    activityRef: String,
    activityDate: String,
    ruleCode: String,
    severity: { type: String, default: 'medium' },
    observedValue: {},
    thresholdValue: {},
    details: String,
    status: { type: String, default: 'open' },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
    emailSentAt: Date,
    emailCount: { type: Number, default: 0 },
}, { strict: false });

SpuriousAlertSchema.index({ provider: 1, ruleCode: 1, lastSeenAt: -1 });
SpuriousAlertSchema.index({ userId: 1, lastSeenAt: -1 });

mongoose.model('SpuriousAlert', SpuriousAlertSchema);
