// ==UserScript==
// @name         Custom CDN of Bilibili (CCB) - 修改哔哩哔哩的网页视频、直播、番剧的播放源
// @description  Custom CDN of Bilibili (CCB)
// @namespace    CCB
// @license      MIT
// @version      2.2.0
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
        "cn-jssz-cm-02-42.bilivideo.com"
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
    buildTime: "2026-07-20T16:34:33Z"
};
// ===EMBEDDED_END===
    // API 源列表，按优先级排列 — jsDelivr 国内可访问，GitHub Pages 作为备用
    const API_SOURCES = [
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
    const setTargetCdnNode = (ctx, value) => GM_setValue(
        ctx === 'live' ? liveCdnNodeStored : (ctx === 'diagnostics' ? diagnosticsCdnNodeStored : mainCdnNodeStored),
        value,
    )
    const setRegion = (ctx, value) => GM_setValue(
        ctx === 'live' ? liveRegionStored : (ctx === 'diagnostics' ? diagnosticsRegionStored : mainRegionStored),
        value,
    )
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

    const replaceMediaUrl = (s) => {
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

        if (s.startsWith('http://') || s.startsWith('https://')) return s.replace(/^https?:\/\/.*?\//, getReplacement())
        if (s.startsWith('//')) return s.replace(/^\/\/.*?\//, getReplacement().replace(/^https?:/, ''))
        if (/^[^/]+\//.test(s)) return s.replace(/^[^/]+\//, `${getReplacementHost()}/`)
        return s
    }

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

    // 保存最近的真实视频分片路径，用于 CDN 内容验活
    let videoProbePath = null  // { path: '/upgcxcode/...', host: 'cn-xxx.bilivideo.com' }

    // 主动从页面全局变量中采集视频探针路径
    const scanObjForMediaUrl = (obj, depth) => {
        if (!obj || typeof obj !== 'object' || depth > 8 || videoProbePath) return
        if (Array.isArray(obj)) {
            for (const item of obj) scanObjForMediaUrl(item, depth + 1)
            return
        }
        for (const k in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, k)) continue
            const v = obj[k]
            if (typeof v === 'string' && hasMediaDomain(v)) {
                const probe = extractVideoPath(v)
                if (probe) { videoProbePath = probe; return }
            } else if (typeof v === 'object') {
                scanObjForMediaUrl(v, depth + 1)
            }
        }
    }

    const collectProbePath = async () => {
        if (videoProbePath && videoProbePath.path) {
            logger('验活: 已有探针路径', videoProbePath.path.substring(0, 60))
            return
        }

        // 1. 扫页面全局变量
        try { scanObjForMediaUrl(unsafeWindow.__playinfo__, 0) } catch (_) {}
        if (videoProbePath) { logger('验活: 从 __playinfo__ 采到探针'); return }
        try { scanObjForMediaUrl(unsafeWindow.__INITIAL_STATE__, 0) } catch (_) {}
        if (videoProbePath) { logger('验活: 从 __INITIAL_STATE__ 采到探针'); return }

        // 2. 检查是否在视频页
        const pathname = location.pathname
        const bvMatch = pathname.match(/\/video\/(BV[\w]+)/)
        const epMatch = pathname.match(/\/bangumi\/play\/(ep\d+)/)
        if (!bvMatch && !epMatch) {
            logger('验活: 非视频页，跳过探针采集')
            return
        }

        // 3. 提取 cid（尝试多种路径）
        let cid = null
        try {
            const st = unsafeWindow.__INITIAL_STATE__
            if (st) {
                cid = st?.videoData?.cid || st?.cid || st?.epInfo?.cid || st?.mediaInfo?.param?.cid
                // 也尝试从 videoData.pages 中找
                if (!cid && st?.videoData?.pages) {
                    const pages = st.videoData.pages
                    if (Array.isArray(pages) && pages.length > 0) cid = pages[0].cid
                }
            }
        } catch (_) {}
        if (!cid) {
            logger('验活: 未能提取 cid')
            return
        }
        logger('验活: 提取到 cid=' + cid + '，请求 playurl API...')

        // 4. 请求 playurl API（用 fetch，B站 API 支持 CORS）
        const apiUrl = `https://api.bilibili.com/x/player/playurl?cid=${cid}&qn=0&fnval=4048&fourk=1`
        try {
            const resp = await fetch(apiUrl, { credentials: 'include' })
            if (!resp.ok) { logger('验活: API 返回 ' + resp.status); return }
            const data = await resp.json()
            if (data.code !== 0) { logger('验活: API code=' + data.code); return }
            scanObjForMediaUrl(data, 0)
            if (videoProbePath) {
                logger('验活: 从 API 采到探针', videoProbePath.path.substring(0, 60))
            } else {
                logger('验活: API 响应中未找到媒体 URL')
            }
        } catch (e) {
            logger('验活: API 请求失败', e.message || e)
        }
    }

    const extractVideoPath = (urlStr) => {
        if (typeof urlStr !== 'string') return null
        try {
            const u = new URL(urlStr.startsWith('//') ? `https:${urlStr}` : urlStr)
            // 提取路径+查询串（排除 host），用于拼到其他 CDN 节点上验证
            if (u.pathname && u.pathname.length > 5) {
                return { path: u.pathname + u.search, host: u.hostname }
            }
        } catch (_) {}
        return null
    }

    const deepReplacePlayInfo = (obj) => {
        if (!obj || typeof obj !== 'object') return
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                const item = obj[i]
                if (typeof item === 'string') {
                    // 顺手采集视频探针路径
                    if (!videoProbePath && hasMediaDomain(item)) {
                        const probe = extractVideoPath(item)
                        if (probe) videoProbePath = probe
                    }
                    const out = hasMediaDomain(item) ? replaceMediaUrl(item) : item
                    if (out !== item) obj[i] = out
                } else {
                    deepReplacePlayInfo(item)
                }
            }
            return
        }
        for (const k in obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, k)) continue
            const v = obj[k]
            if (typeof v === 'string') {
                if (!videoProbePath && hasMediaDomain(v)) {
                    const probe = extractVideoPath(v)
                    if (probe) videoProbePath = probe
                }
                if (k === 'host') {
                    if (hasMediaDomain(v)) obj[k] = replaceMediaHostValue(v)
                } else {
                    if (hasMediaDomain(v)) obj[k] = replaceMediaUrl(v)
                }
            } else if (Array.isArray(v) && k === 'backup_url') {
                // 强力模式: 保留 backup_url 多样性，只用其他节点替换部分条目
                // 不再全部替换为同一 CDN，避免单点故障导致视频加载失败
                if (!getPowerMode()) continue
                const regionNodes = getRegionCdnNodes(getRegion())
                for (let i = 0; i < v.length; i++) {
                    const s = v[i]
                    if (typeof s === 'string') {
                        if (hasMediaDomain(s)) {
                            // 第 0 个 backup 用首选 CDN，其余用同地区不同节点做容灾
                            if (i === 0) {
                                v[i] = replaceMediaUrl(s)
                            } else if (regionNodes.length > 0) {
                                const altNode = regionNodes[i % regionNodes.length]
                                const altUrl = 'https://' + altNode + '/'
                                if (s.startsWith('http://') || s.startsWith('https://')) {
                                    v[i] = s.replace(/^https?:\/\/.*?\//, altUrl)
                                } else if (s.startsWith('//')) {
                                    v[i] = s.replace(/^\/\/.*?\//, altUrl.replace(/^https?:/, ''))
                                }
                            }
                        }
                    }
                    else deepReplacePlayInfo(s)
                }
            } else if (typeof v === 'object') {
                deepReplacePlayInfo(v)
            }
        }
    }

    const transformPlayUrlResponse = (playInfo) => {
        if (!playInfo || typeof playInfo !== 'object') return
        if (playInfo.code !== (void 0) && playInfo.code !== 0) return
        deepReplacePlayInfo(playInfo)
    }

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
                        if (info && typeof info.host === 'string') info.host = replaceMediaHostValue(info.host)
                    }
                }
            }
        }
    }

    const replaceBilivideoInText = (text) => {
        if (!shouldApplyReplacement()) return text
        if (typeof text !== 'string') return text
        if (text.indexOf('bilivideo.') === -1
            && text.indexOf('acgvideo.') === -1
            && text.indexOf('edge.mountaintoys.cn') === -1
            && text.indexOf('akamaized.net') === -1
        ) return text
        const out = text.replace(/https?:\/\/[^"'\s]*?\.(?:(?:bilivideo|acgvideo)\.(?:com|cn)|edge\.mountaintoys\.cn|akamaized\.net)\//g, getReplacement())
        const host = getReplacementHost()
        if (!host) return out
        return out.replace(/\b[\w.-]+\.(?:(?:bilivideo|acgvideo)\.(?:com|cn)|edge\.mountaintoys\.cn|akamaized\.net)\b/g, host)
    }

    const installCcbWorkerRuntime = (cfg) => {
        const forceReplace = !!(cfg && cfg.forceReplace)
        const shouldApply = () => forceReplace
        const Replacement = (cfg && typeof cfg.replacement === 'string') ? cfg.replacement : ''
        const replacementHost = (cfg && typeof cfg.replacementHost === 'string') ? cfg.replacementHost : ''
        const getHost = () => replacementHost
        const IgnoreHostRe = /^(?:bvc|data|pbp|api|api\w+)\./
        const hasMedia = (s) => typeof s === 'string' && (
            s.indexOf('bilivideo.') !== -1
            || s.indexOf('acgvideo.') !== -1
            || s.indexOf('edge.mountaintoys.cn') !== -1
            || s.indexOf('akamaized.net') !== -1
        )

        const replaceUrl = (s) => {
            if (typeof s !== 'string') return s
            if (!shouldApply()) return s
            if (!hasMedia(s)) return s
            try {
                const u = new URL(s.startsWith('//') ? `https:${s}` : s)
                if (IgnoreHostRe.test(u.hostname)) return s
            } catch (_) {
                const m = s.match(/^https?:\/\/([\w.-]+)/) || s.match(/^\/\/([\w.-]+)/)
                if (m && IgnoreHostRe.test(m[1])) return s
            }
            if (s.startsWith('http://') || s.startsWith('https://')) return s.replace(/^https?:\/\/.*?\//, Replacement)
            if (s.startsWith('//')) return s.replace(/^\/\/.*?\//, Replacement.replace(/^https?:/, ''))
            if (/^[^/]+\//.test(s)) return s.replace(/^[^/]+\//, `${getHost()}/`)
            return s
        }

        const Ofetch = self.fetch
        if (Ofetch) {
            self.fetch = (input, init) => {
                try {
                    const s = typeof input === 'string' ? input : (input && input.url)
                    if (typeof s === 'string') {
                        const r = replaceUrl(s)
                        if (r !== s) {
                            if (typeof input === 'string') input = r
                            else {
                                const Req = self.Request || Request
                                if (Req) input = new Req(r, input)
                            }
                        }
                    }
                } catch (_) {}
                return Ofetch(input, init)
            }
        }

        if (self.XMLHttpRequest) {
            const OX = self.XMLHttpRequest
            class X extends OX {
                open(...args) {
                    try {
                        if (typeof args[1] === 'string') args[1] = replaceUrl(args[1])
                    } catch (_) {}
                    return super.open(...args)
                }
            }
            self.XMLHttpRequest = X
        }
    }

    const buildWorkerPrelude = () => {
        const cfg = {
            forceReplace: shouldApplyReplacement(),
            replacement: getReplacement(),
            replacementHost: getReplacementHost(),
        }
        const runtime = `(${installCcbWorkerRuntime.toString()})(${JSON.stringify(cfg)});`
        return `(() => {\n` +
            `  if (self.__CCB_WORKER_PRELUDE__) return;\n` +
            `  self.__CCB_WORKER_PRELUDE__ = true;\n` +
            `  try { ${runtime} } catch (_) {}\n` +
            `})();\n`
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

                const OX = w.XMLHttpRequest
                class XHR extends OX {
                    open(...args) {
                        try {
                            if (typeof args[1] === 'string') args[1] = replaceMediaUrl(args[1])
                        } catch (_) {}
                        return super.open(...args)
                    }
                    get responseText() {
                        if (this.readyState !== this.DONE) return super.responseText
                        return handle(super.responseText, this.responseURL, { type: 'xhr', xhr: this })
                    }
                    get response() {
                        if (this.readyState !== this.DONE) return super.response
                        return handle(super.response, this.responseURL, { type: 'xhr', xhr: this })
                    }
                }
                w.XMLHttpRequest = XHR

                const Ofetch = w.fetch
                w.fetch = (input, init) => {
                    const s0 = typeof input === 'string' ? input : (input && input.url)
                    if (typeof s0 === 'string') {
                        const r = replaceMediaUrl(s0)
                        if (r !== s0) {
                            if (typeof input === 'string') input = r
                            else input = new (w.Request || Request)(r, input)
                        }
                    }

                    const s = typeof input === 'string' ? input : (input && input.url)
                    let resolvedUrl = s
                    try { resolvedUrl = new URL(s, w.location && w.location.href ? w.location.href : location.href).href } catch (_) {}

                    const shouldIntercept = handle(null, resolvedUrl, { type: 'fetch', input, init })
                    if (!shouldIntercept) return Ofetch(input, init)
                    return Ofetch(input, init).then(resp => new Promise((resolve) => {
                        resp.text().then(text => {
                            const out = handle(text, resolvedUrl, { type: 'fetch', input, init, response: resp })
                            resolve(new (w.Response || Response)(out, { status: resp.status, statusText: resp.statusText, headers: resp.headers }))
                        })
                    }))
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
                                if (raw.startsWith('blob:') || raw.startsWith('data:')) return new OWorker(scriptURL, options)
                                const isModule = options && options.type === 'module'
                                const wrapperCode = isModule
                                    ? `${buildWorkerPrelude()}\nimport ${JSON.stringify(raw)};\n`
                                    : `${buildWorkerPrelude()}\nimportScripts(${JSON.stringify(raw)});\n`
                                const blob = new w.Blob([wrapperCode], { type: 'application/javascript' })
                                const url = w.URL.createObjectURL(blob)
                                return new OWorker(url, options)
                            } catch (_) {
                                return new OWorker(scriptURL, options)
                            }
                        }
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

    let regionList = [manualRegionName]
    let cdnDataCache = null

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
                if (Array.isArray(regions) && regions.length > 0) {
                    regionList = [manualRegionName, ...regions.filter(v => v && v !== manualRegionName && v !== '编辑')]
                }
                if (cdn && typeof cdn === 'object' && Object.keys(cdn).length > 0) {
                    cdnDataCache = cdn
                }
                logger('在线更新数据成功，来源:', src)
                return true
            } catch (_) { /* 继续尝试下一个源 */ }
        }
        logger('所有在线源不可用，使用内嵌数据')
        return false
    }

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
        const filtered = isp !== '全部'
            ? regionData.filter(n => detectIsp(n) === isp)
            : regionData
        // 排序：优先同运营商
        return [defaultCdnNode, ...sortByIsp(filtered, isp !== '全部' ? isp : null)]
    }

    // ====== CDN 节点测速 ======
    const speedTestCache = {}  // { nodeName: latency_ms }

    // 单节点延迟测试：用 no-cors fetch 测 TCP+TLS 连接延迟，3s 超时
    const testNodeLatency = (nodeName) => new Promise((resolve) => {
        const url = `https://${nodeName}/`
        const start = performance.now()
        const ctrl = new AbortController()
        const timer = setTimeout(() => { ctrl.abort(); resolve({ node: nodeName, latency: 3000, error: true }) }, 3000)
        fetch(url, {
            mode: 'no-cors',
            cache: 'no-store',
            credentials: 'omit',
            signal: ctrl.signal,
        }).then(() => {
            clearTimeout(timer)
            resolve({ node: nodeName, latency: Math.round(performance.now() - start), error: false })
        }).catch((e) => {
            clearTimeout(timer)
            // 连接拒绝/网络错误也算失败，但仍记录耗时
            resolve({ node: nodeName, latency: Math.round(performance.now() - start), error: true })
        })
    })

    // 批量测速，并发上限 6，返回按延迟排序的结果
    const runSpeedTest = async (nodes, onProgress) => {
        const results = []
        const CONCURRENCY = 6
        const queue = [...nodes]

        const worker = async () => {
            while (queue.length > 0) {
                const node = queue.shift()
                const r = await testNodeLatency(node)
                results.push(r)
                if (onProgress) onProgress(results.length, nodes.length, r)
            }
        }

        const workers = Array.from({ length: Math.min(CONCURRENCY, nodes.length) }, () => worker())
        await Promise.all(workers)

        // 排序：成功在前按延迟升序，失败排最后
        results.sort((a, b) => {
            if (a.error !== b.error) return a.error ? 1 : -1
            return a.latency - b.latency
        })
        // 更新缓存
        results.forEach(r => { speedTestCache[r.node] = r.error ? -1 : r.latency })
        return results
    }

    // 节点失败计数（持久化到 GM storage），用于自动降权
    const failCountStored = 'CCB_failCount'
    const getFailCount = () => { try { return JSON.parse(GM_getValue(failCountStored, '{}')) } catch (_) { return {} } }
    const addFailCount = (nodeName) => {
        const fc = getFailCount()
        fc[nodeName] = (fc[nodeName] || 0) + 1
        GM_setValue(failCountStored, JSON.stringify(fc))
    }
    const getNodeFailCount = (nodeName) => { const fc = getFailCount(); return fc[nodeName] || 0 }

    // 内容验活：用真实视频分片发 GET + Range 请求较大数据块 (8KB)
    // no-cors 模式下看不到状态码，用传输耗时做启发式判断：
    //   - 耗时 > 100ms：大概率有真实数据传输 → 有内容
    //   - 耗时 < 100ms：大概率服务器秒回了 404/错误页面 → 无内容
    const contentOkCache = {}  // { nodeName: true/false/null }
    const probeNodeContent = (nodeName) => new Promise((resolve) => {
        if (!videoProbePath || !videoProbePath.path) {
            return resolve({ node: nodeName, hasContent: null })
        }
        if (contentOkCache[nodeName] !== undefined) {
            return resolve({ node: nodeName, hasContent: contentOkCache[nodeName] })
        }
        // 有多次播放失败记录的节点直接判无内容
        if (getNodeFailCount(nodeName) >= 2) {
            contentOkCache[nodeName] = false
            return resolve({ node: nodeName, hasContent: false })
        }

        const url = `https://${nodeName}${videoProbePath.path}`
        const ctrl = new AbortController()
        const timer = setTimeout(() => { ctrl.abort(); contentOkCache[nodeName] = false; resolve({ node: nodeName, hasContent: false }) }, 5000)
        const t0 = performance.now()

        // 直接 GET 一个 8KB 数据块，凭传输耗时判断
        fetch(url, {
            method: 'GET',
            headers: { 'Range': 'bytes=0-8191' },
            cache: 'no-store',
            credentials: 'omit',
            signal: ctrl.signal,
        }).then(() => {
            clearTimeout(timer)
            const elapsed = performance.now() - t0
            // 8KB 数据在正常网络下一般 >100ms；秒回 <100ms 通常是无内容/报错
            const ok = elapsed > 100
            contentOkCache[nodeName] = ok
            resolve({ node: nodeName, hasContent: ok, latency: Math.round(elapsed) })
        }).catch(() => {
            clearTimeout(timer)
            contentOkCache[nodeName] = false
            resolve({ node: nodeName, hasContent: false })
        })
    })

    // 对已测速结果中的前 N 个做内容验活
    const probeTopNodes = async (speedResults, topN, onProbeProgress) => {
        const candidates = speedResults.filter(r => !r.error).slice(0, topN)
        if (candidates.length === 0) return []
        const nodes = candidates.map(r => r.node)
        const probeResults = []
        const CONCURRENCY = 4
        const queue = [...nodes]
        const worker = async () => {
            while (queue.length > 0) {
                const node = queue.shift()
                const pr = await probeNodeContent(node)
                probeResults.push(pr)
                if (onProbeProgress) onProbeProgress(probeResults.length, nodes.length, pr)
            }
        }
        await Promise.all(Array.from({ length: Math.min(CONCURRENCY, nodes.length) }, () => worker()))
        return probeResults
    }

    // 延迟着色
    const latencyColor = (ms, error) => {
        if (error) return '#666'
        if (ms < 80) return '#0f0'
        if (ms < 200) return '#ff0'
        return '#f60'
    }
    // ====== END CDN 测速 ======

    const openPanel = async () => {
        const existing = document.querySelector('#ccb-settings-panel')
        if (existing) {
            existing.remove()
            return
        }

        await getRegionList()

        const root = document.createElement('div')
        root.id = 'ccb-settings-panel'
        root.style.cssText = [
            'position:fixed',
            'z-index:2147483647',
            'right:18px',
            'top:18px',
            'width:460px',
            'max-width:calc(100vw - 36px)',
            'max-height:calc(100vh - 36px)',
            'overflow:auto',
            'background:rgba(20,20,20,.96)',
            'border:1px solid #333',
            'border-radius:10px',
            'box-shadow:0 8px 24px rgba(0,0,0,.35)',
            'color:#fff',
            'font-size:12px',
            'font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"PingFang SC","Microsoft YaHei",sans-serif',
        ].join(';')

        const header = document.createElement('div')
        header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-bottom:1px solid #2f2f2f'
        const title = document.createElement('div')
        title.textContent = 'CCB 设置'
        title.style.cssText = 'font-weight:700;font-size:13px'
        const closeBtn = createButton('关闭', false, false)
        closeBtn.addEventListener('click', () => { try { root.remove() } catch (_) {} })
        header.appendChild(title)
        header.appendChild(closeBtn)
        root.appendChild(header)

        const body = document.createElement('div')
        body.style.cssText = 'padding:12px'
        root.appendChild(body)

        const mkRow = (labelText) => {
            const row = document.createElement('div')
            row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0'
            const label = document.createElement('div')
            label.textContent = labelText
            label.style.cssText = 'color:#bbb'
            row.appendChild(label)
            return { row, label }
        }

        const mkSectionTitle = (text) => {
            const t = document.createElement('div')
            t.textContent = text
            t.style.cssText = 'font-weight:700;font-size:12px;margin:2px 0 8px;color:#e5e5e5'
            return t
        }

        const mkSectionBox = () => {
            const box = document.createElement('div')
            box.style.cssText = 'border:1px solid #2f2f2f;border-radius:10px;padding:10px;margin:10px 0;background:rgba(0,0,0,.12)'
            return box
        }

        const mkSelect = (options, value) => {
            const sel = document.createElement('select')
            sel.style.cssText = 'flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:8px;padding:8px'
            sel.innerHTML = options.map(v => `<option value="${v}">${v}</option>`).join('')
            sel.value = value
            return sel
        }

        const mkInput = (value) => {
            const inp = document.createElement('input')
            inp.type = 'text'
            inp.placeholder = '输入节点域名或URL'
            inp.style.cssText = 'flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:8px;padding:8px;outline:none'
            inp.value = value || ''
            return inp
        }

        // ====== 全局 ISP 筛选 ======
        const ispRefreshCallbacks = []
        const currentIspFilter = getIspFilter()
        const ispOptions = ['全部', '电信', '联通', '移动', '其他']
        const { row: ispFilterRow } = mkRow('运营商筛选')
        const ispSelect = mkSelect(ispOptions, currentIspFilter)
        ispSelect.title = '根据 CDN 节点名称中的运营商标记 (ct/cu/cm) 筛选'
        ispSelect.addEventListener('change', () => {
            setIspFilter(ispSelect.value)
            ispRefreshCallbacks.forEach(fn => { try { fn() } catch (_) {} })
        })
        ispFilterRow.appendChild(ispSelect)
        body.appendChild(ispFilterRow)

        // 分隔线
        const divider = document.createElement('div')
        divider.style.cssText = 'border-top:1px solid #2f2f2f;margin:8px 0'
        body.appendChild(divider)
        // ====== END 全局 ISP 筛选 ======

        // ====== 全局测速 ======
        let globalTestRunning = false
        const globalSpeedBox = document.createElement('div')
        globalSpeedBox.style.cssText = 'display:none;margin:6px 0;max-height:300px;overflow-y:auto;font-size:11px;border:1px solid #333;border-radius:8px;padding:6px'
        body.appendChild(globalSpeedBox)

        const { row: globalRow } = mkRow('全局测速')
        const globalTestBtn = document.createElement('button')
        globalTestBtn.textContent = '🌐 测试全部地区'
        globalTestBtn.title = '每个地区抽代表节点，测速后按地区排序'
        globalTestBtn.style.cssText = 'border:0;border-radius:6px;padding:5px 12px;cursor:pointer;color:#fff;background:#444;font-size:11px'
        globalTestBtn.addEventListener('click', async () => {
            if (globalTestRunning) return
            globalTestRunning = true
            globalTestBtn.textContent = '⏳ 正在测速...'
            globalTestBtn.disabled = true
            globalSpeedBox.style.display = 'block'

            // 每个地区抽最多 3 个代表节点（优先不同 ISP）
            const pickRepNodes = (regionName) => {
                const nodes = (cdnDataCache && cdnDataCache[regionName]) || (EMBEDDED.cdn && EMBEDDED.cdn[regionName]) || []
                if (nodes.length === 0) return []
                const ispSet = new Set()
                const picked = []
                // 第一轮：每种 ISP 各取第一个
                for (const n of nodes) {
                    const isp = detectIsp(n)
                    if (!ispSet.has(isp)) {
                        ispSet.add(isp)
                        picked.push(n)
                        if (picked.length >= 3) break
                    }
                }
                // 不够 3 个就补
                for (const n of nodes) {
                    if (picked.length >= 3) break
                    if (!picked.includes(n)) picked.push(n)
                }
                return picked
            }

            const allRegions = regionList.filter(r => r !== manualRegionName)
            const allNodes = []
            allRegions.forEach(region => {
                const reps = pickRepNodes(region)
                reps.forEach(n => allNodes.push({ region, node: n }))
            })

            globalSpeedBox.innerHTML = `<div style="color:#888;padding:4px">🌐 测试 ${allRegions.length} 个地区共 ${allNodes.length} 个节点...</div>`

            const results = await runSpeedTest(allNodes.map(x => x.node), (done, total, last) => {
                globalSpeedBox.innerHTML = `<div style="color:#888;padding:4px">🌐 测速中 ${done}/${total} — ${last.node.split('.')[0]} ${last.error ? '❌' : last.latency + 'ms'}</div>`
            })

            // 按地区分组，取每地区最快
            const regionBest = {}
            allNodes.forEach(({ region, node }) => {
                const lat = speedTestCache[node]
                if (lat !== undefined && lat > 0) {
                    if (!regionBest[region] || lat < regionBest[region].latency) {
                        regionBest[region] = { region, node, latency: lat }
                    }
                }
            })

            const sortedRegions = Object.values(regionBest).sort((a, b) => a.latency - b.latency)

            // 渲染结果
            globalSpeedBox.innerHTML = '<div style="color:#aaa;font-weight:700;padding:4px;border-bottom:1px solid #333;margin-bottom:4px">📊 各区域最快节点（点击跳转）</div>'
            sortedRegions.forEach((item, i) => {
                const c = latencyColor(item.latency, false)
                const isp = detectIsp(item.node)
                const row = document.createElement('div')
                row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:3px 4px;cursor:pointer;border-radius:4px'
                row.innerHTML = `<span style="color:#888;font-size:10px;min-width:20px">#${i + 1}</span>` +
                    `<span style="color:${c};font-weight:700;min-width:42px;text-align:right">${item.latency}ms</span>` +
                    `<span style="color:#888;font-size:10px;min-width:28px">[${isp}]</span>` +
                    `<span style="font-weight:600;min-width:36px;color:#ddd">${item.region}</span>` +
                    `<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#888">${item.node.split('.')[0]}</span>`
                row.addEventListener('mouseenter', () => { row.style.background = '#333' })
                row.addEventListener('mouseleave', () => { row.style.background = 'transparent' })
                row.addEventListener('click', () => {
                    // 设置为该地区+节点
                    setRegion('main', item.region)
                    setTargetCdnNode('main', item.node)
                    setRegion('live', item.region)
                    setTargetCdnNode('live', item.node)
                    setRegion('diagnostics', item.region)
                    setTargetCdnNode('diagnostics', item.node)
                    // 关闭面板再打开以刷新
                    root.remove()
                    openPanel()
                })
                globalSpeedBox.appendChild(row)
            })

            globalTestRunning = false
            globalTestBtn.textContent = '🌐 重测全部'
            globalTestBtn.disabled = false
        })
        globalRow.appendChild(globalTestBtn)
        body.appendChild(globalRow)
        // ====== END 全局测速 ======

        const mountRegionAndNode = async (ctx, hostBox) => {
            const region = getRegion(ctx)
            let nodeValue = getTargetCdnNode(ctx)
            let speedTesting = false
            let nodeList = []

            const { row: regionRow } = mkRow('地区')
            const regionSelect = mkSelect(regionList, region)
            regionRow.appendChild(regionSelect)
            hostBox.appendChild(regionRow)

            // 节点选择行
            const { row: nodeRow } = mkRow('节点')
            hostBox.appendChild(nodeRow)

            // 测速按钮 + 摘要行 + 实时结果
            const speedBtnRow = document.createElement('div')
            speedBtnRow.style.cssText = 'display:flex;align-items:center;gap:8px;margin:4px 0'
            hostBox.appendChild(speedBtnRow)

            const liveResultBox = document.createElement('div')
            liveResultBox.style.cssText = 'display:none;margin:2px 0 6px;max-height:120px;overflow-y:auto;font-size:10px'
            hostBox.appendChild(liveResultBox)

            const clearAll = () => {
                while (nodeRow.childNodes.length > 1) nodeRow.removeChild(nodeRow.lastChild)
                speedBtnRow.innerHTML = ''
                liveResultBox.style.display = 'none'
                liveResultBox.innerHTML = ''
            }

            // 刷新下拉框选项（不重建整个控件，只更新 option 的 text）
            const refreshSelectOptions = () => {
                const sel = nodeRow.querySelector('select')
                if (!sel) return
                const currentValue = sel.value
                sel.innerHTML = nodeList.map(v => {
                    if (v === defaultCdnNode) return `<option value="${v}">${v}</option>`
                    const isp = detectIsp(v)
                    const cached = speedTestCache[v]
                    const cacheStr = cached !== undefined ? (cached < 0 ? ' ❌' : ` ${cached}ms`) : ''
                    const hasContent = contentOkCache[v]
                    const contentMark = hasContent === true ? ' ✅' : (hasContent === false ? ' 🚫' : '')
                    const fc = getNodeFailCount(v)
                    const failMark = fc > 0 ? ` ×${fc}` : ''
                    const tag = `[${isp}]${cacheStr}${contentMark}${failMark} `
                    return `<option value="${v}">${tag}${v}</option>`
                }).join('')
                sel.value = currentValue
            }

            const selectNode = (name) => {
                nodeValue = name
                setTargetCdnNode(ctx, nodeValue)
                const sel = nodeRow.querySelector('select')
                if (sel) sel.value = name
                // 显示/隐藏拉黑按钮
                const bb = speedBtnRow.querySelector('.ccb-ban-btn')
                if (bb) bb.style.display = (name && name !== defaultCdnNode) ? '' : 'none'
            }

            const renderNodeControl = async (regionValue) => {
                clearAll()

                if (regionValue === manualRegionName) {
                    const inp = mkInput(nodeValue === defaultCdnNode ? '' : nodeValue)
                    nodeRow.appendChild(inp)
                    inp.addEventListener('input', () => {
                        const v = inp.value.trim()
                        nodeValue = v ? v : defaultCdnNode
                        setTargetCdnNode(ctx, nodeValue)
                    })
                    return
                }

                nodeList = await getCdnListByRegion(regionValue)
                if (!nodeList.includes(nodeValue)) nodeValue = defaultCdnNode
                setTargetCdnNode(ctx, nodeValue)

                // 节点下拉（独占整行）
                const sel = document.createElement('select')
                sel.style.cssText = 'flex:1;background:#111;color:#fff;border:1px solid #333;border-radius:8px;padding:8px'
                sel.innerHTML = nodeList.map(v => {
                    if (v === defaultCdnNode) return `<option value="${v}">${v}</option>`
                    const isp = detectIsp(v)
                    const cached = speedTestCache[v]
                    const cacheStr = cached !== undefined ? (cached < 0 ? ' ❌' : ` ${cached}ms`) : ''
                    const hasContent = contentOkCache[v]
                    const contentMark = hasContent === true ? ' ✅' : (hasContent === false ? ' 🚫' : '')
                    const fc = getNodeFailCount(v)
                    const failMark = fc > 0 ? ` ×${fc}` : ''
                    const tag = `[${isp}]${cacheStr}${contentMark}${failMark} `
                    return `<option value="${v}">${tag}${v}</option>`
                }).join('')
                sel.value = nodeValue
                nodeRow.appendChild(sel)
                sel.addEventListener('change', () => { selectNode(sel.value) })

                // ---- 测速按钮 + 摘要 ----
                const testNodes = nodeList.filter(n => n !== defaultCdnNode)

                const testBtn = document.createElement('button')
                testBtn.textContent = speedTesting ? '⏳ 测速中...' : '⚡ 测速'
                testBtn.title = '测试所有节点延迟，自动选最快'
                testBtn.style.cssText = 'border:0;border-radius:6px;padding:5px 12px;cursor:pointer;color:#fff;background:#555;font-size:11px;white-space:nowrap'
                testBtn.disabled = speedTesting
                speedBtnRow.appendChild(testBtn)

                // 摘要文字
                const summaryLabel = document.createElement('span')
                summaryLabel.style.cssText = 'font-size:11px;color:#888;flex:1'
                speedBtnRow.appendChild(summaryLabel)

                // 🚫 拉黑按钮：播放失败时手动标记当前节点
                const banBtn = document.createElement('button')
                banBtn.textContent = '🚫'
                banBtn.title = '当前节点播放失败？点击标记，下次测速自动跳过'
                banBtn.className = 'ccb-ban-btn'
                banBtn.style.cssText = 'display:none;border:0;border-radius:4px;padding:2px 6px;cursor:pointer;color:#fff;background:#600;font-size:11px'
                banBtn.addEventListener('click', () => {
                    const cur = getTargetCdnNode(ctx)
                    if (cur === defaultCdnNode) return
                    addFailCount(cur)
                    const fc = getNodeFailCount(cur)
                    summaryLabel.innerHTML = `<span style="color:#f60">🚫 已标记 ${cur.split('.')[0]} (×${fc})，下次测速自动跳过</span>`
                    banBtn.style.display = 'none'
                })
                speedBtnRow.appendChild(banBtn)
                // 初始显示状态
                if (nodeValue !== defaultCdnNode && regionValue !== manualRegionName) {
                    banBtn.style.display = ''
                }

                testBtn.addEventListener('click', async () => {
                    if (speedTesting) return
                    speedTesting = true
                    testBtn.textContent = '⏳ 测速中...'
                    testBtn.disabled = true
                    summaryLabel.textContent = ''

                    // 实时结果收集
                    const liveResults = []
                    liveResultBox.style.display = 'block'
                    liveResultBox.innerHTML = ''

                    const updateLiveDisplay = () => {
                        // 显示最近 8 个结果，按延迟排序
                        const show = [...liveResults].sort((a, b) => {
                            if (a.error !== b.error) return a.error ? 1 : -1
                            return a.latency - b.latency
                        }).slice(0, 8)
                        liveResultBox.innerHTML = show.map(r => {
                            const c = latencyColor(r.latency, r.error)
                            const ms = r.error ? '超时' : r.latency + 'ms'
                            const name = r.node.split('.')[0]
                            return `<span style="display:inline-block;margin:1px 4px;padding:1px 6px;border-radius:3px;background:#222;color:${c}">${ms} ${name}</span>`
                        }).join('')
                    }

                    // 第 1 步：连接延迟测试
                    await runSpeedTest(testNodes, (done, total, last) => {
                        liveResults.push(last)
                        summaryLabel.textContent = `⚡ ${done}/${total}`
                        if (done % 3 === 0 || done === total) updateLiveDisplay()
                    })
                    updateLiveDisplay()

                    // 排序
                    const sorted = testNodes.map(n => ({
                        node: n,
                        latency: speedTestCache[n] !== undefined ? speedTestCache[n] : -1,
                        error: (speedTestCache[n] !== undefined ? speedTestCache[n] : -1) < 0,
                        hasContent: null
                    })).sort((a, b) => {
                        if (a.error !== b.error) return a.error ? 1 : -1
                        return a.latency - b.latency
                    })

                    // 第 2 步：内容验活
                    await collectProbePath()  // 主动采集 + API 兜底，确保有探针 URL
                    if (videoProbePath && videoProbePath.path) {
                        summaryLabel.textContent = '🔍 验活...'
                        const probeResults = await probeTopNodes(sorted, 10, (done, total, last) => {
                            summaryLabel.textContent = `🔍 验活 ${done}/${total}`
                        })
                        const probeMap = {}
                        probeResults.forEach(p => { probeMap[p.node] = p.hasContent })
                        sorted.forEach(s => {
                            if (probeMap[s.node] !== undefined) s.hasContent = probeMap[s.node]
                        })
                    }

                    // 选最优
                    const rankNode = (r) => {
                        if (r.error) return 99
                        if (getNodeFailCount(r.node) >= 2) return 98
                        if (r.hasContent === true) return 1
                        if (r.hasContent === null) return 2
                        return 3
                    }
                    const best = sorted.reduce((a, b) => {
                        const ra = rankNode(a), rb = rankNode(b)
                        if (ra !== rb) return ra < rb ? a : b
                        return a.latency < b.latency ? a : b
                    }, sorted[0])

                    if (best && rankNode(best) < 98) {
                        selectNode(best.node)
                        const fc = getNodeFailCount(best.node)
                        const contentTag = best.hasContent === true
                            ? '<span style="color:#0f0">✅ 有内容</span>'
                            : (best.hasContent === false
                                ? '<span style="color:#f60">⚠️ 可能无内容</span>'
                                : '<span style="color:#888" title="在视频播放页测速可验活内容">未验活</span>')
                        const failTag = fc > 0 ? `<span style="color:#f60"> 🚫×${fc}</span>` : ''
                        summaryLabel.innerHTML = `<span style="color:#0f0">✅ 已选:</span> <span style="color:#fff">${best.latency}ms</span> ${contentTag}${failTag} <span style="color:#888">${best.node.split('.')[0]}</span>`
                    } else {
                        summaryLabel.innerHTML = '<span style="color:#f60">❌ 所有节点不可用</span>'
                    }

                    // 测完同步下拉框：显示所有节点的延迟
                    refreshSelectOptions()

                    speedTesting = false
                    testBtn.textContent = '⚡ 重测'
                    testBtn.disabled = false
                })
            }

            // 注册 ISP 筛选变化时的刷新回调
            const refreshViaIsp = async () => {
                await renderNodeControl(regionSelect.value)
            }
            ispRefreshCallbacks.push(refreshViaIsp)

            await renderNodeControl(regionSelect.value)
            regionSelect.addEventListener('change', async () => {
                const next = regionSelect.value
                setRegion(ctx, next)
                await renderNodeControl(next)
            })
        }

        const mainBox = mkSectionBox()
        mainBox.appendChild(mkSectionTitle('视频 | 课堂 | 番剧(需特殊设置)'))
        body.appendChild(mainBox)
        await mountRegionAndNode('main', mainBox)

        const liveBox = mkSectionBox()
        liveBox.appendChild(mkSectionTitle('直播'))
        body.appendChild(liveBox)
        await mountRegionAndNode('live', liveBox)

        const diagnosticsBox = mkSectionBox()
        diagnosticsBox.appendChild(mkSectionTitle('测速'))
        body.appendChild(diagnosticsBox)
        await mountRegionAndNode('diagnostics', diagnosticsBox)

        const actions = document.createElement('div')
        actions.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-top:12px'
        const powerBtn = createButton(getPowerMode() ? '强力替换模式：ON' : '强力替换模式：OFF', true, false)
        powerBtn.addEventListener('click', () => {
            const next = !getPowerMode()
            GM_setValue(powerModeStored, next)
            powerBtn.textContent = next ? '强力替换模式：ON' : '强力替换模式：OFF'
        })
        const liveBtn = createButton(getLiveMode() ? '适用直播和番剧：ON' : '适用直播和番剧：OFF', true, false)
        liveBtn.addEventListener('click', () => {
            const next = !getLiveMode()
            GM_setValue(liveModeStored, next)
            liveBtn.textContent = next ? '适用直播和番剧：ON' : '适用直播和番剧：OFF'
        })
        const applyBtn = createButton('应用并刷新', false, true)
        applyBtn.addEventListener('click', () => { location.reload() })
        actions.appendChild(powerBtn)
        actions.appendChild(liveBtn)
        actions.appendChild(applyBtn)
        body.appendChild(actions)

        document.documentElement.appendChild(root)
    }

    if (window.top === window) {
        const stripNodeSuffix = (s) => String(s).replace(/(?:\.bilivideo\.(?:com|cn)|\.edge\.mountaintoys\.cn)$/i, '')
        const mainNodeName = stripNodeSuffix(getTargetCdnNode('main'))
        const diagnosticsNodeName = stripNodeSuffix(getTargetCdnNode('diagnostics'))
        const liveNodeName = stripNodeSuffix(getTargetCdnNode('live'))
        GM_registerMenuCommand(`📺CCB (${mainNodeName} | ${liveNodeName} | ${diagnosticsNodeName})`, () => { openPanel() })
        GM_registerMenuCommand('阅读文档 | 建议反馈 | 版本回退', () => { window.open('https://github.com/Kanda-Akihito-Kun/ccb') })
    }

    logger('CCB 加载完成', { host: location.host, path: location.pathname })
})()
