// ==UserScript==
// @name         Custom CDN of Bilibili (CCB) - 修改哔哩哔哩的网页视频、直播、番剧的播放源
// @description  Custom CDN of Bilibili (CCB)
// @namespace    CCB
// @license      MIT
// @version      2.3.0
// @author       鼠鼠今天吃嘉然, AreithDream
// @run-at       document-start
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/cheese/play/*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/list/*
// @match        https://live.bilibili.com/*
// @match        https://www.bilibili.com/blackboard/video-diagnostics.html*
// @match        https://www.bilibili.com/blackboard/*
// @match        https://player.bilibili.com/*
// @connect      kanda-akihito-kun.github.io
// @connect      cdn.jsdelivr.net
// @connect      raw.githubusercontent.com
// @connect      api.bilibili.com
// @connect      maxzrb.github.io
// @connect      bilivideo.com
// @connect      akamaized.net
// @updateURL    https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/script/ccb.bundle.user.js
// @downloadURL  https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/script/ccb.bundle.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// ==/UserScript==

;(() => {
    // ===EMBEDDED_START===
// 此区块由 build.py 自动生成 — 请编辑 data/*.json，不要手动修改此处。
const EMBEDDED = {
    regions: [
    "北京",
    "上海",
    "广东",
    "深圳",
    "福建",
    "河北",
    "黑省",
    "河南",
    "湖北",
    "湖南",
    "江苏",
    "江西",
    "辽宁",
    "内蒙",
    "山东",
    "山西",
    "陕西",
    "四川",
    "重庆",
    "天津",
    "新疆",
    "浙江",
    "外建",
    "香港",
    "海外"
],
    cdn: {
    "上海": [
        "cn-sh-ct-01-01.bilivideo.com",
        "cn-sh-ct-01-06.bilivideo.com",
        "cn-sh-ct-01-13.bilivideo.com",
        "cn-sh-ct-01-15.bilivideo.com",
        "cn-sh-ct-01-23.bilivideo.com",
        "cn-sh-ct-01-24.bilivideo.com",
        "cn-sh-ct-01-35.bilivideo.com",
        "cn-sh-ct-01-36.bilivideo.com",
        "cn-sh-office-bcache-01.bilivideo.com"
    ],
    "内蒙": [
        "cn-nmghhht-cm-01-11.bilivideo.com",
        "cn-nmghhht-cu-01-01.bilivideo.com",
        "cn-nmghhht-cu-01-07.bilivideo.com",
        "cn-nmghhht-cu-01-08.bilivideo.com",
        "cn-nmghhht-cu-01-09.bilivideo.com",
        "cn-nmghhht-cu-01-10.bilivideo.com",
        "cn-nmghhht-cu-01-12.bilivideo.com",
        "cn-nmghhht-cu-01-13.bilivideo.com",
        "cn-nmghhht-cu-01-14.bilivideo.com",
        "cn-nmghhht-cu-01-15.bilivideo.com"
    ],
    "北京": [
        "cn-bj-cc-03-14.bilivideo.com",
        "cn-bj-cc-03-17.bilivideo.com",
        "cn-bj-fx-01-04.bilivideo.com",
        "cn-bj-fx-01-05.bilivideo.com",
        "cn-bj-se-01-03.bilivideo.com",
        "cn-bj-se-01-04.bilivideo.com",
        "cn-bj-se-01-05.bilivideo.com",
        "cn-bj-se-01-06.bilivideo.com"
    ],
    "四川": [
        "cn-sccd-cm-03-01.bilivideo.com",
        "cn-sccd-cm-03-02.bilivideo.com",
        "cn-sccd-cm-03-05.bilivideo.com",
        "cn-sccd-cm-03-07.bilivideo.com",
        "cn-sccd-ct-01-02.bilivideo.com",
        "cn-sccd-ct-01-08.bilivideo.com",
        "cn-sccd-ct-01-10.bilivideo.com",
        "cn-sccd-ct-01-17.bilivideo.com",
        "cn-sccd-ct-01-18.bilivideo.com",
        "cn-sccd-ct-01-19.bilivideo.com",
        "cn-sccd-ct-01-20.bilivideo.com",
        "cn-sccd-ct-01-21.bilivideo.com",
        "cn-sccd-ct-01-22.bilivideo.com",
        "cn-sccd-ct-01-23.bilivideo.com",
        "cn-sccd-ct-01-24.bilivideo.com",
        "cn-sccd-ct-01-25.bilivideo.com",
        "cn-sccd-ct-01-26.bilivideo.com",
        "cn-sccd-ct-01-27.bilivideo.com",
        "cn-sccd-ct-01-29.bilivideo.com",
        "cn-sccd-cu-01-01.bilivideo.com",
        "cn-sccd-cu-01-02.bilivideo.com",
        "cn-sccd-cu-01-03.bilivideo.com",
        "cn-sccd-cu-01-04.bilivideo.com",
        "cn-sccd-cu-01-05.bilivideo.com",
        "cn-sccd-cu-01-06.bilivideo.com",
        "cn-sccd-cu-01-07.bilivideo.com",
        "cn-sccd-cu-01-08.bilivideo.com",
        "cn-sccd-cu-01-09.bilivideo.com",
        "cn-sccd-fx-01-01.bilivideo.com",
        "cn-sccd-fx-01-06.bilivideo.com",
        "cn-scdy-ct-01-05.bilivideo.com"
    ],
    "外建": [
        "c0--cn-gotcha01.bilivideo.com",
        "c1--cn-gotcha09.bilivideo.com",
        "c1--cn-gotcha208.bilivideo.com",
        "d0--cn-gotcha01.bilivideo.com",
        "d0--cn-gotcha09.bilivideo.com",
        "d0--cn-gotcha208-01.bilivideo.com",
        "d1--cn-gotcha04.bilivideo.com",
        "d1--cn-gotcha04b.bilivideo.com",
        "d1--cn-gotcha07.bilivideo.com",
        "d1--cn-gotcha07b.bilivideo.com",
        "d1--cn-gotcha09.bilivideo.com",
        "d1--cn-gotcha101.bilivideo.com",
        "d1--cn-gotcha102.bilivideo.com",
        "d1--cn-gotcha204-1.bilivideo.com",
        "d1--cn-gotcha204-2.bilivideo.com",
        "d1--cn-gotcha204-3.bilivideo.com",
        "d1--cn-gotcha204-4.bilivideo.com",
        "d1--cn-gotcha204.bilivideo.com",
        "d1--cn-gotcha207.bilivideo.com",
        "d1--cn-gotcha208.bilivideo.com",
        "d1--cn-gotcha208b.bilivideo.com",
        "d1--cn-gotcha209.bilivideo.com",
        "d1--cn-gotcha209b.bilivideo.com",
        "d1--cn-gotcha211.bilivideo.com",
        "d1--cn-gotcha308.bilivideo.com",
        "d1--ov-gotcha01.bilivideo.com",
        "d1--ov-gotcha03.bilivideo.com",
        "d1--ov-gotcha05.bilivideo.com",
        "d1--ov-gotcha07.bilivideo.com",
        "d1--ov-gotcha207.bilivideo.com",
        "d1--ov-gotcha207b.bilivideo.com",
        "d1--ov-gotcha208.bilivideo.com",
        "d1--ov-gotcha209.bilivideo.com",
        "d1--ov-gotcha210.bilivideo.com",
        "d1--p1--cn-gotcha04.bilivideo.com",
        "d1--p2--cn-gotcha04.bilivideo.com",
        "d1--tf-gotcha01-loc.bilivideo.com",
        "d1--tf-gotcha01.bilivideo.com",
        "d1--tf-gotcha04.bilivideo.com",
        "d1--tf-gotcha08.bilivideo.com",
        "d1-cn-gotcha210.bilivideo.com"
    ],
    "天津": [
        "cn-tj-cm-02-01.bilivideo.com",
        "cn-tj-cm-02-02.bilivideo.com",
        "cn-tj-cm-02-03.bilivideo.com",
        "cn-tj-cm-02-04.bilivideo.com",
        "cn-tj-cm-02-05.bilivideo.com",
        "cn-tj-cm-02-06.bilivideo.com",
        "cn-tj-cm-02-07.bilivideo.com",
        "cn-tj-cu-01-01.bilivideo.com",
        "cn-tj-cu-01-02.bilivideo.com",
        "cn-tj-cu-01-03.bilivideo.com",
        "cn-tj-cu-01-04.bilivideo.com",
        "cn-tj-cu-01-05.bilivideo.com",
        "cn-tj-cu-01-06.bilivideo.com",
        "cn-tj-cu-01-07.bilivideo.com",
        "cn-tj-cu-01-08.bilivideo.com",
        "cn-tj-cu-01-09.bilivideo.com",
        "cn-tj-cu-01-10.bilivideo.com",
        "cn-tj-cu-01-11.bilivideo.com",
        "cn-tj-cu-01-12.bilivideo.com",
        "cn-tj-cu-01-13.bilivideo.com",
        "cn-tj-cu-01-16.bilivideo.com",
        "cn-tj-cu-01-17.bilivideo.com",
        "cn-tj-fx-01-01.bilivideo.com",
        "cn-tj-fx-01-05.bilivideo.com"
    ],
    "山东": [
        "cn-sdjn-cm-02-01.bilivideo.com",
        "cn-sdjn-cm-02-02.bilivideo.com",
        "cn-sdjn-cm-02-03.bilivideo.com",
        "cn-sdjn-cm-02-04.bilivideo.com",
        "cn-sdjn-cm-02-05.bilivideo.com",
        "cn-sdjn-cm-02-06.bilivideo.com",
        "cn-sdjn-cm-02-07.bilivideo.com",
        "cn-sdjn-cm-02-08.bilivideo.com",
        "cn-sdjn-cm-02-09.bilivideo.com",
        "cn-sdjn-cm-02-10.bilivideo.com",
        "cn-sdjn-cm-02-11.bilivideo.com",
        "cn-sdjn-cm-02-12.bilivideo.com",
        "cn-sdjn-cm-02-13.bilivideo.com",
        "cn-sdjn-fx-01-01.bilivideo.com",
        "cn-sdjn-fx-01-02.bilivideo.com",
        "cn-sdqd-ccc-01-01.bilivideo.com",
        "cn-sdqd-cu-01-01.bilivideo.com",
        "cn-sdqd-cu-01-08.bilivideo.com",
        "cn-sdqd-cu-01-09.bilivideo.com",
        "cn-sdqd-cu-01-11.bilivideo.com",
        "cn-sdqd-cu-01-16.bilivideo.com",
        "cn-sdqd-cu-01-17.bilivideo.com",
        "cn-sdqd-cu-01-21.bilivideo.com",
        "cn-sdqd-cu-01-22.bilivideo.com",
        "cn-sdqd-cu-01-23.bilivideo.com",
        "cn-sdqd-cu-01-24.bilivideo.com",
        "cn-sdqd-cu-01-25.bilivideo.com"
    ],
    "山西": [
        "cn-sxty-cm-02-04.bilivideo.com",
        "cn-sxty-cm-02-09.bilivideo.com",
        "cn-sxty-cm-02-10.bilivideo.com",
        "cn-sxty-cu-03-01.bilivideo.com",
        "cn-sxty-cu-03-02.bilivideo.com",
        "cn-sxty-cu-03-03.bilivideo.com",
        "cn-sxty-cu-03-04.bilivideo.com",
        "cn-sxty-cu-03-05.bilivideo.com",
        "cn-sxty-cu-03-06.bilivideo.com",
        "cn-sxty-cu-03-07.bilivideo.com",
        "cn-sxty-cu-03-08.bilivideo.com",
        "cn-sxty-cu-03-09.bilivideo.com"
    ],
    "广东": [
        "cn-gddg-ccc-01-01.bilivideo.com",
        "cn-gddg-cm-01-02.bilivideo.com",
        "cn-gddg-cm-01-03.bilivideo.com",
        "cn-gddg-cm-01-04.bilivideo.com",
        "cn-gddg-cm-01-05.bilivideo.com",
        "cn-gddg-cm-01-06.bilivideo.com",
        "cn-gddg-cm-01-13.bilivideo.com",
        "cn-gddg-cm-01-14.bilivideo.com",
        "cn-gddg-cm-01-18.bilivideo.com",
        "cn-gddg-ct-01-10.bilivideo.com",
        "cn-gddg-ct-01-11.bilivideo.com",
        "cn-gddg-ct-01-12.bilivideo.com",
        "cn-gddg-ct-01-13.bilivideo.com",
        "cn-gddg-ct-01-15.bilivideo.com",
        "cn-gddg-ct-01-17.bilivideo.com",
        "cn-gddg-ct-01-18.bilivideo.com",
        "cn-gddg-ct-01-21.bilivideo.com",
        "cn-gddg-ct-01-24.bilivideo.com",
        "cn-gddg-cu-01-04.bilivideo.com",
        "cn-gddg-cu-01-06.bilivideo.com",
        "cn-gddg-cu-01-07.bilivideo.com",
        "cn-gdfs-cc-02-02.bilivideo.com",
        "cn-gdfs-cc-02-06.bilivideo.com",
        "cn-gdfs-cc-02-07.bilivideo.com",
        "cn-gdfs-cc-02-18.bilivideo.com",
        "cn-gdfs-ct-01-01.bilivideo.com",
        "cn-gdfs-ct-01-04.bilivideo.com",
        "cn-gdfs-ct-01-05.bilivideo.com",
        "cn-gdfs-ct-01-06.bilivideo.com",
        "cn-gdfs-ct-01-07.bilivideo.com",
        "cn-gdfs-ct-01-08.bilivideo.com",
        "cn-gdfs-ct-01-09.bilivideo.com",
        "cn-gdfs-ct-01-10.bilivideo.com",
        "cn-gdfs-ct-01-12.bilivideo.com",
        "cn-gdfs-ct-01-13.bilivideo.com",
        "cn-gdfs-ct-01-14.bilivideo.com",
        "cn-gdfs-ct-01-16.bilivideo.com",
        "cn-gdfs-ct-01-17.bilivideo.com",
        "cn-gdfs-ct-01-18.bilivideo.com",
        "cn-gdfs-ct-01-19.bilivideo.com",
        "cn-gdfs-ct-01-21.bilivideo.com",
        "cn-gdfs-ct-01-22.bilivideo.com",
        "cn-gdgz-cm-01-02.bilivideo.com",
        "cn-gdgz-cm-01-10.bilivideo.com",
        "cn-gdgz-fx-01-01.bilivideo.com",
        "cn-gdgz-fx-01-02.bilivideo.com",
        "cn-gdgz-fx-01-03.bilivideo.com",
        "cn-gdgz-fx-01-04.bilivideo.com",
        "cn-gdgz-fx-01-05.bilivideo.com",
        "cn-gdgz-fx-01-06.bilivideo.com",
        "cn-gdgz-fx-01-07.bilivideo.com",
        "cn-gdgz-fx-01-08.bilivideo.com",
        "cn-gdgz-fx-01-09.bilivideo.com",
        "cn-gdgz-fx-01-10.bilivideo.com",
        "cn-gdgz-gd-01-01.bilivideo.com",
        "cn-gdjm-cm-01-01.bilivideo.com",
        "cn-gdjm-cm-01-02.bilivideo.com",
        "cn-gdjm-cm-01-03.bilivideo.com",
        "cn-gdjm-cm-01-04.bilivideo.com",
        "cn-gdjm-cm-01-05.bilivideo.com",
        "cn-gdjm-cm-01-06.bilivideo.com",
        "cn-gdjm-cm-01-07.bilivideo.com",
        "cn-gdjm-cm-01-08.bilivideo.com",
        "cn-gdst-cm-01-01.bilivideo.com",
        "cn-gdst-cm-01-02.bilivideo.com",
        "cn-gdst-cm-01-03.bilivideo.com",
        "cn-gdst-cm-01-04.bilivideo.com",
        "cn-gdst-cm-01-05.bilivideo.com",
        "cn-gdst-cm-01-06.bilivideo.com",
        "cn-gdst-cm-01-07.bilivideo.com",
        "cn-gdst-cm-01-10.bilivideo.com",
        "cn-gdst-cm-01-12.bilivideo.com",
        "cn-gdst-cm-01-15.bilivideo.com",
        "cn-gdst-cm-01-17.bilivideo.com",
        "cn-jsnj-gd-01-02.bilivideo.com"
    ],
    "新疆": [
        "cn-xj-cm-02-01.bilivideo.com",
        "cn-xj-cm-02-03.bilivideo.com",
        "cn-xj-cm-02-04.bilivideo.com",
        "cn-xj-cm-02-06.bilivideo.com",
        "cn-xj-ct-01-01.bilivideo.com",
        "cn-xj-ct-01-02.bilivideo.com",
        "cn-xj-ct-01-03.bilivideo.com",
        "cn-xj-ct-01-04.bilivideo.com",
        "cn-xj-ct-01-05.bilivideo.com",
        "cn-xj-ct-02-02.bilivideo.com"
    ],
    "江苏": [
        "cn-jsnj-fx-02-05.bilivideo.com",
        "cn-jsnj-fx-02-07.bilivideo.com",
        "cn-jsnj-fx-02-10.bilivideo.com",
        "cn-jsnj-gd-01-02.bilivideo.com",
        "cn-jssz-cm-01-01.bilivideo.com",
        "cn-jssz-cm-01-02.bilivideo.com",
        "cn-jssz-cm-01-03.bilivideo.com",
        "cn-jssz-cm-02-07.bilivideo.com",
        "cn-jssz-cm-02-08.bilivideo.com",
        "cn-jssz-cm-02-18.bilivideo.com",
        "cn-jssz-cm-02-20.bilivideo.com",
        "cn-jssz-cm-02-25.bilivideo.com",
        "cn-jssz-cm-02-31.bilivideo.com",
        "cn-jssz-cm-02-34.bilivideo.com",
        "cn-jssz-cm-02-35.bilivideo.com",
        "cn-jssz-cm-02-40.bilivideo.com",
        "cn-jssz-cm-02-42.bilivideo.com",
        "ec-jssz-ct-01-02.bilivideo.com"
    ],
    "江西": [
        "cn-jxjj-ct-01-01.bilivideo.com",
        "cn-jxjj-ct-01-02.bilivideo.com",
        "cn-jxjj-ct-01-05.bilivideo.com",
        "cn-jxjj-ct-01-14.bilivideo.com",
        "cn-jxnc-cm-01-01.bilivideo.com",
        "cn-jxnc-cm-01-02.bilivideo.com",
        "cn-jxnc-cm-01-03.bilivideo.com",
        "cn-jxnc-cm-01-04.bilivideo.com",
        "cn-jxnc-cm-01-09.bilivideo.com",
        "cn-jxnc-cm-01-12.bilivideo.com",
        "cn-jxnc-cm-01-19.bilivideo.com",
        "cn-jxnc-cm-01-42.bilivideo.com",
        "cn-jxnc-cmcc-bcache-06.bilivideo.com"
    ],
    "河北": [
        "cn-hblf-ct-01-06.bilivideo.com",
        "cn-hblf-ct-01-19.bilivideo.com",
        "cn-hbsjz-cm-02-01.bilivideo.com",
        "cn-hbsjz-cm-02-02.bilivideo.com",
        "cn-hbsjz-cm-02-03.bilivideo.com",
        "cn-hbsjz-cm-02-04.bilivideo.com",
        "cn-hbsjz-cm-02-05.bilivideo.com",
        "cn-hbsjz-cm-02-07.bilivideo.com",
        "cn-hbsjz-cm-02-08.bilivideo.com",
        "cn-hbsjz-cm-02-09.bilivideo.com",
        "cn-hbsjz-cm-02-10.bilivideo.com",
        "cn-hbsjz-cm-02-11.bilivideo.com",
        "cn-hbsjz-cm-02-12.bilivideo.com",
        "cn-hbsjz-cm-02-13.bilivideo.com",
        "cn-hbsjz-cm-02-14.bilivideo.com"
    ],
    "河南": [
        "cn-hnzz-cm-01-01.bilivideo.com",
        "cn-hnzz-cm-01-02.bilivideo.com",
        "cn-hnzz-cm-01-03.bilivideo.com",
        "cn-hnzz-cm-01-04.bilivideo.com",
        "cn-hnzz-cm-01-05.bilivideo.com",
        "cn-hnzz-cm-01-06.bilivideo.com",
        "cn-hnzz-cm-01-09.bilivideo.com",
        "cn-hnzz-cm-01-10.bilivideo.com",
        "cn-hnzz-cm-01-11.bilivideo.com",
        "cn-hnzz-cm-01-13.bilivideo.com",
        "cn-hnzz-cm-01-14.bilivideo.com",
        "cn-hnzz-cm-01-15.bilivideo.com",
        "cn-hnzz-cm-01-16.bilivideo.com",
        "cn-hnzz-fx-01-01.bilivideo.com",
        "cn-hnzz-fx-01-08.bilivideo.com"
    ],
    "浙江": [
        "cn-zjhz-cm-01-01.bilivideo.com",
        "cn-zjhz-cm-01-04.bilivideo.com",
        "cn-zjhz-cm-01-07.bilivideo.com",
        "cn-zjhz-cm-01-08.bilivideo.com",
        "cn-zjhz-cm-01-11.bilivideo.com",
        "cn-zjhz-cm-01-12.bilivideo.com",
        "cn-zjhz-cm-01-16.bilivideo.com",
        "cn-zjhz-cm-01-17.bilivideo.com",
        "cn-zjhz-cm-01-19.bilivideo.com",
        "cn-zjhz-cm-01-28.bilivideo.com",
        "cn-zjhz-cu-01-01.bilivideo.com",
        "cn-zjhz-cu-01-02.bilivideo.com",
        "cn-zjhz-cu-01-04.bilivideo.com",
        "cn-zjhz-cu-01-05.bilivideo.com",
        "cn-zjhz-cu-01-06.bilivideo.com",
        "cn-zjhz-cu-v-02.bilivideo.com",
        "cn-zjhz3-wasu-bcache-05.bilivideo.com",
        "cn-zjhz3-wasu-bcache-11.bilivideo.com",
        "cn-zjhz3-wasu-bcache-15.bilivideo.com",
        "cn-zjhz3-wasu-bcache-20.bilivideo.com",
        "cn-zjjh-ct-04-03.bilivideo.com",
        "cn-zjjh-ct-04-06.bilivideo.com",
        "cn-zjjh-ct-04-12.bilivideo.com",
        "cn-zjjh-ct-04-13.bilivideo.com",
        "cn-zjjh-ct-04-14.bilivideo.com",
        "cn-zjjh-ct-04-15.bilivideo.com",
        "cn-zjjh-ct-04-16.bilivideo.com",
        "cn-zjjh-ct-04-24.bilivideo.com",
        "cn-zjjh-ct-04-26.bilivideo.com",
        "cn-zjjh-ct-04-27.bilivideo.com",
        "cn-zjjh-ct-04-28.bilivideo.com",
        "cn-zjjh-ct-04-29.bilivideo.com",
        "cn-zjjh-ct-04-30.bilivideo.com",
        "cn-zjjh-ct-04-33.bilivideo.com",
        "cn-zjjh-ct-04-34.bilivideo.com"
    ],
    "海外": [
        "cn-jxnc-cmcc-bcache-06.bilivideo.com",
        "upos-hz-mirrorakam.akamaized.net",
        "upos-sz-mirror08h.bilivideo.com",
        "upos-sz-mirroraliov.bilivideo.com",
        "upos-sz-mirrorcosov.bilivideo.com"
    ],
    "深圳": [
        "upos-sz-302kodo.bilivideo.com",
        "upos-sz-302ppio.bilivideo.com",
        "upos-sz-dynqn.bilivideo.com",
        "upos-sz-estgcos.bilivideo.com",
        "upos-sz-estghw.bilivideo.com",
        "upos-sz-estgoss.bilivideo.com",
        "upos-sz-mirror08c.bilivideo.com",
        "upos-sz-mirror08ct.bilivideo.com",
        "upos-sz-mirror08disp.bilivideo.com",
        "upos-sz-mirror08h.bilivideo.com",
        "upos-sz-mirrorali.bilivideo.com",
        "upos-sz-mirroralib.bilivideo.com",
        "upos-sz-mirroralibstar1.bilivideo.com",
        "upos-sz-mirroraliov.bilivideo.com",
        "upos-sz-mirrorasiaov.bilivideo.com",
        "upos-sz-mirrorawsov.bilivideo.com",
        "upos-sz-mirrorbd.bilivideo.com",
        "upos-sz-mirrorbdb.bilivideo.com",
        "upos-sz-mirrorcf1ov.bilivideo.com",
        "upos-sz-mirrorcos.bilivideo.com",
        "upos-sz-mirrorcosb.bilivideo.com",
        "upos-sz-mirrorcosbstar.bilivideo.com",
        "upos-sz-mirrorcosdisp.bilivideo.com",
        "upos-sz-mirrorcoso1.bilivideo.com",
        "upos-sz-mirrorcosov.bilivideo.com",
        "upos-sz-mirrorctos.bilivideo.com",
        "upos-sz-mirrorhw.bilivideo.com",
        "upos-sz-mirrorhwb.bilivideo.com",
        "upos-sz-mirrorhwdisp.bilivideo.com",
        "upos-sz-mirrorhwo1.bilivideo.com",
        "upos-sz-mirrorzos.bilivideo.com",
        "upos-sz-static.bilivideo.com",
        "upos-sz-staticcos-cmask.bilivideo.com",
        "upos-sz-staticcos.bilivideo.com"
    ],
    "湖北": [
        "cn-hbwh-cm-01-01.bilivideo.com",
        "cn-hbwh-cm-01-02.bilivideo.com",
        "cn-hbwh-cm-01-03.bilivideo.com",
        "cn-hbwh-cm-01-04.bilivideo.com",
        "cn-hbwh-cm-01-05.bilivideo.com",
        "cn-hbwh-cm-01-06.bilivideo.com",
        "cn-hbwh-cm-01-07.bilivideo.com",
        "cn-hbwh-cm-01-08.bilivideo.com",
        "cn-hbwh-cm-01-09.bilivideo.com",
        "cn-hbwh-cm-01-10.bilivideo.com",
        "cn-hbwh-cm-01-11.bilivideo.com",
        "cn-hbwh-cm-01-12.bilivideo.com",
        "cn-hbwh-cm-01-13.bilivideo.com",
        "cn-hbwh-cm-01-14.bilivideo.com",
        "cn-hbwh-cm-01-15.bilivideo.com",
        "cn-hbwh-cm-01-16.bilivideo.com",
        "cn-hbwh-cm-01-17.bilivideo.com",
        "cn-hbwh-cm-01-18.bilivideo.com",
        "cn-hbwh-cm-01-19.bilivideo.com",
        "cn-hbwh-cm-01-20.bilivideo.com",
        "cn-hbwh-fx-01-01.bilivideo.com",
        "cn-hbwh-fx-01-02.bilivideo.com",
        "cn-hbwh-fx-01-12.bilivideo.com",
        "cn-hbwh-fx-01-13.bilivideo.com",
        "cn-hbyc-ct-02-02.bilivideo.com",
        "cn-hbyc-ct-02-04.bilivideo.com",
        "cn-hbyc-ct-02-06.bilivideo.com",
        "cn-hbyc-ct-02-10.bilivideo.com",
        "cn-hbyc-ct-02-11.bilivideo.com",
        "cn-hbyc-ct-02-12.bilivideo.com",
        "cn-hbyc-ct-02-19.bilivideo.com",
        "cn-hbyc-ct-02-23.bilivideo.com"
    ],
    "湖南": [
        "cn-hncs-cm-03-01.bilivideo.com",
        "cn-hncs-cm-03-04.bilivideo.com",
        "cn-hncs-cm-03-05.bilivideo.com",
        "cn-hncs-cm-03-08.bilivideo.com",
        "cn-hncs-cm-03-09.bilivideo.com",
        "cn-hncs-cm-03-11.bilivideo.com",
        "cn-hncs-cm-03-12.bilivideo.com",
        "cn-hncs-cu-01-01.bilivideo.com",
        "cn-hncs-cu-01-02.bilivideo.com",
        "cn-hncs-cu-01-03.bilivideo.com",
        "cn-hncs-cu-01-04.bilivideo.com",
        "cn-hncs-cu-01-05.bilivideo.com",
        "cn-hncs-cu-01-06.bilivideo.com",
        "cn-hncs-cu-01-07.bilivideo.com",
        "cn-hncs-cu-01-09.bilivideo.com",
        "cn-hncs-cu-01-10.bilivideo.com",
        "cn-hncs-cu-v-01.bilivideo.com",
        "cn-hncs-cu-v-03.bilivideo.com",
        "cn-hncs-fx-01-01.bilivideo.com"
    ],
    "福建": [
        "cn-fjfz-fx-01-01.bilivideo.com",
        "cn-fjfz-fx-01-02.bilivideo.com",
        "cn-fjfz-fx-01-03.bilivideo.com",
        "cn-fjfz-fx-01-04.bilivideo.com",
        "cn-fjfz-fx-01-05.bilivideo.com",
        "cn-fjfz-fx-01-06.bilivideo.com",
        "cn-fjqz-cm-01-01.bilivideo.com",
        "cn-fjqz-cm-01-02.bilivideo.com",
        "cn-fjqz-cm-01-03.bilivideo.com",
        "cn-fjqz-cm-01-04.bilivideo.com",
        "cn-fjqz-cm-01-05.bilivideo.com",
        "cn-fjqz-cm-01-06.bilivideo.com",
        "cn-fjqz-cm-01-07.bilivideo.com",
        "cn-fjqz-cm-01-08.bilivideo.com",
        "cn-fjqz-cm-01-09.bilivideo.com"
    ],
    "辽宁": [
        "cn-lndl-ct-01-01.bilivideo.com",
        "cn-lndl-ct-01-04.bilivideo.com",
        "cn-lnsy-cm-01-01.bilivideo.com",
        "cn-lnsy-cm-01-02.bilivideo.com",
        "cn-lnsy-cm-01-03.bilivideo.com",
        "cn-lnsy-cm-01-04.bilivideo.com",
        "cn-lnsy-cm-01-05.bilivideo.com",
        "cn-lnsy-cm-01-06.bilivideo.com",
        "cn-lnsy-cm-01-07.bilivideo.com",
        "cn-lnsy-cm-01-08.bilivideo.com",
        "cn-lnsy-cm-01-09.bilivideo.com",
        "cn-lnsy-cu-01-01.bilivideo.com",
        "cn-lnsy-cu-01-03.bilivideo.com",
        "cn-lnsy-cu-01-04.bilivideo.com",
        "cn-lnsy-cu-01-06.bilivideo.com",
        "cn-lnsy-cu-01-07.bilivideo.com"
    ],
    "重庆": [
        "cn-cq-cm-01-01.bilivideo.com",
        "cn-cq-cm-01-02.bilivideo.com",
        "cn-cq-cm-01-03.bilivideo.com",
        "cn-cq-cm-01-04.bilivideo.com",
        "cn-cq-ct-01-01.bilivideo.com",
        "cn-cq-ct-01-02.bilivideo.com",
        "cn-cq-ct-01-03.bilivideo.com",
        "cn-cq-ct-01-05.bilivideo.com",
        "cn-cq-ct-01-16.bilivideo.com",
        "cn-cq-ct-01-20.bilivideo.com",
        "cn-cq-ct-01-24.bilivideo.com"
    ],
    "陕西": [
        "cn-sxxa-cm-01-01.bilivideo.com",
        "cn-sxxa-cm-01-02.bilivideo.com",
        "cn-sxxa-cm-01-03.bilivideo.com",
        "cn-sxxa-cm-01-04.bilivideo.com",
        "cn-sxxa-cm-01-05.bilivideo.com",
        "cn-sxxa-cm-01-06.bilivideo.com",
        "cn-sxxa-cm-01-08.bilivideo.com",
        "cn-sxxa-cm-01-09.bilivideo.com",
        "cn-sxxa-cm-01-11.bilivideo.com",
        "cn-sxxa-cm-01-12.bilivideo.com",
        "cn-sxxa-ct-03-02.bilivideo.com",
        "cn-sxxa-ct-03-03.bilivideo.com",
        "cn-sxxa-ct-03-04.bilivideo.com",
        "cn-sxxa-cu-02-01.bilivideo.com",
        "cn-sxxa-cu-02-02.bilivideo.com"
    ],
    "香港": [
        "cn-hk-eq-01-01.bilivideo.com",
        "cn-hk-eq-01-03.bilivideo.com",
        "cn-hk-eq-01-06.bilivideo.com",
        "cn-hk-eq-01-07.bilivideo.com",
        "cn-hk-eq-01-08.bilivideo.com",
        "cn-hk-eq-01-09.bilivideo.com",
        "cn-hk-eq-01-10.bilivideo.com",
        "cn-hk-eq-01-11.bilivideo.com",
        "cn-hk-eq-01-12.bilivideo.com",
        "cn-hk-eq-01-13.bilivideo.com",
        "cn-hk-eq-01-14.bilivideo.com",
        "cn-hk-eq-bcache-13.bilivideo.com"
    ],
    "黑省": [
        "cn-hljheb-cm-01-01.bilivideo.com",
        "cn-hljheb-cm-01-03.bilivideo.com",
        "cn-hljheb-ct-01-02.bilivideo.com",
        "cn-hljheb-ct-01-03.bilivideo.com",
        "cn-hljheb-ct-01-04.bilivideo.com",
        "cn-hljheb-ct-01-07.bilivideo.com"
    ]
},
    buildTime: "2026-09-26T22:32:49Z"
};
// ===EMBEDDED_END===
    // ===CORE_START===
/* CCB 媒体选源与 Range 调度内核。可在浏览器和 Node 测试中独立使用。 */
;(function (root, factory) {
    const api = factory()
    if (typeof module === 'object' && module.exports) module.exports = api
    else root.CcbCore = api
})(typeof globalThis === 'object' ? globalThis : this, function () {
    'use strict'
    const MIRRORS = ['upos-sz-mirrorali.bilivideo.com', 'upos-sz-mirrorcos.bilivideo.com',
        'upos-sz-mirrorhw.bilivideo.com', 'upos-sz-mirror08c.bilivideo.com']
    const BUDGET = 16 * 1024 * 1024
    const CHUNK = 512 * 1024
    const abortError = () => new DOMException('请求已取消', 'AbortError')
    const ordinary = value => {
        try {
            const u = new URL(value)
            return u.protocol === 'https:' && /^upos-(?!tf-)[\w-]+\.bilivideo\.com$/.test(u.hostname)
                && !/-302(?:\.|-)/.test(u.hostname) && u.pathname.startsWith('/upgcxcode/')
                && u.searchParams.get('os') !== 'mcdn'
        } catch (_) { return false }
    }
    const host = value => { try { return new URL(value).hostname } catch (_) { return '' } }
    const swap = (value, node) => {
        if (!ordinary(value)) return null
        try {
            const u = new URL(value), n = new URL(node.includes('://') ? node : `https://${node}`)
            if (n.protocol !== 'https:' || !/^(?:upos-[\w-]+|cn-[\w-]+)\.bilivideo\.com$/.test(n.hostname)) return null
            u.hostname = n.hostname; u.port = ''
            return u.href
        } catch (_) { return null }
    }
    const range = value => {
        const m = /^bytes=(\d+)-(\d+)$/.exec(value || '')
        if (!m) return null
        const start = Number(m[1]), end = Number(m[2])
        return Number.isSafeInteger(end) && end >= start ? { start, end, size: end - start + 1 } : null
    }
    const contentRange = value => {
        const m = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(value || '')
        if (!m) return null
        const [start, end, total] = m.slice(1).map(Number)
        return [start, end, total].every(Number.isSafeInteger) && start <= end && end < total ? { start, end, total } : null
    }
    const sameBytes = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])
    const expiry = value => {
        try {
            const p = new URL(value).searchParams
            const e = p.get('deadline') || p.get('expires')
            return e && /^\d+$/.test(e) ? Number(e) * 1000 : Infinity
        } catch (_) { return 0 }
    }
    const makeResponse = (bytes, headers, url, status = 206) => {
        const h = new Headers(headers)
        h.delete('content-encoding'); h.delete('transfer-encoding'); h.set('content-length', String(bytes.byteLength))
        const r = new Response(bytes, { status, headers: h })
        Object.defineProperty(r, 'url', { value: url })
        return r
    }

    function create(options = {}) {
        const transport = options.transport || ((url, init) => fetch(url, init))
        const config = options.config || (() => ({}))
        const now = options.now || Date.now
        const resources = new Set(), urls = new Map(), active = new Set()
        let lastVideo = null
        let reserved = 0
        const waiters = new Set()
        const notify = event => options.onStatus?.({ time: now(), ...event })
        const wake = () => { for (const f of [...waiters]) f() }
        async function reserve(size, signal) {
            if (signal.aborted) throw abortError()
            if (reserved + size > BUDGET) await new Promise((resolve, reject) => {
                const cancel = () => { waiters.delete(check); reject(abortError()) }
                const check = () => {
                    if (reserved + size <= BUDGET) { waiters.delete(check); signal.removeEventListener('abort', cancel); reserved += size; resolve() }
                }
                waiters.add(check); signal.addEventListener('abort', cancel, { once: true })
            })
            else reserved += size
        }
        function register(rep, kind = 'video') {
            const primary = rep.baseUrl || rep.base_url
            const backup = rep.backupUrl || rep.backup_url || rep.backup_url_list || []
            if (typeof primary !== 'string') return null
            const originals = [...new Set([primary, ...(Array.isArray(backup) ? backup : [])].filter(v => {
                try { const u = new URL(v); return u.protocol === 'https:' && /(?:^|\.)(?:bilivideo\.(?:com|cn|net)|akamaized\.net)$/.test(u.hostname) } catch (_) { return false }
            }))]
            if (!originals.length) return null
            const key = `${kind}:${rep.id || ''}:${primary}`
            let r = [...resources].find(x => x.key === key)
            if (!r) {
                r = { key, kind, id: rep.id, primary, originals, bandwidth: Number(rep.bandwidth) || 0,
                    probes: new Map(), health: new Map(), parallel: true, expanded: false,
                    switchedAt: 0, windows: [], windowAt: now(), windowBytes: 0, threads: 4 }
                resources.add(r)
            }
            for (const u of originals) urls.set(u, r)
            for (const u of candidates(r)) urls.set(u, r)
            return r
        }
        function candidates(r) {
            const c = config(), preferred = c.preferred
            if (c.enabled === false) return r.originals
            if (r.kind === 'audio' && c.audioOriginal) return [...r.originals.slice(1), r.primary]
            const nodes = [preferred, ...MIRRORS, ...(c.shenzhen || []).slice(0, 2)].filter(v => typeof v === 'string' && v)
            const chosen = swap(r.originals.find(ordinary) || '', preferred || '')
            const local = [...new Set([chosen, ...nodes.filter(n => host(`https://${n}`)?.includes('-sz-')).map(n => swap(r.originals.find(ordinary) || '', n))].filter(Boolean))]
            const others = [...r.originals.slice(1), ...MIRRORS.map(n => swap(r.originals.find(ordinary) || '', n)), r.primary]
            const banned = new Set(c.blacklist || [])
            return [...new Set([...local, ...others].filter(Boolean))].filter(u => !banned.has(host(u)))
        }
        const isLocal = (r, u) => u === swap(r.originals.find(ordinary) || '', config().preferred || '') || host(u).includes('-sz-')
        function failure(r, u, error) {
            if (error?.name === 'AbortError') return
            const h = r.health.get(u) || { failures: 0, blockedUntil: 0 }
            h.failures++
            if (h.failures >= 2) h.blockedUntil = now() + 60000
            r.health.set(u, h)
            notify({ kind: r.kind, node: host(u), reason: error.message || '请求失败', state: '冷却', blockedUntil: h.blockedUntil })
        }
        function sample(r, u, bytes, ms, finalUrl) {
            const bps = bytes * 1000 / Math.max(ms, 1)
            const h = r.health.get(u) || { failures: 0, blockedUntil: 0 }
            h.bps = h.bps ? h.bps * .7 + bps * .3 : bps; h.failures = 0; h.blockedUntil = 0
            r.health.set(u, h)
            notify({ kind: r.kind, node: host(finalUrl || u), requestedNode: host(u), bps,
                state: '播放下载', reason: finalUrl && host(finalUrl) !== host(u) ? '服务端重定向' : r.expanded ? '首选池不可用或持续过慢，已回退' : '首选池' })
            const playback = options.playback?.() || {}
            if (!playback.demand) { r.windows = []; r.windowBytes = 0; r.windowAt = now(); return }
            r.windowBytes += bytes
            const elapsed = now() - r.windowAt
            if (elapsed >= 5000) {
                r.windows.push(r.windowBytes * 8000 / elapsed); r.windows = r.windows.slice(-2)
                r.windowBytes = 0; r.windowAt = now()
                if (playback.demand && playback.buffer < 10 && r.bandwidth > 0 && r.windows.length === 2
                    && r.windows.every(v => v < r.bandwidth * 1.3) && now() - r.switchedAt >= 30000) {
                    r.expanded = true; r.switchedAt = now()
                }
                if (config().threads === 'auto' || !config().threads) {
                    r.threads = Math.max(2, Math.min(8, r.threads + (playback.demand && playback.buffer < 10 ? 1 : -1)))
                }
            }
        }
        async function readRange(u, start, end, signal, timeout = 8000) {
            if (signal?.aborted) throw abortError()
            const ctrl = new AbortController()
            const cancel = () => ctrl.abort()
            signal?.addEventListener('abort', cancel, { once: true })
            const timer = setTimeout(cancel, timeout)
            try {
                const response = await transport(u, { method: 'GET', headers: { Range: `bytes=${start}-${end}` },
                    signal: ctrl.signal, timeout, maxBytes: end - start + 1 })
                if (!response.status || response.type === 'opaque') throw new TypeError('响应不可读取，内容未知')
                if (response.status !== 206) throw Object.assign(new Error(`HTTP ${response.status}，未返回有效分片`), { status: response.status })
                const cr = contentRange(response.headers.get('content-range'))
                if (!cr || cr.start !== start || cr.end !== Math.min(end, cr.total - 1)) throw new Error('Content-Range 不匹配')
                const bytes = new Uint8Array(await response.arrayBuffer())
                if (bytes.length !== cr.end - cr.start + 1) throw new Error('分片长度不匹配')
                return { bytes, cr, headers: response.headers, url: response.url || u }
            } catch (e) {
                if (ctrl.signal.aborted && !signal?.aborted) throw new Error('请求超时')
                throw e
            } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel) }
        }
        async function probe(r, u, signal, size = 65536) {
            const old = r.probes.get(u)
            if (old && old.until > now() && size === 65536) return old
            if (expiry(u) <= now() + 1000) return { state: 'expired', hasContent: false, url: u }
            const started = now()
            try {
                const data = await readRange(u, 0, size - 1, signal, 3000)
                const result = { ...data, state: 'valid', hasContent: true, bps: data.bytes.length * 1000 / Math.max(now() - started, 1),
                    until: Math.min(now() + 90000, expiry(u)), source: u }
                if (size === 65536) r.probes.set(u, result)
                notify({ kind: r.kind, node: host(data.url), state: '已验证', bps: result.bps })
                return result
            } catch (e) {
                if (signal?.aborted) throw e
                const result = { state: e instanceof TypeError ? 'unknown' : 'invalid', hasContent: e instanceof TypeError ? null : false, error: e, until: now() + 15000 }
                if (size === 65536) r.probes.set(u, result)
                failure(r, u, e)
                return result
            }
        }
        function compatible(a, b) {
            if (a.cr.total !== b.cr.total || !sameBytes(a.bytes, b.bytes)) return false
            const ae = a.headers.get('etag'), be = b.headers.get('etag')
            const strong = ae && be && !ae.startsWith('W/') && ae === be
            const au = new URL(a.source), bu = new URL(b.source)
            return !!strong || au.pathname + au.search === bu.pathname + bu.search
        }
        async function eligible(r, signal) {
            let pool = candidates(r).filter(u => (r.health.get(u)?.blockedUntil || 0) <= now())
            const local = pool.filter(u => isLocal(r, u))
            if (!r.expanded && local.length) pool = local
            else if (r.expanded) pool = [...local.slice(0, 3), ...pool.filter(u => !isLocal(r, u)).slice(0, 3)]
            pool = pool.slice(0, 6)
            let out = []
            // 分批验活，首批最多六个；无可用节点再检查余下节点。
            for (let i = 0; i < pool.length && !out.length; i += 6) {
                const batch = pool.slice(i, i + 6)
                for (let j = 0; j < batch.length; j += 3) {
                    const results = await Promise.all(batch.slice(j, j + 3).map(async u => ({ u, p: await probe(r, u, signal) })))
                    out.push(...results.filter(x => x.p.state === 'valid'))
                }
            }
            if (!out.length && !r.expanded) { r.expanded = true; r.switchedAt = now(); return eligible(r, signal) }
            const preferred = swap(r.originals.find(ordinary) || '', config().preferred || '')
            const speed = x => r.health.get(x.u)?.bps || x.p.bps
            out.sort((a, b) => (!r.expanded && a.u === preferred ? -1 : !r.expanded && b.u === preferred ? 1 : speed(b) - speed(a)))
            if (out.length) out = out.filter(x => compatible(out[0].p, x.p))
            return out
        }
        async function route(input, init = {}) {
            const u = typeof input === 'string' ? input : input.url
            const r = urls.get(u), c = config()
            if (!r || c.enabled === false) return null
            if (r.kind === 'video') lastVideo = r
            const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined))
            const wanted = range(headers.get('range'))
            if ((init.method || input.method || 'GET').toUpperCase() !== 'GET' || !wanted || wanted.size > BUDGET) {
                notify({ kind: r.kind, state: '原生下载', reason: '非有限 Range 请求或超过 16 MiB' }); return null
            }
            if (!r.originals.some(ordinary)) {
                notify({ kind: r.kind, state: '原生下载', node: host(u), reason: '特殊路径或 M CDN，保留原始地址' }); return null
            }
            const ctrl = new AbortController(), signal = init.signal || input.signal
            const cancel = () => ctrl.abort()
            if (signal?.aborted) throw abortError()
            signal?.addEventListener('abort', cancel, { once: true }); active.add(ctrl)
            let allocated = false
            try {
                await reserve(wanted.size, ctrl.signal); allocated = true
                const available = await eligible(r, ctrl.signal)
                if (!available.length) {
                    const signatureFailure = r.originals.every(x => expiry(x) <= now() + 1000)
                        || r.originals.some(x => r.probes.get(x)?.error?.status === 403)
                    if (signatureFailure && !r.refreshTried && options.refresh) {
                        r.refreshTried = true
                        // 刷新地址会清空旧资源；先释放旧请求占用，避免递归等待预算。
                        reserved -= wanted.size; allocated = false; wake(); active.delete(ctrl)
                        try {
                            const fresh = await options.refresh(r)
                            if (fresh) { fresh.refreshTried = true; return await route(fresh.primary, init) }
                        } catch (e) { if (signal?.aborted) throw e }
                    }
                    notify({ kind: r.kind, state: '原生下载', reason: '没有已验证的兼容节点' })
                    return null
                }
                const total = available[0].p.cr.total
                if (wanted.end >= total) return null
                const threads = c.acceleration === false || !r.parallel || !r.originals.some(ordinary) ? 1
                    : c.threads && c.threads !== 'auto' ? Math.max(2, Math.min(8, Number(c.threads) || 4)) : r.threads
                const output = new Uint8Array(wanted.size)
                let cursor = wanted.start, lastUrl = available[0].u
                const group = new AbortController()
                const groupCancel = () => group.abort()
                ctrl.signal.addEventListener('abort', groupCancel, { once: true })
                const task = async index => {
                    while (cursor <= wanted.end) {
                        const start = cursor, end = Math.min(start + CHUNK - 1, wanted.end); cursor = end + 1
                        let good = false, error
                        for (let attempt = 0; attempt < 3; attempt++) {
                            if (group.signal.aborted) throw abortError()
                            const target = available[(index + attempt) % available.length]
                            try {
                                const started = now(), part = await readRange(target.u, start, end, group.signal)
                                const etag = part.headers.get('etag'), initial = target.p.headers.get('etag')
                                if (part.cr.total !== total || (etag && initial && etag !== initial)) throw new Error('资源在下载期间发生变化')
                                output.set(part.bytes, start - wanted.start); lastUrl = part.url
                                sample(r, target.u, part.bytes.length, now() - started, part.url); good = true; break
                            } catch (e) { error = e; if (group.signal.aborted) throw e; failure(r, target.u, e) }
                        }
                        if (!good) throw error
                    }
                }
                const tasks = Array.from({ length: Math.min(threads, Math.ceil(wanted.size / CHUNK)) }, (_, i) => task(i))
                try { await Promise.all(tasks) }
                catch (e) {
                    group.abort(); await Promise.allSettled(tasks)
                    if (ctrl.signal.aborted) throw abortError()
                    r.parallel = false; notify({ kind: r.kind, state: '单连接降级', reason: e.message })
                    try {
                        const part = await readRange(r.primary, wanted.start, wanted.end, ctrl.signal)
                        return makeResponse(part.bytes, part.headers, part.url)
                    } catch (fallbackError) {
                        if (fallbackError.status === 403 && !r.refreshTried && options.refresh) {
                            r.refreshTried = true; reserved -= wanted.size; allocated = false; wake(); active.delete(ctrl)
                            const fresh = await options.refresh(r)
                            if (fresh) { fresh.refreshTried = true; return await route(fresh.primary, init) }
                        }
                        throw fallbackError
                    }
                } finally { ctrl.signal.removeEventListener('abort', groupCancel) }
                const outHeaders = new Headers(available[0].p.headers)
                outHeaders.set('content-range', `bytes ${wanted.start}-${wanted.end}/${total}`)
                return makeResponse(output, outHeaders, lastUrl)
            } finally {
                if (allocated) { reserved -= wanted.size; wake() }
                active.delete(ctrl); signal?.removeEventListener('abort', cancel)
            }
        }
        const cancel = () => { for (const c of active) c.abort() }
        const reset = () => { cancel(); resources.clear(); urls.clear(); lastVideo = null }
        return { register, route, probe, candidates, resources, reset, cancel,
            resourceFor: url => urls.get(url),
            first: () => lastVideo || [...resources].find(r => r.kind === 'video'),
            inspect: () => ({ resources: resources.size, reserved, active: active.size }) }
    }

    // XHR 只接管异步 GET arraybuffer 分片，其余请求保留浏览器原生行为。
    function xhrAdapter(Native, route) {
        return class extends Native {
            open(method, url, async = true, ...rest) {
                this._ccb = null; this._ccbReq = { method, url: String(url), async, headers: {} }
                return super.open(method, url, async, ...rest)
            }
            setRequestHeader(k, v) { if (this._ccbReq) this._ccbReq.headers[k] = v; return super.setRequestHeader(k, v) }
            get readyState() { return this._ccb ? this._ccb.readyState : super.readyState }
            get status() { return this._ccb ? this._ccb.status : super.status }
            get statusText() { return this._ccb ? this._ccb.statusText : super.statusText }
            get responseURL() { return this._ccb ? this._ccb.url : super.responseURL }
            get response() { return this._ccb ? this._ccb.body : super.response }
            get responseText() { if (this._ccb) throw new DOMException('响应类型为 arraybuffer', 'InvalidStateError'); return super.responseText }
            getAllResponseHeaders() { return this._ccb ? [...this._ccb.headers].map(([k, v]) => `${k}: ${v}\r\n`).join('') : super.getAllResponseHeaders() }
            getResponseHeader(k) { return this._ccb ? this._ccb.headers.get(k) : super.getResponseHeader(k) }
            send(body) {
                const req = this._ccbReq
                if (!req || !req.async || req.method.toUpperCase() !== 'GET' || this.responseType !== 'arraybuffer'
                    || this.withCredentials || body != null || !range(new Headers(req.headers).get('range'))) return super.send(body)
                if (this._ccbCtrl) throw new DOMException('请求已经发送', 'InvalidStateError')
                const ctrl = new AbortController(); this._ccbCtrl = ctrl
                let timedOut = false
                const timer = this.timeout ? setTimeout(() => { timedOut = true; ctrl.abort() }, this.timeout) : null
                const emit = type => this.dispatchEvent(new Event(type))
                Promise.resolve().then(() => route(req.url, { method: req.method, headers: req.headers, signal: ctrl.signal }))
                    .then(async response => {
                        if (ctrl.signal.aborted) throw abortError()
                        if (!response) { clearTimeout(timer); this._ccbCtrl = null; return super.send(body) }
                        this._ccb = { readyState: 2, status: response.status, statusText: response.statusText, url: response.url, headers: response.headers, body: null }
                        emit('loadstart'); emit('readystatechange')
                        this._ccb.readyState = 3; emit('readystatechange')
                        this._ccb.body = await response.arrayBuffer()
                        if (ctrl.signal.aborted) throw abortError()
                        this._ccb.readyState = 4; emit('readystatechange')
                        this.dispatchEvent(new ProgressEvent('progress', { lengthComputable: true, loaded: this._ccb.body.byteLength, total: this._ccb.body.byteLength }))
                        emit('load'); emit('loadend')
                    }).catch(e => {
                        this._ccb = { readyState: ctrl.signal.aborted && !timedOut ? 0 : 4, status: 0, statusText: '', url: '', headers: new Headers(), body: null }
                        emit('readystatechange'); emit(timedOut ? 'timeout' : e.name === 'AbortError' ? 'abort' : 'error'); emit('loadend')
                    }).finally(() => { clearTimeout(timer); if (this._ccbCtrl === ctrl) this._ccbCtrl = null })
            }
            abort() { if (this._ccbCtrl) this._ccbCtrl.abort(); else super.abort() }
        }
    }
    return { create, xhrAdapter, ordinary, swap, range, contentRange, MIRRORS, BUDGET, CHUNK }
})

