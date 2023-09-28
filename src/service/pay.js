import { $pay } from "@jx3box/jx3box-common/js/https";


// 获取中奖历史
function getMyHistory(params) {
    return $pay().get(`/lucky-draw/my/history`, { params });
}

// 获取我的中奖
function getMyLucky(id, params) {
    return $pay().get(`/lucky-draw/my/history/${id}/details`, { params });
}

// 所有抽奖列表
function getLuckyList(params) {
    return $pay().get(`/lucky-draw/public/list`, { params });
}
// 获取活动详情
function getBlindBox(id) {
    return $pay().get(`/lucky-draw/public/details`, { params: { id } });
}

// 抽奖
function goodLucky(id, data) {
    return $pay().post(`/lucky-draw/public/item/${id}/try-my-lucky`, data);
}


export {
    getMyHistory,
    getBlindBox,
    getMyLucky,
    goodLucky,
    getLuckyList
};