<template>
    <div></div>
</template>
<script>
    // Root
    let jx3box = "https://www.jx3box.com";
    let pathname = location.pathname;
    if (pathname == "/") {
        location.href = jx3box;
    }
    
    // Namespace
    let bbs = jx3box + "/bbs/#/namespace";
    let api = "https://cms.jx3box.com/api/cms/namespace-key";
    let key = decodeURIComponent(pathname.slice(11));

    fetch(`https://next2.jx3box.com/api/summary-any/namespace-${key}`);
    fetch(`${api}?key=${key}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data && data.code == 0) {
                let namespace = data.data;
                if (namespace.source_type == "team") {
                    location.href = jx3box + "/team/org/" + namespace.source_id;
                } else {
                    location.href = namespace.link || bbs;
                }
            } else {
                location.href = bbs + "?namespace=" + key;
            }
        })
        .catch((err) => {
            // 网络请求异常时跳转到bbs
            location.href = bbs + "?namespace=" + key;
        });
</script>