/* Worker 使用专用消息通道调用页面内核，避免两套选源状态发生分歧。 */
function ccbWorkerRuntime(channel) {
    if (self.__CCB_RANGE_WORKER__) return
    self.__CCB_RANGE_WORKER__ = true
    const pending = new Map()
    let serial = 0
    self.addEventListener('message', event => {
        const m = event.data
        if (!m || m.channel !== channel || m.type !== 'result') return
        event.stopImmediatePropagation()
        const p = pending.get(m.id)
        if (!p) return
        pending.delete(m.id); p.cleanup()
        if (m.error) p.reject(Object.assign(new Error(m.error), { name: m.name || 'Error' }))
        else if (m.skip) p.resolve(null)
        else {
            const response = new Response(m.body, { status: m.status, headers: m.headers })
            Object.defineProperty(response, 'url', { value: m.url })
            p.resolve(response)
        }
    })
    const route = (url, init = {}) => {
        if (!self.CcbCore.range(new Headers(init.headers).get('range')) || !String(url).includes('/upgcxcode/')) return Promise.resolve(null)
        return new Promise((resolve, reject) => {
            const id = ++serial, signal = init.signal
            const abort = () => {
                self.postMessage({ channel, type: 'cancel', id }); pending.delete(id); cleanup()
                reject(new DOMException('请求已取消', 'AbortError'))
            }
            const timer = setTimeout(() => {
                self.postMessage({ channel, type: 'cancel', id }); pending.delete(id); cleanup()
                reject(new Error('Worker 分片请求超时'))
            }, 60000)
            const cleanup = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort) }
            if (signal?.aborted) { abort(); return }
            pending.set(id, { resolve, reject, cleanup })
            signal?.addEventListener('abort', abort, { once: true })
            self.postMessage({ channel, type: 'request', id, url: String(url), headers: [...new Headers(init.headers)], method: init.method || 'GET' })
        })
    }
    const nativeFetch = self.fetch.bind(self)
    self.fetch = async (input, init = {}) => {
        const request = new Request(input, init)
        const response = await route(request.url, { method: request.method, headers: request.headers, signal: request.signal })
        if (response) return response
        const native = await nativeFetch(request)
        self.postMessage({ channel, type: 'native', requested: request.url, actual: native.url })
        return native
    }
    if (self.XMLHttpRequest) self.XMLHttpRequest = self.CcbCore.xhrAdapter(self.XMLHttpRequest, route)
}

