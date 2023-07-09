import { $cms } from "@jx3box/jx3box-common/js/https";
import { $helper } from '@jx3box/jx3box-common/js/https.js'

// 获取公开铭牌
function getNamespaceList(params) {
    return $cms().get("/api/cms/namespace", {
        params,
    });
}
// 获取我的铭牌
function getNamespace(params) {
    return $helper()({
      method: 'GET',
      url: `/api/my/namespaces`,
      params: params,
    })
  }

export { getNamespaceList, getNamespace };