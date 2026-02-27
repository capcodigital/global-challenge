var mongoose = require('mongoose');
var mailer = require('./mail.service');

var DEFAULT_RECIPIENT = 'challenge@capco.com';
var EMAIL_COOLDOWN_HOURS = parseInt(process.env.SPURIOUS_ALERT_EMAIL_COOLDOWN_HOURS || '24', 10);
var MAX_ACTIVITY_DISTANCE_KM = parseFloat(process.env.SPURIOUS_MAX_ACTIVITY_DISTANCE_KM || '50');
var MAX_DAILY_DISTANCE_KM = parseFloat(process.env.SPURIOUS_MAX_DAILY_DISTANCE_KM || '30');
var MAX_SPEED_KMH = parseFloat(process.env.SPURIOUS_MAX_SPEED_KMH || '40');
var EMAIL_MIN_SEVERITY = (process.env.SPURIOUS_EMAIL_MIN_SEVERITY || 'high').toLowerCase();

var severityRank = {
    low: 1,
    medium: 2,
    high: 3,
};

function getSpuriousAlertModel() {
    return mongoose.model('SpuriousAlert');
}

function toNumber(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function buildAlert(user, provider, params) {
    var activityRef = params.activityRef ? String(params.activityRef) : 'none';
    var activityDate = params.activityDate || 'unknown';
    var dedupeKey = [
        provider,
        user && user._id ? user._id.toString() : user && user.email ? user.email : 'unknown-user',
        params.ruleCode,
        activityDate,
        activityRef
    ].join('|');

    return {
        dedupeKey: dedupeKey,
        userId: user ? user._id : null,
        userEmail: user ? user.email : null,
        userName: user ? user.name : null,
        provider: provider,
        activityRef: activityRef,
        activityDate: activityDate,
        ruleCode: params.ruleCode,
        severity: params.severity || 'medium',
        observedValue: params.observedValue,
        thresholdValue: params.thresholdValue,
        details: params.details || '',
    };
}

function detectStravaSpuriousData(user, activities) {
    if (!Array.isArray(activities) || activities.length === 0) {
        return [];
    }

    var alerts = [];
    var seenActivityIds = new Set();
    var dailyTotals = {};

    activities.forEach(function(activity) {
        var activityId = activity && activity.id ? String(activity.id) : null;
        var activityDate = activity && activity.start_date ? activity.start_date.substring(0, 10) : 'unknown';
        var distanceKm = toNumber(activity && activity.distance);
        if (distanceKm !== null) {
            distanceKm = distanceKm / 1000;
        }
        var movingTimeSeconds = toNumber(activity && activity.moving_time);
        var movingHours = movingTimeSeconds !== null ? movingTimeSeconds / 3600 : null;

        if (activityId && seenActivityIds.has(activityId)) {
            alerts.push(buildAlert(user, 'Strava', {
                ruleCode: 'duplicate_activity_id',
                severity: 'high',
                activityRef: activityId,
                activityDate: activityDate,
                observedValue: { activityId: activityId },
                thresholdValue: 'unique activity id',
                details: 'Duplicate Strava activity ID received in same payload.',
            }));
        }
        if (activityId) {
            seenActivityIds.add(activityId);
        }

        if (distanceKm !== null && distanceKm < 0) {
            alerts.push(buildAlert(user, 'Strava', {
                ruleCode: 'negative_distance',
                severity: 'high',
                activityRef: activityId,
                activityDate: activityDate,
                observedValue: distanceKm,
                thresholdValue: '>= 0',
                details: 'Activity distance is negative.',
            }));
        }

        if (movingTimeSeconds !== null && movingTimeSeconds < 0) {
            alerts.push(buildAlert(user, 'Strava', {
                ruleCode: 'negative_duration',
                severity: 'high',
                activityRef: activityId,
                activityDate: activityDate,
                observedValue: movingTimeSeconds,
                thresholdValue: '>= 0',
                details: 'Activity duration is negative.',
            }));
        }

        if (distanceKm !== null && distanceKm > MAX_ACTIVITY_DISTANCE_KM) {
            alerts.push(buildAlert(user, 'Strava', {
                ruleCode: 'distance_too_large',
                severity: 'high',
                activityRef: activityId,
                activityDate: activityDate,
                observedValue: distanceKm,
                thresholdValue: MAX_ACTIVITY_DISTANCE_KM,
                details: 'Single activity distance exceeded threshold.',
            }));
        }

        if (movingTimeSeconds === 0 && distanceKm !== null && distanceKm > 0) {
            alerts.push(buildAlert(user, 'Strava', {
                ruleCode: 'distance_without_duration',
                severity: 'high',
                activityRef: activityId,
                activityDate: activityDate,
                observedValue: { distanceKm: distanceKm, movingTimeSeconds: movingTimeSeconds },
                thresholdValue: 'moving_time > 0 when distance > 0',
                details: 'Distance exists but moving time is zero.',
            }));
        }

        if (distanceKm !== null && movingHours !== null && movingHours > 0) {
            var speed = distanceKm / movingHours;
            if (speed > MAX_SPEED_KMH) {
                alerts.push(buildAlert(user, 'Strava', {
                    ruleCode: 'speed_too_high',
                    severity: 'high',
                    activityRef: activityId,
                    activityDate: activityDate,
                    observedValue: speed,
                    thresholdValue: MAX_SPEED_KMH,
                    details: 'Average speed exceeded threshold.',
                }));
            }
        }

        if (distanceKm !== null && activityDate !== 'unknown') {
            dailyTotals[activityDate] = (dailyTotals[activityDate] || 0) + Math.max(distanceKm, 0);
        }
    });

    Object.keys(dailyTotals).forEach(function(date) {
        if (dailyTotals[date] > MAX_DAILY_DISTANCE_KM) {
            alerts.push(buildAlert(user, 'Strava', {
                ruleCode: 'daily_total_too_large',
                severity: 'high',
                activityRef: 'daily-total',
                activityDate: date,
                observedValue: dailyTotals[date],
                thresholdValue: MAX_DAILY_DISTANCE_KM,
                details: 'Daily total distance exceeded threshold.',
            }));
        }
    });

    return alerts;
}

function detectFitbitSpuriousData(user, date, dayResult) {
    if (!dayResult || typeof dayResult !== 'object') {
        return [];
    }

    var alerts = [];
    var safeDate = date || 'unknown';
    var dailyTotalKm = 0;
    var seenActivityIds = new Set();

    if (Array.isArray(dayResult.activities)) {
        dayResult.activities.forEach(function(activity) {
            var distanceKm = toNumber(activity && activity.distance);
            var durationMs = toNumber(activity && activity.duration);
            var durationHours = durationMs !== null ? durationMs / (1000 * 60 * 60) : null;
            var activityRef = activity && (activity.logId || activity.activityId) ? String(activity.logId || activity.activityId) : (activity && activity.name ? activity.name : 'fitbit-activity');

            if (activityRef && seenActivityIds.has(activityRef)) {
                alerts.push(buildAlert(user, 'FitBit', {
                    ruleCode: 'duplicate_activity_id',
                    severity: 'high',
                    activityRef: activityRef,
                    activityDate: safeDate,
                    observedValue: { activityRef: activityRef },
                    thresholdValue: 'unique activity id',
                    details: 'Duplicate Fitbit activity ID received in same payload.',
                }));
            }
            if (activityRef) {
                seenActivityIds.add(activityRef);
            }

            if (distanceKm !== null) {
                dailyTotalKm += Math.max(distanceKm, 0);
            }

            if (distanceKm !== null && distanceKm < 0) {
                alerts.push(buildAlert(user, 'FitBit', {
                    ruleCode: 'negative_distance',
                    severity: 'high',
                    activityRef: activityRef,
                    activityDate: safeDate,
                    observedValue: distanceKm,
                    thresholdValue: '>= 0',
                    details: 'Activity distance is negative.',
                }));
            }

            if (durationMs !== null && durationMs < 0) {
                alerts.push(buildAlert(user, 'FitBit', {
                    ruleCode: 'negative_duration',
                    severity: 'high',
                    activityRef: activityRef,
                    activityDate: safeDate,
                    observedValue: durationMs,
                    thresholdValue: '>= 0',
                    details: 'Activity duration is negative.',
                }));
            }

            if (distanceKm !== null && distanceKm > MAX_ACTIVITY_DISTANCE_KM) {
                alerts.push(buildAlert(user, 'FitBit', {
                    ruleCode: 'distance_too_large',
                    severity: 'high',
                    activityRef: activityRef,
                    activityDate: safeDate,
                    observedValue: distanceKm,
                    thresholdValue: MAX_ACTIVITY_DISTANCE_KM,
                    details: 'Single activity distance exceeded threshold.',
                }));
            }

            if (durationMs === 0 && distanceKm !== null && distanceKm > 0) {
                alerts.push(buildAlert(user, 'FitBit', {
                    ruleCode: 'distance_without_duration',
                    severity: 'high',
                    activityRef: activityRef,
                    activityDate: safeDate,
                    observedValue: { distanceKm: distanceKm, durationMs: durationMs },
                    thresholdValue: 'duration > 0 when distance > 0',
                    details: 'Distance exists but duration is zero.',
                }));
            }

            if (distanceKm !== null && durationHours !== null && durationHours > 0) {
                var speed = distanceKm / durationHours;
                if (speed > MAX_SPEED_KMH) {
                    alerts.push(buildAlert(user, 'FitBit', {
                        ruleCode: 'speed_too_high',
                        severity: 'high',
                        activityRef: activityRef,
                        activityDate: safeDate,
                        observedValue: speed,
                        thresholdValue: MAX_SPEED_KMH,
                        details: 'Average speed exceeded threshold.',
                    }));
                }
            }
        });
    }

    if (dayResult.summary && Array.isArray(dayResult.summary.distances)) {
        dailyTotalKm = 0;
        dayResult.summary.distances.forEach(function(item) {
            var entryDistanceKm = toNumber(item && item.distance);
            if (entryDistanceKm !== null) {
                dailyTotalKm += Math.max(entryDistanceKm, 0);
            }
        });
    }

    if (dailyTotalKm > MAX_DAILY_DISTANCE_KM) {
        alerts.push(buildAlert(user, 'FitBit', {
            ruleCode: 'daily_total_too_large',
            severity: 'high',
            activityRef: 'daily-total',
            activityDate: safeDate,
            observedValue: dailyTotalKm,
            thresholdValue: MAX_DAILY_DISTANCE_KM,
            details: 'Daily total distance exceeded threshold.',
        }));
    }

    return alerts;
}

function severityPassesEmailThreshold(severity) {
    return (severityRank[severity] || 0) >= (severityRank[EMAIL_MIN_SEVERITY] || severityRank.high);
}

function shouldSendEmail(alertDoc) {
    if (!severityPassesEmailThreshold(alertDoc.severity)) {
        return false;
    }
    if (!alertDoc.emailSentAt) {
        return true;
    }
    var cooldownMs = EMAIL_COOLDOWN_HOURS * 60 * 60 * 1000;
    return (new Date().getTime() - new Date(alertDoc.emailSentAt).getTime()) > cooldownMs;
}

function sendAlertEmail(alertDoc) {
    var recipients = process.env.SPURIOUS_ALERT_RECIPIENT || process.env.SPURIOUS_ALERT_RECIPIENTS || DEFAULT_RECIPIENT;
    var recipient = recipients.split(',')[0].trim();
    var subject = '[Spurious Data Alert] ' + alertDoc.provider + ' / ' + alertDoc.ruleCode + ' / ' + (alertDoc.userEmail || 'unknown-user');
    var body = [
        'Spurious data rule matched.',
        '',
        'Provider: ' + alertDoc.provider,
        'Rule: ' + alertDoc.ruleCode,
        'Severity: ' + alertDoc.severity,
        'User: ' + (alertDoc.userName || 'Unknown') + ' (' + (alertDoc.userEmail || 'Unknown') + ')',
        'Date: ' + (alertDoc.activityDate || 'unknown'),
        'Activity Ref: ' + (alertDoc.activityRef || 'unknown'),
        'Observed: ' + JSON.stringify(alertDoc.observedValue),
        'Threshold: ' + JSON.stringify(alertDoc.thresholdValue),
        'Details: ' + (alertDoc.details || 'n/a'),
        'Dedupe Key: ' + alertDoc.dedupeKey,
        '',
        'Generated at: ' + new Date().toISOString(),
    ].join('\n');

    return new Promise(function(resolve) {
        mailer.sendMail(recipient, subject, body, function() {
            getSpuriousAlertModel().updateOne(
                { _id: alertDoc._id },
                { $set: { emailSentAt: new Date() }, $inc: { emailCount: 1 } }
            ).then(function() {
                resolve();
            }).catch(function(err) {
                console.log('Failed to update spurious alert email metadata: ' + err);
                resolve();
            });
        });
    });
}

function saveAndAlert(alert) {
    var now = new Date();
    return getSpuriousAlertModel().findOneAndUpdate(
        { dedupeKey: alert.dedupeKey },
        {
            $setOnInsert: {
                dedupeKey: alert.dedupeKey,
                userId: alert.userId,
                userEmail: alert.userEmail,
                userName: alert.userName,
                provider: alert.provider,
                activityRef: alert.activityRef,
                activityDate: alert.activityDate,
                ruleCode: alert.ruleCode,
                severity: alert.severity,
                observedValue: alert.observedValue,
                thresholdValue: alert.thresholdValue,
                details: alert.details,
                status: 'open',
                firstSeenAt: now,
                emailCount: 0,
            },
            $set: {
                lastSeenAt: now,
                observedValue: alert.observedValue,
                thresholdValue: alert.thresholdValue,
                details: alert.details,
            }
        },
        { upsert: true, new: true }
    ).then(function(alertDoc) {
        if (shouldSendEmail(alertDoc)) {
            return sendAlertEmail(alertDoc);
        }
    }).catch(function(err) {
        console.log('Failed saving spurious alert: ' + err);
    });
}

function processDetectedAlerts(alerts) {
    if (!Array.isArray(alerts) || alerts.length === 0) {
        return Promise.resolve();
    }

    return Promise.all(alerts.map(function(alert) {
        return saveAndAlert(alert);
    }));
}

module.exports = {
    detectStravaSpuriousData: detectStravaSpuriousData,
    detectFitbitSpuriousData: detectFitbitSpuriousData,
    processDetectedAlerts: processDetectedAlerts,
};