function ccbAttachWorker(worker, channel, engine, noteNative) {
    const jobs = new Map()
    worker.addEventListener('message', event => {
        const m = event.data
        if (!m || m.channel !== channel) return
        event.stopImmediatePropagation()
        if (m.type === 'native') { noteNative?.(m.requested, m.actual); return }
        if (m.type === 'cancel') { jobs.get(m.id)?.abort(); return }
        if (m.type !== 'request' || !Number.isSafeInteger(m.id) || jobs.has(m.id)) return
        const ctrl = new AbortController(); jobs.set(m.id, ctrl)
        engine.route(m.url, { headers: m.headers, method: m.method, signal: ctrl.signal }).then(async response => {
            if (!response) worker.postMessage({ channel, type: 'result', id: m.id, skip: true })
            else {
                const body = await response.arrayBuffer()
                worker.postMessage({ channel, type: 'result', id: m.id, body, headers: [...response.headers], status: response.status, url: response.url }, [body])
            }
        }).catch(e => worker.postMessage({ channel, type: 'result', id: m.id, error: e.message, name: e.name }))
            .finally(() => jobs.delete(m.id))
    })
    const terminate = worker.terminate.bind(worker)
    worker.terminate = () => { for (const c of jobs.values()) c.abort(); jobs.clear(); terminate() }
    return worker
}

