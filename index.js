/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const axios = require("axios").default;

exports.helloWorld = (req, res) => {
    //console.log("req.body: ", JSON.stringify(req.body));
    let message = req.body.alert_name || "Hello World!";
    console.log("alert_name: ", message);

    let dic = req.body;
    console.log("survey_info: ", req.body.survey_info);

    let surveyInfo = dic.survey_info;
    let surveyName = surveyInfo.name || "undefined name";
    let triggerEvent = dic.trigger_event;

    var blocksArray = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text:
                    "Hey, your *" + surveyName + "* survey got a new response.",
            },
        },
        {
            type: "context",
            elements: [
                {
                    type: "plain_text",
                    text: "⚡Triggered by: " + (triggerEvent.event_name || ""),
                    emoji: true,
                },
            ],
        },
    ];

    let screens = surveyInfo.screens;

    for (let obj of screens) {
        blocksArray.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text:
                    "*" +
                    obj["title"] +
                    "* " +
                    "[" +
                    obj["type"] +
                    "] " +
                    obj["answer"],
            },
        });
    }

    blocksArray.push({
        type: "section",
        text: {
            type: "mrkdwn",
            text: "<https://dashboard.1flow.app|View results>",
        },
    });

    res.status(200).send(message);
    const data = {
        blocks: blocksArray,
    };
    axios
        .post(
            YOUR_SLACK_INCOMING_WEBHOOK_URL,
            data
        )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
};
