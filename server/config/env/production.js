module.exports = {
    db: process.env.MONGODB_URI || "mongodb://localhost/step-challenge",
    app: {
        name: "Step Challenge"
    },
    port: process.env.PORT || 443
}