// ===CORE_END===
    const Core = globalThis.CcbCore
    let regionList = ['手动输入']
    let cdnDataCache = EMBEDDED.cdn
    const nativeFetch = unsafeWindow.fetch.bind(unsafeWindow)
    const diagnostics = { events: [], video: null, audio: null }
    let lastPlayRequest = null
    let playFingerprint = ''
    const liveRoutes = new Map()

    // API 源列表，按优先级排列 — jsDelivr 国内可访问，GitHub Pages 作为备用
    const API_SOURCES = [
        'https://cdn.jsdelivr.net/gh/maxzrb/bilibiliccb@main/data',
        'https://raw.githubusercontent.com/maxzrb/bilibiliccb/main/data',
        'https://maxzrb.github.io/bilibiliccb/api',
        'https://cdn.jsdelivr.net/gh/Kanda-Akihito-Kun/ccb@main/data',
        'https://raw.githubusercontent.com/Kanda-Akihito-Kun/ccb/main/data',
        'https://kanda-akihito-kun.github.io/ccb/api',
    ];

    const defaultCdnNode = '使用默认源'
    const manualRegionName = '手动输入'
    const mainHost = 'www.bilibili.com'
    const liveHost = 'live.bilibili.com'

    const oldCdnNodeStored = 'CCB'
    const oldRegionStored = 'region'
    const mainCdnNodeStored = 'CCB_main'
    const mainRegionStored = 'region_main'
    const diagnosticsCdnNodeStored = 'CCB_diagnostics'
    const diagnosticsRegionStored = 'region_diagnostics'
    const liveCdnNodeStored = 'CCB_live'
    const liveRegionStored = 'region_live'
    const powerModeStored = 'powerMode'
    const liveModeStored = 'liveMode'
    const ispFilterStored = 'CCB_ispFilter'
    const STUCK_TIMEOUT_KEY = 'CCB_stuckTimeout'

    // ====== ISP 识别工具 ======
    // CDN 节点名中的运营商标记: ct=电信, cu=联通, cm/cmcc=移动
    const ISP_MAP = { ct: '电信', cu: '联通', cm: '移动', cmcc: '移动' }
    const ISP_ORDER = ['电信', '联通', '移动', '其他']
    const detectIsp = (nodeName) => {
        const m = String(nodeName).match(/(?:^|-)(ct|cu|cm|cmcc)(?:-|\b)/i)
        return m ? (ISP_MAP[m[1].toLowerCase()] || '其他') : '其他'
    }
    const getIspFilter = () => GM_getValue(ispFilterStored, '全部')
    const setIspFilter = (v) => GM_setValue(ispFilterStored, v)
    // 按 ISP 排序：优先同运营商，再按名称排序
    const sortByIsp = (nodes, preferredIsp) => {
        const order = preferredIsp && preferredIsp !== '全部'
            ? [preferredIsp, ...ISP_ORDER.filter(i => i !== preferredIsp)]
            : ISP_ORDER
        const rank = (isp) => { const i = order.indexOf(isp); return i === -1 ? 99 : i }
        return [...nodes].sort((a, b) => {
            const ra = rank(detectIsp(a)), rb = rank(detectIsp(b))
            if (ra !== rb) return ra - rb
            return a.localeCompare(b)
        })
    }

    const logger = ((...args) => {
        console.warn(`[CCB] ${args}`, args)
    })

    const UNSET = '__CCB_UNSET__'
    const normalizeRegion = (v) => {
        if (!v) return manualRegionName
        if (v === '编辑') return manualRegionName
        return v
    }
    const migrateStoredValues = () => {
        const oldNode = GM_getValue(oldCdnNodeStored, UNSET)
        const oldRegion = GM_getValue(oldRegionStored, UNSET)
        if (oldNode !== UNSET) {
            if (GM_getValue(mainCdnNodeStored, UNSET) === UNSET) GM_setValue(mainCdnNodeStored, oldNode)
            if (GM_getValue(diagnosticsCdnNodeStored, UNSET) === UNSET) GM_setValue(diagnosticsCdnNodeStored, oldNode)
            if (GM_getValue(liveCdnNodeStored, UNSET) === UNSET) GM_setValue(liveCdnNodeStored, oldNode)
        }
        if (oldRegion !== UNSET) {
            const normalized = normalizeRegion(oldRegion)
            if (GM_getValue(mainRegionStored, UNSET) === UNSET) GM_setValue(mainRegionStored, normalized)
            if (GM_getValue(diagnosticsRegionStored, UNSET) === UNSET) GM_setValue(diagnosticsRegionStored, normalized)
            if (GM_getValue(liveRegionStored, UNSET) === UNSET) GM_setValue(liveRegionStored, normalized)
        }
    }
    migrateStoredValues()

    const isLiveContext = () => location.host === liveHost
    const isDiagnosticsContext = () => location.host === mainHost && (location.pathname || '').startsWith('/blackboard/video-diagnostics.html')
    const getContextKey = () => {
        if (isLiveContext()) return 'live'
        if (isDiagnosticsContext()) return 'diagnostics'
        return 'main'
    }

    const getTargetCdnNode = (ctx = getContextKey()) => GM_getValue(
        ctx === 'live' ? liveCdnNodeStored : (ctx === 'diagnostics' ? diagnosticsCdnNodeStored : mainCdnNodeStored),
        GM_getValue(oldCdnNodeStored, defaultCdnNode),
    )
    const getRegion = (ctx = getContextKey()) => normalizeRegion(GM_getValue(
        ctx === 'live' ? liveRegionStored : (ctx === 'diagnostics' ? diagnosticsRegionStored : mainRegionStored),
        normalizeRegion(GM_getValue(oldRegionStored, manualRegionName)),
    ))
    const setTargetCdnNode = (ctx, value) => {
        GM_setValue(ctx === 'live' ? liveCdnNodeStored : (ctx === 'diagnostics' ? diagnosticsCdnNodeStored : mainCdnNodeStored), value)
        settings.contexts = settings.contexts || {}
        settings.contexts[ctx] = { node: value, region: getRegion(ctx) }
        GM_setValue(SETTINGS_KEY, settings)
        invalidateConfig(); engine.cancel()
    }
    const setRegion = (ctx, value) => {
        GM_setValue(ctx === 'live' ? liveRegionStored : (ctx === 'diagnostics' ? diagnosticsRegionStored : mainRegionStored), value)
        settings.contexts = settings.contexts || {}
        settings.contexts[ctx] = { node: getTargetCdnNode(ctx), region: value }
        GM_setValue(SETTINGS_KEY, settings)
    }
    const getPowerMode = () => GM_getValue(powerModeStored, true)
    const getLiveMode = () => GM_getValue(liveModeStored, false)
    const isCcbEnabled = () => getTargetCdnNode() !== defaultCdnNode
    const hasMediaDomain = (s) => typeof s === 'string' && (
        s.indexOf('bilivideo.') !== -1
        || s.indexOf('acgvideo.') !== -1
        || s.indexOf('edge.mountaintoys.cn') !== -1
        || s.indexOf('akamaized.net') !== -1
    )

    const isLiveRoomPage = () => {
        if (location.host !== liveHost) return false
        const p = location.pathname || '/'
        return /^\/\d+\/?$/.test(p) || /^\/blanc\/\d+\/?$/.test(p)
    }

    const shouldApplyReplacement = () => {
        if (!isCcbEnabled()) return false
        if (location.host === liveHost) {
            if (!isLiveRoomPage()) return false
            if (!getLiveMode()) return false
        }
        return true
    }

    const shouldInstallWorkerHooks = () => {
        if (!shouldApplyReplacement()) return false
        const host = location.host
        const pathname = location.pathname || '/'
        if (host === mainHost) {
            return pathname.startsWith('/bangumi/play/')
                || pathname.startsWith('/video/')
                || pathname.startsWith('/cheese/play/')
        }
        if (host === liveHost) return isLiveRoomPage()
        return false
    }

    const getReplacement = () => {
        let target = getTargetCdnNode()
        if (target.indexOf('://') === -1) target = 'https://' + target
        if (!target.endsWith('/')) target = target + '/'
        return target
    }

    const getReplacementNoSlash = () => {
        const r = getReplacement()
        return r.endsWith('/') ? r.slice(0, -1) : r
    }

    const getReplacementHost = () => {
        try {
            return new URL(getReplacement()).host
        } catch (_) {
            return ''
        }
    }

    // 获取当前地区的所有 CDN 节点列表，用于 backup_url 多样化容灾
    const getRegionCdnNodes = (region) => {
        try {
            const data = cdnDataCache || EMBEDDED.cdn || {}
            return (data && data[region]) || []
        } catch (_) { return [] }
    }

    const IGNORE_HOST_RE = /^(?:bvc|data|pbp|api|api\w+)\./

    // 点播请求由内核处理，保留原始备用节点及签名。
    const replaceMediaUrl = s => s

    const replaceMediaHostValue = (s) => {
        if (typeof s !== 'string') return s
        if (!shouldApplyReplacement()) return s
        if (!hasMediaDomain(s)) return s

        try {
            const u = new URL(s.startsWith('//') ? `https:${s}` : s)
            if (IGNORE_HOST_RE.test(u.hostname)) return s
        } catch (_) {
            const m = s.match(/^https?:\/\/([\w.-]+)/) || s.match(/^\/\/([\w.-]+)/)
            if (m && IGNORE_HOST_RE.test(m[1])) return s
        }

        if (s.startsWith('http://') || s.startsWith('https://')) return getReplacementNoSlash()
        if (s.startsWith('//')) return getReplacementNoSlash().replace(/^https?:/, '')
        if (/^[^/]+$/.test(s)) return getReplacementHost()
        return s
    }

    // ===INTEGRATION_START===
