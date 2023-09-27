import { $pay } from "@jx3box/jx3box-common/js/https";

function tryMyLucky(id, batch) { // 抽奖
    return $pay().post(`/api/lucky-draw/public/item/${id}/try-my-lucky`, {
        batch
    }, {
        withCredentials: true
    });
}
function getList(index = 1, pageSize = 10, name) { // 抽奖
    return $pay().get(`/api/lucky-draw/public/list`, {
        params: {
        }
    });
}
function luckyDetail(id) {
    return $pay().get(`/lucky-draw/my/history/${id}/details`, {
        params: {
        }
    });
}


export { tryMyLucky, getList, luckyDetail };
