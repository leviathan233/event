import { $cms } from "@jx3box/jx3box-common/js/https";

function getTopic(topic) {
    return $cms({ mute: true }).get("/api/cms/topic", {
        params: {
            type: topic,
            all: 1,
            status: 1,
        },
    });
}

export { getTopic };