// 此文件在构建时嵌入主脚本，沿用主脚本已有的 GM 配置。
const SETTINGS_KEY = 'CCB_settings_v1'
let settings = GM_getValue(SETTINGS_KEY, null)
if (!settings || settings.version !== 1) {
    settings = { version: 1, acceleration: true, threads: 'auto', audioOriginal: false,
        contexts: Object.fromEntries(['main', 'live', 'diagnostics'].map(ctx => [ctx, { node: getTargetCdnNode(ctx), region: getRegion(ctx) }])) }
    GM_setValue(SETTINGS_KEY, settings)
    GM_setValue('CCB_legacyBlacklist', GM_getValue('CCB_failCount', '{}'))
}
let configCache = null
const invalidateConfig = () => { configCache = null }
const getFailCount = () => { try { return JSON.parse(GM_getValue('CCB_manualBlacklist', '{}')) } catch (_) { return {} } }
const addFailCount = node => {
    const list = getFailCount(); list[node] = 1
    GM_setValue('CCB_manualBlacklist', JSON.stringify(list)); invalidateConfig()
}
const getNodeFailCount = node => getFailCount()[node] || 0
const noteNative = (requested, actual) => {
    const r = engine.resourceFor(requested)
    if (!r) return
    let node, requestedNode
    try { node = new URL(actual || requested).hostname; requestedNode = new URL(requested).hostname } catch (_) { return }
    const event = { time: Date.now(), kind: r.kind, node,
        state: '原生下载', reason: node !== requestedNode ? '服务端重定向（原生通道）' : '原生通道，速度未知' }
    diagnostics[r.kind] = event; diagnostics.events.push(event)
    if (diagnostics.events.length > 50) diagnostics.events.shift()
    document.dispatchEvent(new Event('ccb-status'))
}
const mediaConfig = () => {
    if (!configCache) {
        const preferred = getTargetCdnNode()
        configCache = { ...settings, enabled: !isLiveContext() && preferred !== defaultCdnNode,
            preferred: preferred === defaultCdnNode ? '' : preferred,
            shenzhen: (cdnDataCache && cdnDataCache['深圳']) || Core.MIRRORS,
            blacklist: Object.keys(getFailCount()) }
    }
    return configCache
}
const persistSettings = () => { GM_setValue(SETTINGS_KEY, settings); invalidateConfig(); engine.cancel() }
const mediaTransport = (url, init) => new Promise((resolve, reject) => {
    let finished = false, request
    const finish = (error, value) => {
        if (finished) return
        finished = true; init.signal?.removeEventListener('abort', abort)
        error ? reject(error) : resolve(value)
    }
    const abort = () => { finish(new DOMException('请求已取消', 'AbortError')); request?.abort() }
    if (init.signal?.aborted) { abort(); return }
    init.signal?.addEventListener('abort', abort, { once: true })
    request = GM_xmlhttpRequest({ method: 'GET', url, responseType: 'arraybuffer', anonymous: true,
        headers: { ...init.headers, Referer: 'https://www.bilibili.com/' }, timeout: init.timeout,
        onprogress: e => {
            if (e.loaded > init.maxBytes) { finish(new Error('服务器忽略 Range 或返回过量数据')); request?.abort() }
        },
        onload: r => {
            const headers = new Headers()
            for (const line of (r.responseHeaders || '').split(/\r?\n/)) {
                const i = line.indexOf(':')
                if (i > 0) { try { headers.append(line.slice(0, i), line.slice(i + 1).trim()) } catch (_) {} }
            }
            try {
                if (!r.status) throw new TypeError('响应状态不可读取，内容未知')
                const body = r.response || new ArrayBuffer(0)
                if (body.byteLength > init.maxBytes) throw new Error('响应超过 Range 限额')
                const response = new Response(body, { status: r.status, headers })
                Object.defineProperty(response, 'url', { value: r.finalUrl || url }); finish(null, response)
            } catch (e) { finish(e) }
        },
        onerror: () => finish(new TypeError('网络不可达或跨域权限未授予，内容未知')),
        ontimeout: () => finish(new Error('请求超时')),
        onabort: () => finish(new DOMException('请求已取消', 'AbortError')),
    })
})
const playback = () => {
    const v = document.querySelector('video')
    let buffer = 0
    if (v) for (let i = 0; i < v.buffered.length; i++) {
        if (v.buffered.start(i) <= v.currentTime && v.currentTime <= v.buffered.end(i)) buffer = v.buffered.end(i) - v.currentTime
    }
    return { demand: !!v && !v.paused && !v.seeking && !v.ended, buffer }
}
const engine = Core.create({ transport: mediaTransport, config: mediaConfig, playback,
    onStatus: event => {
        if (event.state === '播放下载') diagnostics[event.kind] = event
        diagnostics.events.push(event)
        if (diagnostics.events.length > 50) diagnostics.events.shift()
        document.dispatchEvent(new Event('ccb-status'))
    },
    refresh: async r => {
        if (!lastPlayRequest) return null
        const endpoint = new URL(lastPlayRequest)
        // 媒体过期时旧 WBI 时间戳也可能过期，使用同参数的合法网页播放接口。
        if (endpoint.pathname === '/x/player/wbi/playurl') {
            endpoint.pathname = '/x/player/playurl'
            endpoint.searchParams.delete('w_rid'); endpoint.searchParams.delete('wts')
        }
        const response = await nativeFetch(endpoint.href, { credentials: 'include', cache: 'no-store' })
        const data = await response.json()
        if (data.code !== undefined && data.code !== 0) return null
        registerPlayInfo(data)
        return [...engine.resources].find(x => x.kind === r.kind && x.id === r.id) || null
    }
})
const registerPlayInfo = obj => {
    const found = []
    const visit = (value, kind = 'video', depth = 0) => {
        if (!value || typeof value !== 'object' || depth > 12) return
        if (Array.isArray(value)) { value.forEach(x => visit(x, kind, depth + 1)); return }
        if (typeof (value.baseUrl || value.base_url) === 'string') found.push({ value, kind })
        for (const [key, v] of Object.entries(value)) if (v && typeof v === 'object') visit(v, key === 'audio' ? 'audio' : key === 'video' ? 'video' : kind, depth + 1)
    }
    visit(obj)
    if (!found.length) return
    const fingerprint = found.map(x => x.value.baseUrl || x.value.base_url).join('\n')
    if (fingerprint !== playFingerprint) { engine.reset(); playFingerprint = fingerprint; diagnostics.video = diagnostics.audio = null }
    found.forEach(x => engine.register(x.value, x.kind))
}
const transformPlayUrlResponse = obj => {
    if (!obj || typeof obj !== 'object' || (obj.code !== undefined && obj.code !== 0)) return
    registerPlayInfo(obj)
}
const workerChannel = `ccb-${crypto.randomUUID()}`
const buildWorkerPrelude = () => {
    // ===WORKER_CORE_START===
const workerCore = "/* CCB 媒体选源与 Range 调度内核。可在浏览器和 Node 测试中独立使用。 */\n;(function (root, factory) {\n    const api = factory()\n    if (typeof module === 'object' && module.exports) module.exports = api\n    else root.CcbCore = api\n})(typeof globalThis === 'object' ? globalThis : this, function () {\n    'use strict'\n    const MIRRORS = ['upos-sz-mirrorali.bilivideo.com', 'upos-sz-mirrorcos.bilivideo.com',\n        'upos-sz-mirrorhw.bilivideo.com', 'upos-sz-mirror08c.bilivideo.com']\n    const BUDGET = 16 * 1024 * 1024\n    const CHUNK = 512 * 1024\n    const abortError = () => new DOMException('请求已取消', 'AbortError')\n    const ordinary = value => {\n        try {\n            const u = new URL(value)\n            return u.protocol === 'https:' && /^upos-(?!tf-)[\\w-]+\\.bilivideo\\.com$/.test(u.hostname)\n                && !/-302(?:\\.|-)/.test(u.hostname) && u.pathname.startsWith('/upgcxcode/')\n                && u.searchParams.get('os') !== 'mcdn'\n        } catch (_) { return false }\n    }\n    const host = value => { try { return new URL(value).hostname } catch (_) { return '' } }\n    const swap = (value, node) => {\n        if (!ordinary(value)) return null\n        try {\n            const u = new URL(value), n = new URL(node.includes('://') ? node : `https://${node}`)\n            if (n.protocol !== 'https:' || !/^(?:upos-[\\w-]+|cn-[\\w-]+)\\.bilivideo\\.com$/.test(n.hostname)) return null\n            u.hostname = n.hostname; u.port = ''\n            return u.href\n        } catch (_) { return null }\n    }\n    const range = value => {\n        const m = /^bytes=(\\d+)-(\\d+)$/.exec(value || '')\n        if (!m) return null\n        const start = Number(m[1]), end = Number(m[2])\n        return Number.isSafeInteger(end) && end >= start ? { start, end, size: end - start + 1 } : null\n    }\n    const contentRange = value => {\n        const m = /^bytes (\\d+)-(\\d+)\\/(\\d+)$/.exec(value || '')\n        if (!m) return null\n        const [start, end, total] = m.slice(1).map(Number)\n        return [start, end, total].every(Number.isSafeInteger) && start <= end && end < total ? { start, end, total } : null\n    }\n    const sameBytes = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])\n    const expiry = value => {\n        try {\n            const p = new URL(value).searchParams\n            const e = p.get('deadline') || p.get('expires')\n            return e && /^\\d+$/.test(e) ? Number(e) * 1000 : Infinity\n        } catch (_) { return 0 }\n    }\n    const makeResponse = (bytes, headers, url, status = 206) => {\n        const h = new Headers(headers)\n        h.delete('content-encoding'); h.delete('transfer-encoding'); h.set('content-length', String(bytes.byteLength))\n        const r = new Response(bytes, { status, headers: h })\n        Object.defineProperty(r, 'url', { value: url })\n        return r\n    }\n\n    function create(options = {}) {\n        const transport = options.transport || ((url, init) => fetch(url, init))\n        const config = options.config || (() => ({}))\n        const now = options.now || Date.now\n        const resources = new Set(), urls = new Map(), active = new Set()\n        let lastVideo = null\n        let reserved = 0\n        const waiters = new Set()\n        const notify = event => options.onStatus?.({ time: now(), ...event })\n        const wake = () => { for (const f of [...waiters]) f() }\n        async function reserve(size, signal) {\n            if (signal.aborted) throw abortError()\n            if (reserved + size > BUDGET) await new Promise((resolve, reject) => {\n                const cancel = () => { waiters.delete(check); reject(abortError()) }\n                const check = () => {\n                    if (reserved + size <= BUDGET) { waiters.delete(check); signal.removeEventListener('abort', cancel); reserved += size; resolve() }\n                }\n                waiters.add(check); signal.addEventListener('abort', cancel, { once: true })\n            })\n            else reserved += size\n        }\n        function register(rep, kind = 'video') {\n            const primary = rep.baseUrl || rep.base_url\n            const backup = rep.backupUrl || rep.backup_url || rep.backup_url_list || []\n            if (typeof primary !== 'string') return null\n            const originals = [...new Set([primary, ...(Array.isArray(backup) ? backup : [])].filter(v => {\n                try { const u = new URL(v); return u.protocol === 'https:' && /(?:^|\\.)(?:bilivideo\\.(?:com|cn|net)|akamaized\\.net)$/.test(u.hostname) } catch (_) { return false }\n            }))]\n            if (!originals.length) return null\n            const key = `${kind}:${rep.id || ''}:${primary}`\n            let r = [...resources].find(x => x.key === key)\n            if (!r) {\n                r = { key, kind, id: rep.id, primary, originals, bandwidth: Number(rep.bandwidth) || 0,\n                    probes: new Map(), health: new Map(), parallel: true, expanded: false,\n                    switchedAt: 0, windows: [], windowAt: now(), windowBytes: 0, threads: 4 }\n                resources.add(r)\n            }\n            for (const u of originals) urls.set(u, r)\n            for (const u of candidates(r)) urls.set(u, r)\n            return r\n        }\n        function candidates(r) {\n            const c = config(), preferred = c.preferred\n            if (c.enabled === false) return r.originals\n            if (r.kind === 'audio' && c.audioOriginal) return [...r.originals.slice(1), r.primary]\n            const nodes = [preferred, ...MIRRORS, ...(c.shenzhen || []).slice(0, 2)].filter(v => typeof v === 'string' && v)\n            const chosen = swap(r.originals.find(ordinary) || '', preferred || '')\n            const local = [...new Set([chosen, ...nodes.filter(n => host(`https://${n}`)?.includes('-sz-')).map(n => swap(r.originals.find(ordinary) || '', n))].filter(Boolean))]\n            const others = [...r.originals.slice(1), ...MIRRORS.map(n => swap(r.originals.find(ordinary) || '', n)), r.primary]\n            const banned = new Set(c.blacklist || [])\n            return [...new Set([...local, ...others].filter(Boolean))].filter(u => !banned.has(host(u)))\n        }\n        const isLocal = (r, u) => u === swap(r.originals.find(ordinary) || '', config().preferred || '') || host(u).includes('-sz-')\n        function failure(r, u, error) {\n            if (error?.name === 'AbortError') return\n            const h = r.health.get(u) || { failures: 0, blockedUntil: 0 }\n            h.failures++\n            if (h.failures >= 2) h.blockedUntil = now() + 60000\n            r.health.set(u, h)\n            notify({ kind: r.kind, node: host(u), reason: error.message || '请求失败', state: '冷却', blockedUntil: h.blockedUntil })\n        }\n        function sample(r, u, bytes, ms, finalUrl) {\n            const bps = bytes * 1000 / Math.max(ms, 1)\n            const h = r.health.get(u) || { failures: 0, blockedUntil: 0 }\n            h.bps = h.bps ? h.bps * .7 + bps * .3 : bps; h.failures = 0; h.blockedUntil = 0\n            r.health.set(u, h)\n            notify({ kind: r.kind, node: host(finalUrl || u), requestedNode: host(u), bps,\n                state: '播放下载', reason: finalUrl && host(finalUrl) !== host(u) ? '服务端重定向' : r.expanded ? '首选池不可用或持续过慢，已回退' : '首选池' })\n            const playback = options.playback?.() || {}\n            if (!playback.demand) { r.windows = []; r.windowBytes = 0; r.windowAt = now(); return }\n            r.windowBytes += bytes\n            const elapsed = now() - r.windowAt\n            if (elapsed >= 5000) {\n                r.windows.push(r.windowBytes * 8000 / elapsed); r.windows = r.windows.slice(-2)\n                r.windowBytes = 0; r.windowAt = now()\n                if (playback.demand && playback.buffer < 10 && r.bandwidth > 0 && r.windows.length === 2\n                    && r.windows.every(v => v < r.bandwidth * 1.3) && now() - r.switchedAt >= 30000) {\n                    r.expanded = true; r.switchedAt = now()\n                }\n                if (config().threads === 'auto' || !config().threads) {\n                    r.threads = Math.max(2, Math.min(8, r.threads + (playback.demand && playback.buffer < 10 ? 1 : -1)))\n                }\n            }\n        }\n        async function readRange(u, start, end, signal, timeout = 8000) {\n            if (signal?.aborted) throw abortError()\n            const ctrl = new AbortController()\n            const cancel = () => ctrl.abort()\n            signal?.addEventListener('abort', cancel, { once: true })\n            const timer = setTimeout(cancel, timeout)\n            try {\n                const response = await transport(u, { method: 'GET', headers: { Range: `bytes=${start}-${end}` },\n                    signal: ctrl.signal, timeout, maxBytes: end - start + 1 })\n                if (!response.status || response.type === 'opaque') throw new TypeError('响应不可读取，内容未知')\n                if (response.status !== 206) throw Object.assign(new Error(`HTTP ${response.status}，未返回有效分片`), { status: response.status })\n                const cr = contentRange(response.headers.get('content-range'))\n                if (!cr || cr.start !== start || cr.end !== Math.min(end, cr.total - 1)) throw new Error('Content-Range 不匹配')\n                const bytes = new Uint8Array(await response.arrayBuffer())\n                if (bytes.length !== cr.end - cr.start + 1) throw new Error('分片长度不匹配')\n                return { bytes, cr, headers: response.headers, url: response.url || u }\n            } catch (e) {\n                if (ctrl.signal.aborted && !signal?.aborted) throw new Error('请求超时')\n                throw e\n            } finally { clearTimeout(timer); signal?.removeEventListener('abort', cancel) }\n        }\n        async function probe(r, u, signal, size = 65536) {\n            const old = r.probes.get(u)\n            if (old && old.until > now() && size === 65536) return old\n            if (expiry(u) <= now() + 1000) return { state: 'expired', hasContent: false, url: u }\n            const started = now()\n            try {\n                const data = await readRange(u, 0, size - 1, signal, 3000)\n                const result = { ...data, state: 'valid', hasContent: true, bps: data.bytes.length * 1000 / Math.max(now() - started, 1),\n                    until: Math.min(now() + 90000, expiry(u)), source: u }\n                if (size === 65536) r.probes.set(u, result)\n                notify({ kind: r.kind, node: host(data.url), state: '已验证', bps: result.bps })\n                return result\n            } catch (e) {\n                if (signal?.aborted) throw e\n                const result = { state: e instanceof TypeError ? 'unknown' : 'invalid', hasContent: e instanceof TypeError ? null : false, error: e, until: now() + 15000 }\n                if (size === 65536) r.probes.set(u, result)\n                failure(r, u, e)\n                return result\n            }\n        }\n        function compatible(a, b) {\n            if (a.cr.total !== b.cr.total || !sameBytes(a.bytes, b.bytes)) return false\n            const ae = a.headers.get('etag'), be = b.headers.get('etag')\n            const strong = ae && be && !ae.startsWith('W/') && ae === be\n            const au = new URL(a.source), bu = new URL(b.source)\n            return !!strong || au.pathname + au.search === bu.pathname + bu.search\n        }\n        async function eligible(r, signal) {\n            let pool = candidates(r).filter(u => (r.health.get(u)?.blockedUntil || 0) <= now())\n            const local = pool.filter(u => isLocal(r, u))\n            if (!r.expanded && local.length) pool = local\n            else if (r.expanded) pool = [...local.slice(0, 3), ...pool.filter(u => !isLocal(r, u)).slice(0, 3)]\n            pool = pool.slice(0, 6)\n            let out = []\n            // 分批验活，首批最多六个；无可用节点再检查余下节点。\n            for (let i = 0; i < pool.length && !out.length; i += 6) {\n                const batch = pool.slice(i, i + 6)\n                for (let j = 0; j < batch.length; j += 3) {\n                    const results = await Promise.all(batch.slice(j, j + 3).map(async u => ({ u, p: await probe(r, u, signal) })))\n                    out.push(...results.filter(x => x.p.state === 'valid'))\n                }\n            }\n            if (!out.length && !r.expanded) { r.expanded = true; r.switchedAt = now(); return eligible(r, signal) }\n            const preferred = swap(r.originals.find(ordinary) || '', config().preferred || '')\n            const speed = x => r.health.get(x.u)?.bps || x.p.bps\n            out.sort((a, b) => (!r.expanded && a.u === preferred ? -1 : !r.expanded && b.u === preferred ? 1 : speed(b) - speed(a)))\n            if (out.length) out = out.filter(x => compatible(out[0].p, x.p))\n            return out\n        }\n        async function route(input, init = {}) {\n            const u = typeof input === 'string' ? input : input.url\n            const r = urls.get(u), c = config()\n            if (!r || c.enabled === false) return null\n            if (r.kind === 'video') lastVideo = r\n            const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined))\n            const wanted = range(headers.get('range'))\n            if ((init.method || input.method || 'GET').toUpperCase() !== 'GET' || !wanted || wanted.size > BUDGET) {\n                notify({ kind: r.kind, state: '原生下载', reason: '非有限 Range 请求或超过 16 MiB' }); return null\n            }\n            if (!r.originals.some(ordinary)) {\n                notify({ kind: r.kind, state: '原生下载', node: host(u), reason: '特殊路径或 M CDN，保留原始地址' }); return null\n            }\n            const ctrl = new AbortController(), signal = init.signal || input.signal\n            const cancel = () => ctrl.abort()\n            if (signal?.aborted) throw abortError()\n            signal?.addEventListener('abort', cancel, { once: true }); active.add(ctrl)\n            let allocated = false\n            try {\n                await reserve(wanted.size, ctrl.signal); allocated = true\n                const available = await eligible(r, ctrl.signal)\n                if (!available.length) {\n                    const signatureFailure = r.originals.every(x => expiry(x) <= now() + 1000)\n                        || r.originals.some(x => r.probes.get(x)?.error?.status === 403)\n                    if (signatureFailure && !r.refreshTried && options.refresh) {\n                        r.refreshTried = true\n                        // 刷新地址会清空旧资源；先释放旧请求占用，避免递归等待预算。\n                        reserved -= wanted.size; allocated = false; wake(); active.delete(ctrl)\n                        try {\n                            const fresh = await options.refresh(r)\n                            if (fresh) { fresh.refreshTried = true; return await route(fresh.primary, init) }\n                        } catch (e) { if (signal?.aborted) throw e }\n                    }\n                    notify({ kind: r.kind, state: '原生下载', reason: '没有已验证的兼容节点' })\n                    return null\n                }\n                const total = available[0].p.cr.total\n                if (wanted.end >= total) return null\n                const threads = c.acceleration === false || !r.parallel || !r.originals.some(ordinary) ? 1\n                    : c.threads && c.threads !== 'auto' ? Math.max(2, Math.min(8, Number(c.threads) || 4)) : r.threads\n                const output = new Uint8Array(wanted.size)\n                let cursor = wanted.start, lastUrl = available[0].u\n                const group = new AbortController()\n                const groupCancel = () => group.abort()\n                ctrl.signal.addEventListener('abort', groupCancel, { once: true })\n                const task = async index => {\n                    while (cursor <= wanted.end) {\n                        const start = cursor, end = Math.min(start + CHUNK - 1, wanted.end); cursor = end + 1\n                        let good = false, error\n                        for (let attempt = 0; attempt < 3; attempt++) {\n                            if (group.signal.aborted) throw abortError()\n                            const target = available[(index + attempt) % available.length]\n                            try {\n                                const started = now(), part = await readRange(target.u, start, end, group.signal)\n                                const etag = part.headers.get('etag'), initial = target.p.headers.get('etag')\n                                if (part.cr.total !== total || (etag && initial && etag !== initial)) throw new Error('资源在下载期间发生变化')\n                                output.set(part.bytes, start - wanted.start); lastUrl = part.url\n                                sample(r, target.u, part.bytes.length, now() - started, part.url); good = true; break\n                            } catch (e) { error = e; if (group.signal.aborted) throw e; failure(r, target.u, e) }\n                        }\n                        if (!good) throw error\n                    }\n                }\n                const tasks = Array.from({ length: Math.min(threads, Math.ceil(wanted.size / CHUNK)) }, (_, i) => task(i))\n                try { await Promise.all(tasks) }\n                catch (e) {\n                    group.abort(); await Promise.allSettled(tasks)\n                    if (ctrl.signal.aborted) throw abortError()\n                    r.parallel = false; notify({ kind: r.kind, state: '单连接降级', reason: e.message })\n                    try {\n                        const part = await readRange(r.primary, wanted.start, wanted.end, ctrl.signal)\n                        return makeResponse(part.bytes, part.headers, part.url)\n                    } catch (fallbackError) {\n                        if (fallbackError.status === 403 && !r.refreshTried && options.refresh) {\n                            r.refreshTried = true; reserved -= wanted.size; allocated = false; wake(); active.delete(ctrl)\n                            const fresh = await options.refresh(r)\n                            if (fresh) { fresh.refreshTried = true; return await route(fresh.primary, init) }\n                        }\n                        throw fallbackError\n                    }\n                } finally { ctrl.signal.removeEventListener('abort', groupCancel) }\n                const outHeaders = new Headers(available[0].p.headers)\n                outHeaders.set('content-range', `bytes ${wanted.start}-${wanted.end}/${total}`)\n                return makeResponse(output, outHeaders, lastUrl)\n            } finally {\n                if (allocated) { reserved -= wanted.size; wake() }\n                active.delete(ctrl); signal?.removeEventListener('abort', cancel)\n            }\n        }\n        const cancel = () => { for (const c of active) c.abort() }\n        const reset = () => { cancel(); resources.clear(); urls.clear(); lastVideo = null }\n        return { register, route, probe, candidates, resources, reset, cancel,\n            resourceFor: url => urls.get(url),\n            first: () => lastVideo || [...resources].find(r => r.kind === 'video'),\n            inspect: () => ({ resources: resources.size, reserved, active: active.size }) }\n    }\n\n    // XHR 只接管异步 GET arraybuffer 分片，其余请求保留浏览器原生行为。\n    function xhrAdapter(Native, route) {\n        return class extends Native {\n            open(method, url, async = true, ...rest) {\n                this._ccb = null; this._ccbReq = { method, url: String(url), async, headers: {} }\n                return super.open(method, url, async, ...rest)\n            }\n            setRequestHeader(k, v) { if (this._ccbReq) this._ccbReq.headers[k] = v; return super.setRequestHeader(k, v) }\n            get readyState() { return this._ccb ? this._ccb.readyState : super.readyState }\n            get status() { return this._ccb ? this._ccb.status : super.status }\n            get statusText() { return this._ccb ? this._ccb.statusText : super.statusText }\n            get responseURL() { return this._ccb ? this._ccb.url : super.responseURL }\n            get response() { return this._ccb ? this._ccb.body : super.response }\n            get responseText() { if (this._ccb) throw new DOMException('响应类型为 arraybuffer', 'InvalidStateError'); return super.responseText }\n            getAllResponseHeaders() { return this._ccb ? [...this._ccb.headers].map(([k, v]) => `${k}: ${v}\\r\\n`).join('') : super.getAllResponseHeaders() }\n            getResponseHeader(k) { return this._ccb ? this._ccb.headers.get(k) : super.getResponseHeader(k) }\n            send(body) {\n                const req = this._ccbReq\n                if (!req || !req.async || req.method.toUpperCase() !== 'GET' || this.responseType !== 'arraybuffer'\n                    || this.withCredentials || body != null || !range(new Headers(req.headers).get('range'))) return super.send(body)\n                if (this._ccbCtrl) throw new DOMException('请求已经发送', 'InvalidStateError')\n                const ctrl = new AbortController(); this._ccbCtrl = ctrl\n                let timedOut = false\n                const timer = this.timeout ? setTimeout(() => { timedOut = true; ctrl.abort() }, this.timeout) : null\n                const emit = type => this.dispatchEvent(new Event(type))\n                Promise.resolve().then(() => route(req.url, { method: req.method, headers: req.headers, signal: ctrl.signal }))\n                    .then(async response => {\n                        if (ctrl.signal.aborted) throw abortError()\n                        if (!response) { clearTimeout(timer); this._ccbCtrl = null; return super.send(body) }\n                        this._ccb = { readyState: 2, status: response.status, statusText: response.statusText, url: response.url, headers: response.headers, body: null }\n                        emit('loadstart'); emit('readystatechange')\n                        this._ccb.readyState = 3; emit('readystatechange')\n                        this._ccb.body = await response.arrayBuffer()\n                        if (ctrl.signal.aborted) throw abortError()\n                        this._ccb.readyState = 4; emit('readystatechange')\n                        this.dispatchEvent(new ProgressEvent('progress', { lengthComputable: true, loaded: this._ccb.body.byteLength, total: this._ccb.body.byteLength }))\n                        emit('load'); emit('loadend')\n                    }).catch(e => {\n                        this._ccb = { readyState: ctrl.signal.aborted && !timedOut ? 0 : 4, status: 0, statusText: '', url: '', headers: new Headers(), body: null }\n                        emit('readystatechange'); emit(timedOut ? 'timeout' : e.name === 'AbortError' ? 'abort' : 'error'); emit('loadend')\n                    }).finally(() => { clearTimeout(timer); if (this._ccbCtrl === ctrl) this._ccbCtrl = null })\n            }\n            abort() { if (this._ccbCtrl) this._ccbCtrl.abort(); else super.abort() }\n        }\n    }\n    return { create, xhrAdapter, ordinary, swap, range, contentRange, MIRRORS, BUDGET, CHUNK }\n})\n";
// ===WORKER_CORE_END===
    return `${workerCore}\n;(${ccbWorkerRuntime.toString()})(${JSON.stringify(workerChannel)});\n`
}

// ===INTEGRATION_END===

    const transformLiveNeptune = (obj) => {
        if (!obj || typeof obj !== 'object') return
        if (!getReplacementHost()) return

        const playurl =
            (obj && obj.roomInitRes && obj.roomInitRes.data && obj.roomInitRes.data.playurl_info && obj.roomInitRes.data.playurl_info.playurl) ||
            (obj && obj.data && obj.data.playurl_info && obj.data.playurl_info.playurl) ||
            (obj && obj.result && obj.result.playurl_info && obj.result.playurl_info.playurl) ||
            (obj && obj.playurl_info && obj.playurl_info.playurl)
        if (!playurl || typeof playurl !== 'object') return

        const streams = playurl.stream
        if (!Array.isArray(streams)) return
        for (let si = 0; si < streams.length; si++) {
            const s = streams[si]
            const formats = s && s.format
            if (!Array.isArray(formats)) continue
            for (let fi = 0; fi < formats.length; fi++) {
                const f = formats[fi]
                const codecs = f && f.codec
                if (!Array.isArray(codecs)) continue
                for (let ci = 0; ci < codecs.length; ci++) {
                    const c = codecs[ci]
                    const infos = c && c.url_info
                    if (!Array.isArray(infos)) continue
                    for (let ii = 0; ii < infos.length; ii++) {
                        const info = infos[ii]
                        if (ii === 0 && info && typeof info.host === 'string') {
                            const originalHost = info.host
                            const replacementHost = replaceMediaHostValue(originalHost)
                            if (replacementHost !== originalHost) {
                                if (!infos.some(x => x !== info && x.host === originalHost)) infos.splice(1, 0, { ...info })
                                if (c.base_url) liveRoutes.set(replacementHost + c.base_url + (info.extra || ''), originalHost + c.base_url + (info.extra || ''))
                                info.host = replacementHost
                            }
                        }
                    }
                }
            }
        }
    }

    const replaceBilivideoInText = (text) => {
        // 无法识别的直播文本不整体替换，保留原生签名及故障转移信息。
        return text
    }

    const interceptNetResponse = (theWindow => {
        const interceptors = []
        const register = (handler) => interceptors.push(handler)

        const handle = (response, url, meta) => interceptors.reduce((modified, h) => {
            const ret = h(modified, url, meta)
            return ret ? ret : modified
        }, response)

        const hookWindow = (w) => {
            try {
                if (!w || !w.XMLHttpRequest || !w.fetch) return false
                const hooked = w.__CCB_NET_HOOKED__
                if (hooked && hooked.xhr === w.XMLHttpRequest && hooked.fetch === w.fetch) return true

                const OX = Core.xhrAdapter(w.XMLHttpRequest, (url, init) => engine.route(url, init))
                class XHR extends OX {
                    open(...args) {
                        this._ccbMemo = null
                        const requestUrl = String(args[1])
                        this.addEventListener('load', () => { if (!this._ccb) noteNative(requestUrl, this.responseURL) }, { once: true })
                        try {
                            if (typeof args[1] === 'string') args[1] = replaceMediaUrl(args[1])
                        } catch (_) {}
                        return super.open(...args)
                    }
                    get responseText() {
                        if (this.readyState !== this.DONE) return super.responseText
                        const original = super.responseText
                        if (this._ccbMemo && this._ccbMemo.original === original) return this._ccbMemo.value
                        const value = handle(original, this.responseURL, { type: 'xhr', xhr: this })
                        this._ccbMemo = { original, value }
                        return value
                    }
                    get response() {
                        if (this.readyState !== this.DONE) return super.response
                        if (this.responseType === '' || this.responseType === 'text') return this.responseText
                        return handle(super.response, this.responseURL, { type: 'xhr', xhr: this })
                    }
                }
                w.XMLHttpRequest = XHR

                const Ofetch = w.fetch.bind(w)
                w.fetch = async (input, init) => {
                    const request = new (w.Request || Request)(input, init)
                    const media = await engine.route(request.url, { method: request.method, headers: request.headers, signal: request.signal })
                    if (media) return media
                    const url = request.url
                    const shouldIntercept = handle(null, url, { type: 'fetch', input, init })
                    let resp, liveRetried = false
                    try { resp = await Ofetch(request) }
                    catch (error) {
                        if (!liveRoutes.has(url) || request.signal.aborted) throw error
                        liveRetried = true
                        resp = await Ofetch(new (w.Request || Request)(liveRoutes.get(url), request))
                    }
                    noteNative(url, resp.url)
                    if (liveRoutes.has(url)) {
                        if (!resp.ok && !liveRetried) {
                            resp.body?.cancel().catch(() => {})
                            resp = await Ofetch(new (w.Request || Request)(liveRoutes.get(url), request))
                        }
                        diagnostics.events.push({ time: Date.now(), kind: 'live', node: new URL(resp.url || url).hostname,
                            state: '直播原生下载', reason: resp.url !== url ? '原始备用源或重定向' : '所选直播源' })
                        if (diagnostics.events.length > 50) diagnostics.events.shift()
                        document.dispatchEvent(new Event('ccb-status'))
                    }
                    if (!shouldIntercept) return resp
                    if (!resp.body || [204, 205, 304].includes(resp.status)) return resp
                    const text = await resp.text()
                    const out = handle(text, url, { type: 'fetch', input, init, response: resp })
                    const headers = new Headers(resp.headers)
                    headers.delete('content-length'); headers.delete('content-encoding')
                    const response = new (w.Response || Response)(out, { status: resp.status, statusText: resp.statusText, headers })
                    Object.defineProperty(response, 'url', { value: resp.url })
                    return response
                }

                try {
                    const bHooked = w.__CCB_BLOB_HOOKED__
                    if (w.Blob && (!bHooked || bHooked !== w.Blob)) {
                        const OBlob = w.Blob
                        w.Blob = function (parts, options) {
                            const type = options && options.type ? String(options.type) : ''
                            const looksJs = /javascript/i.test(type)
                                || (Array.isArray(parts) && parts.some(p => typeof p === 'string' && /importScripts|WorkerGlobalScope|bili/i.test(p)))
                            if (looksJs && shouldInstallWorkerHooks()) {
                                const injected = [buildWorkerPrelude(), ...(Array.isArray(parts) ? parts : [parts])]
                                return new OBlob(injected, options)
                            }

                            return new OBlob(parts, options)
                        }
                        w.Blob.prototype = OBlob.prototype
                        Object.setPrototypeOf(w.Blob, OBlob)
                        w.__CCB_BLOB_HOOKED__ = w.Blob
                    }
                } catch (_) {}

                try {
                    const wHooked = w.__CCB_WORKER_WRAPPED__
                    if (w.Worker && (!wHooked || wHooked !== w.Worker)) {
                        const OWorker = w.Worker
                        w.Worker = function (scriptURL, options) {
                            try {
                                if (!shouldInstallWorkerHooks()) return new OWorker(scriptURL, options)
                                const raw = (typeof scriptURL === 'string') ? scriptURL : String(scriptURL)
                                if (raw.startsWith('blob:') || raw.startsWith('data:')) return ccbAttachWorker(new OWorker(scriptURL, options), workerChannel, engine, noteNative)
                                const isModule = options && options.type === 'module'
                                const wrapperCode = isModule
                                    ? `${buildWorkerPrelude()}\nimport ${JSON.stringify(raw)};\n`
                                    : `${buildWorkerPrelude()}\nimportScripts(${JSON.stringify(raw)});\n`
                                const blob = new w.Blob([wrapperCode], { type: 'application/javascript' })
                                const url = w.URL.createObjectURL(blob)
                                const worker = ccbAttachWorker(new OWorker(url, options), workerChannel, engine, noteNative)
                                setTimeout(() => w.URL.revokeObjectURL(url), 60000)
                                return worker
                            } catch (_) {
                                return new OWorker(scriptURL, options)
                            }
                        }
                        w.Worker.prototype = OWorker.prototype
                        Object.setPrototypeOf(w.Worker, OWorker)
                        w.__CCB_WORKER_WRAPPED__ = w.Worker
                    }
                } catch (_) {}

                w.__CCB_NET_HOOKED__ = { xhr: w.XMLHttpRequest, fetch: w.fetch }
                return true
            } catch (_) {
                return false
            }
        }

        hookWindow(theWindow)
        register._hookWindow = hookWindow
        return register
    })(unsafeWindow)

    const PLAYURL_PATHS = [
        '/x/player/wbi/playurl',
        '/x/player/playurl',
        '/pgc/player/web/playurl',
        '/pgc/player/web/v2/playurl',
        '/pgc/player/api/playurl',
        '/pugv/player/web/playurl',
        '/ogv/player/playview',
    ]

    interceptNetResponse((response, url) => {
        if (!isCcbEnabled()) return
        const u = typeof url === 'string' ? url : (url && url.url) || String(url)
        if (!PLAYURL_PATHS.some(p => u.includes(p))) return
        if (response === null) return true
        lastPlayRequest = u

        try {
            if (typeof response === 'string') {
                const obj = JSON.parse(response)
                transformPlayUrlResponse(obj)
                return JSON.stringify(obj)
            }
            if (response && typeof response === 'object') {
                transformPlayUrlResponse(response)
                return response
            }
        } catch (e) {
            logger('处理 playurl 失败:', e)
        }
    })

    interceptNetResponse((response, url) => {
        if (!isCcbEnabled()) return
        if (!getLiveMode()) return
        const raw = typeof url === 'string' ? url : (url && url.url) || ''
        let u
        try { u = new URL(raw || String(url), location.href) } catch (_) { return }
        const p = u.pathname || ''
        if (!(/\/xlive\/web-room\/v\d+\/index\/getRoomPlayInfo\/?$/.test(p) || /\/room\/v1\/Room\/playUrl\/?$/.test(p))) return
        if (response === null) return true
        if (!isLiveRoomPage()) return
        try {
            const obj = typeof response === 'string' ? JSON.parse(response) : response
            transformLiveNeptune(obj)
            return (typeof response === 'string') ? JSON.stringify(obj) : obj
        } catch (e) {
            logger('处理直播 playurl 失败:', e)
        }
    })

    interceptNetResponse((response, url) => {
        if (!isCcbEnabled()) return
        if (!getLiveMode()) return
        const u = typeof url === 'string' ? url : (url && url.url) || String(url)
        if (!u.includes('/xlive/play-gateway/master/url')) return
        if (response === null) return true
        return replaceBilivideoInText(response)
    })

    const installLiveBootstrapHooks = () => {
        if (!getLiveMode() || !isLiveRoomPage() || !isCcbEnabled()) return
        const seen = new WeakSet()
        const tryRewrite = (obj) => {
            if (!obj || typeof obj !== 'object') return
            if (seen.has(obj)) return
            seen.add(obj)
            transformLiveNeptune(obj)
        }
        try {
            const propName = '__NEPTUNE_IS_MY_WAIFU__'
            let internal = unsafeWindow[propName]
            if (internal && typeof internal === 'object') tryRewrite(internal)
            Object.defineProperty(unsafeWindow, propName, {
                configurable: true,
                get: () => internal,
                set: (v) => {
                    internal = v
                    if (v && typeof v === 'object') tryRewrite(v)
                }
            })
        } catch (e) {
            logger('直播首播 Hook 安装失败:', String(e))
        }
    }

    installLiveBootstrapHooks()

    const watchGlobal = (name, handler) => {
        try {
            if (unsafeWindow[name] && typeof unsafeWindow[name] === 'object') handler(unsafeWindow[name])
            let internal = unsafeWindow[name]
            Object.defineProperty(unsafeWindow, name, {
                configurable: true,
                get: () => internal,
                set: (v) => {
                    internal = v
                    if (v && typeof v === 'object') handler(v)
                }
            })
        } catch (_) {}
    }

    watchGlobal('__playinfo__', (obj) => {
        if (!isCcbEnabled()) return
        try { transformPlayUrlResponse(obj) } catch (_) {}
    })
    watchGlobal('__INITIAL_STATE__', (obj) => {
        if (!isCcbEnabled()) return
        try { transformPlayUrlResponse(obj) } catch (_) {}
    })

    const createButton = (text, primary, second) => {
        const btn = document.createElement('button')
        btn.textContent = text
        btn.style.cssText = [
            'border:0',
            'border-radius:8px',
            'padding:8px 10px',
            'cursor:pointer',
            'color:#fff',
            `background:${primary ? '#2b74ff' : (second ? '#1bc543ff' : '#444')}`,
        ].join(';')
        return btn
    }


    const requestText = (url) => new Promise((resolve, reject) => {
        const fetchFallback = () => fetch(url).then(r => r.text()).then(resolve, reject)
        try {
            if (typeof GM_xmlhttpRequest === 'function') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: (res) => {
                        const ok = res && typeof res.status === 'number' ? (res.status >= 200 && res.status < 300) : true
                        if (!ok) fetchFallback()
                        else resolve(res.responseText || '')
                    },
                    onerror: fetchFallback,
                    ontimeout: fetchFallback,
                })
                return
            }
        } catch (_) {}
        fetchFallback()
    })

    const requestJson = async (url) => JSON.parse(await requestText(url))

    // 初始化：立即使用内嵌数据，无需等待网络
    if (EMBEDDED.regions && EMBEDDED.regions.length > 0) {
        regionList = [manualRegionName, ...EMBEDDED.regions.filter(v => v && v !== manualRegionName && v !== '编辑')]
    }
    if (EMBEDDED.cdn && Object.keys(EMBEDDED.cdn).length > 0) {
        cdnDataCache = EMBEDDED.cdn
    }

    const tryOnlineUpdate = async () => {
        // 逐个尝试 API 源，成功就停止
        for (const src of API_SOURCES) {
            try {
                const [regions, cdn] = await Promise.all([
                    requestJson(`${src}/region.json`),
                    requestJson(`${src}/cdn.json`),
                ])
                if (!Array.isArray(regions) || !regions.every(v => typeof v === 'string')
                    || !cdn || typeof cdn !== 'object' || Array.isArray(cdn)
                    || !Object.values(cdn).every(v => Array.isArray(v) && v.every(n => typeof n === 'string' && /^[\w.-]+$/.test(n)))) throw new Error('节点数据结构错误')
                if (Array.isArray(regions) && regions.length > 0) {
                    regionList = [manualRegionName, ...regions.filter(v => v && v !== manualRegionName && v !== '编辑')]
                }
                if (cdn && typeof cdn === 'object' && Object.keys(cdn).length > 0) {
                    cdnDataCache = cdn
                    GM_setValue('CCB_data_v1', { regions, cdn, time: Date.now() }); invalidateConfig()
                }
                logger('在线更新数据成功，来源:', src)
                return true
            } catch (_) { /* 继续尝试下一个源 */ }
        }
        logger('所有在线源不可用，使用内嵌数据')
        return false
    }

    setTimeout(tryOnlineUpdate, 5000)
    try {
        const cached = GM_getValue('CCB_data_v1', null)
        if (cached && Date.now() - cached.time >= 0 && Date.now() - cached.time < 7 * 86400000
            && Array.isArray(cached.regions) && cached.regions.every(x => typeof x === 'string')
            && cached.cdn && Object.values(cached.cdn).every(v => Array.isArray(v)
                && v.every(n => typeof n === 'string' && /^[\w.-]+$/.test(n)))) {
            regionList = [manualRegionName, ...cached.regions]; cdnDataCache = cached.cdn; invalidateConfig()
        }
    } catch (_) {}

    const getRegionList = async () => {
        // 已有数据直接返回，后台静默更新
        if (regionList.length > 1) return
        await tryOnlineUpdate()
    }

    const getCdnData = async () => {
        if (cdnDataCache && Object.keys(cdnDataCache).length > 0) return cdnDataCache
        await tryOnlineUpdate()
        return cdnDataCache || {}
    }

    const getCdnListByRegion = async (region) => {
        if (region === manualRegionName || region === '编辑') return [defaultCdnNode]
        const data = await getCdnData()
        const regionData = (data && data[region]) || []
        const isp = getIspFilter()
        let filtered = isp !== '全部'
            ? regionData.filter(n => detectIsp(n) === isp)
            : regionData
        // 过滤拉黑节点（失败 ≥1 次即跳过）
        filtered = filtered.filter(n => getNodeFailCount(n) < 1)
        // 排序：优先同运营商
        return [defaultCdnNode, ...sortByIsp(filtered, isp !== '全部' ? isp : null)]
    }

    // ===PANEL_START===
// 使用 DOM 文本接口构建面板，节点名与在线数据不会作为 HTML 执行。
let panelOpening = false
const openPanel = async () => {
    const existing = document.querySelector('#ccb-settings-panel')
    if (existing) { existing.remove(); return }
    if (panelOpening) return
    panelOpening = true
    try {
        const el = (tag, text, parent) => {
            const node = document.createElement(tag)
            if (text !== undefined) node.textContent = text
            parent?.appendChild(node)
            return node
        }
        const root = el('div')
        root.id = 'ccb-settings-panel'
        root.style.cssText = 'position:fixed;z-index:2147483647;right:18px;top:18px;width:480px;max-width:calc(100vw - 36px);max-height:calc(100vh - 36px);overflow:auto;background:#151515;color:#eee;padding:16px;border:1px solid #555;border-radius:12px;font:13px/1.6 system-ui'
        const button = (text, parent, handler) => {
            const b = el('button', text, parent)
            b.style.cssText = 'background:#303b50;color:white;border:1px solid #596579;border-radius:5px;padding:5px 10px;margin:4px;cursor:pointer'
            b.addEventListener('click', handler); return b
        }
        const select = (parent, values, current, change) => {
            const s = el('select', undefined, parent)
            s.style.cssText = 'background:#222;color:white;padding:7px;width:100%;margin:4px 0'
            if (!values.includes(current)) values = [...values, current]
            values.forEach(v => { const o = el('option', v, s); o.value = v })
            s.value = current; s.addEventListener('change', () => change(s.value)); return s
        }
        el('strong', 'CCB 2.3 · 设置与播放诊断', root)
        button('关闭', root, () => root.remove())
        el('p', '深圳优先；当前视频失败或持续过慢才回退。回退不会修改你的首选。地区来自域名标签，不保证服务器物理位置。', root)
        const status = el('pre', undefined, root)
        status.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;background:#202020;padding:10px;border-radius:6px'
        const updateStatus = () => {
            const lines = [`首选：${getTargetCdnNode()}`]
            for (const kind of ['video', 'audio']) {
                const d = diagnostics[kind]
                lines.push(`${kind === 'video' ? '视频' : '音频'}：${d ? `${d.node} · ${d.bps ? (d.bps / 1048576).toFixed(2) + ' MiB/s' : d.state}\n${d.reason || ''}` : '等待媒体请求'}`)
            }
            const last = diagnostics.events.at(-1)
            if (last) lines.push(`最近状态：${last.state} ${last.node || ''} ${last.reason || ''}`)
            status.textContent = lines.join('\n')
        }
        updateStatus()
        document.addEventListener('ccb-status', updateStatus)
        const observer = new MutationObserver(() => {
            if (!root.isConnected) { document.removeEventListener('ccb-status', updateStatus); observer.disconnect() }
        })
        let adopted = null
        for (const [ctx, title] of [['main', '视频 / 课堂 / 番剧'], ['live', '直播（原生下载）'], ['diagnostics', 'B站测速页']]) {
            const section = el('fieldset', undefined, root)
            section.style.cssText = 'border:1px solid #444;margin:12px 0;padding:10px'
            el('legend', title, section)
            const listBox = el('div', undefined, section)
            const carrier = select(section, ['全部', '电信', '联通', '移动', '其他'], getIspFilter(), v => { setIspFilter(v); renderNodes(region.value) })
            const region = select(section, ['推荐镜像', ...regionList], getRegion(ctx), v => { setRegion(ctx, v); renderNodes(v) })
            const results = el('pre', undefined, section)
            results.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;max-height:160px;overflow:auto;font-size:11px'
            let nodes = []
            const renderNodes = regionValue => {
                listBox.replaceChildren()
                const saved = getTargetCdnNode(ctx)
                if (regionValue === manualRegionName) {
                    const input = el('input', undefined, listBox)
                    input.style.cssText = 'width:95%;background:#222;color:white;padding:7px'
                    input.value = saved === defaultCdnNode ? '' : saved
                    input.placeholder = '输入 bilivideo CDN 域名'
                    button('保存自定义', listBox, () => {
                        const value = input.value.trim()
                        if (!value) setTargetCdnNode(ctx, defaultCdnNode)
                        else {
                            try {
                                const u = new URL(value.includes('://') ? value : `https://${value}`)
                                if (u.protocol !== 'https:' || !/(?:^|\.)bilivideo\.(?:com|cn|net)$/.test(u.hostname) || u.port || u.username || u.password || u.search || u.hash || u.pathname !== '/') throw new Error()
                                setTargetCdnNode(ctx, u.hostname)
                            } catch (_) { results.textContent = '请输入有效的 HTTPS bilivideo CDN 域名'; return }
                        }
                        results.textContent = '已保存首选'; updateStatus()
                    })
                    nodes = []; return
                }
                nodes = regionValue === '推荐镜像' ? [...Core.MIRRORS] : [...((cdnDataCache || {})[regionValue] || [])]
                if (carrier.value !== '全部') nodes = nodes.filter(n => detectIsp(n) === carrier.value)
                nodes = nodes.filter(n => !getNodeFailCount(n))
                const s = select(listBox, [defaultCdnNode, ...nodes], saved, v => { setTargetCdnNode(ctx, v); updateStatus() })
                for (const o of s.options) {
                    if (o.value === defaultCdnNode) continue
                    const service = /mirrorali/.test(o.value) ? '阿里云' : /mirrorcos/.test(o.value) ? '腾讯云' : /mirrorhw|mirror08/.test(o.value) ? '华为云' : detectIsp(o.value)
                    o.textContent = `${service} · ${o.value}${nodes.includes(o.value) ? '' : '（已保存，当前列表未收录）'}`
                }
            }
            renderNodes(region.value)
            if (ctx !== 'live') {
                const test = button('验证与测速当前视频', section, async () => {
                    const r = engine.first()
                    if (!r) { results.textContent = '尚未取得当前视频地址，请先打开视频。无视频时不会把连接延迟标成内容可用。'; return }
                    test.disabled = true; adopted = null
                    const ctrl = new AbortController(), measurements = []
                    results.textContent = '验证中：每节点最多 64 KiB；通过后每节点测速最多 1 MiB。'
                    try {
                        // 手动测试也限制候选数，避免扫描数百节点消耗大量流量。
                        const chosen = nodes.slice(0, 6)
                        for (let i = 0; i < chosen.length; i += 3) await Promise.all(chosen.slice(i, i + 3).map(async node => {
                            const url = Core.swap(r.originals.find(Core.ordinary) || '', node)
                            if (!url) { measurements.push({ node, hasContent: null }); return }
                            const verified = await engine.probe(r, url, ctrl.signal)
                            const speed = verified.hasContent === true ? await engine.probe(r, url, ctrl.signal, 1048576) : verified
                            measurements.push({ node, ...speed })
                            results.textContent = measurements.map(x => `${x.hasContent === true ? '✅ 有效分片' : x.hasContent === false ? '🚫 不可用' : '❔ 未知'} ${x.node} ${x.bps ? (x.bps / 1048576).toFixed(2) + ' MiB/s' : ''}`).join('\n')
                        }))
                        const best = measurements.filter(x => x.hasContent === true).sort((a, b) => b.bps - a.bps)[0]
                        if (best) { adopted = { ctx, node: best.node }; results.textContent += `\n推荐：${best.node}，点击「采用推荐」保存。` }
                    } catch (e) { results.textContent = `测速结束：${e.message}` }
                    finally { test.disabled = false }
                })
                button('采用推荐', section, () => {
                    if (adopted?.ctx !== ctx) { results.textContent = '请先验证当前视频，取得此栏的推荐结果。'; return }
                    setTargetCdnNode(ctx, adopted.node); renderNodes(region.value); updateStatus()
                })
            }
            button('手动拉黑首选', section, () => {
                const node = getTargetCdnNode(ctx)
                if (node === defaultCdnNode) return
                addFailCount(node); renderNodes(region.value); results.textContent = '已加入手动黑名单；自动回退不会写入此名单。'
            })
        }
        el('label', '点播多连接：', root)
        const threadValue = settings.acceleration ? String(settings.threads) : '关闭'
        select(root, ['关闭', 'auto', '2', '4', '6', '8'], threadValue, value => {
            settings.acceleration = value !== '关闭'; settings.threads = value === '关闭' ? 'auto' : value; persistSettings()
        })
        el('small', 'auto 从 4 连接开始，在 2–8 间调整；仅加速已验证的有限 DASH Range 请求。', root)
        const audioLabel = el('label', undefined, root)
        audioLabel.style.display = 'block'
        const audio = el('input', undefined, audioLabel); audio.type = 'checkbox'; audio.checked = settings.audioOriginal
        el('span', ' 音频使用原始备用地址', audioLabel)
        audio.addEventListener('change', () => { settings.audioOriginal = audio.checked; persistSettings() })
        button(getLiveMode() ? '直播换源：开启' : '直播换源：关闭', root, e => {
            const next = !getLiveMode(); GM_setValue(liveModeStored, next); e.currentTarget.textContent = next ? '直播换源：开启' : '直播换源：关闭'
        })
        button('应用并刷新', root, () => location.reload())
        const blacklist = el('pre', undefined, root)
        blacklist.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;font-size:11px'
        const showBans = () => { blacklist.textContent = `手动黑名单：${Object.keys(getFailCount()).join(', ') || '空'}\n旧版记录（未自动启用）：${GM_getValue('CCB_legacyBlacklist', '{}')}` }
        showBans()
        button('清空手动黑名单', root, () => { GM_setValue('CCB_manualBlacklist', '{}'); invalidateConfig(); showBans() })
        button('恢复旧版黑名单', root, () => { GM_setValue('CCB_manualBlacklist', GM_getValue('CCB_legacyBlacklist', '{}')); invalidateConfig(); showBans() })
        button('下载诊断记录', root, () => {
            // 诊断只导出节点与状态，不导出签名、Cookie 或播放地址。
            const blob = new Blob([JSON.stringify({ version: '2.3.0', preferred: getTargetCdnNode(), ...diagnostics }, null, 2)], { type: 'application/json' })
            const a = el('a'); a.href = URL.createObjectURL(blob); a.download = 'ccb-diagnostics.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000)
        })
        document.documentElement.appendChild(root)
        observer.observe(document.documentElement, { childList: true, subtree: true })
    } finally { panelOpening = false }
}

// ===PANEL_END===

    if (window.top === window) {
        GM_registerMenuCommand('📺 CCB 设置与播放诊断', openPanel)
        GM_registerMenuCommand('CCB 使用说明与反馈', () => window.open('https://github.com/maxzrb/bilibiliccb'))
    }
    document.addEventListener('seeking', () => engine.cancel(), true)
    try {
        const observer = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                if (!hasMediaDomain(entry.name) || !['video', 'xmlhttprequest', 'fetch'].includes(entry.initiatorType)) continue
                // 原生请求的跨域计时可能不可读；只报告实际请求域名，不推算速度。
                if (entry.initiatorType === 'video' || !mediaConfig().enabled) {
                    diagnostics.events.push({ time: Date.now(), state: '原生播放器请求', node: new URL(entry.name).hostname, reason: '原生通道，速度未知' })
                    if (diagnostics.events.length > 50) diagnostics.events.shift()
                    document.dispatchEvent(new Event('ccb-status'))
                }
            }
        })
        observer.observe({ type: 'resource', buffered: true })
    } catch (_) {}
    const converge = () => {
        settings = GM_getValue(SETTINGS_KEY, settings); invalidateConfig()
    }
    document.addEventListener('visibilitychange', converge)
    window.addEventListener('pageshow', converge)
    window.addEventListener('pagehide', () => engine.cancel())
    logger('CCB 2.3.0 加载完成', { host: location.host, path: location.pathname })
})()
