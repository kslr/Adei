chrome.runtime.onMessage.addListener(function (request) {
    insertImage(request.href, request.src);
});

Cookies.removeAll = function (attributes) {
    Object.keys(Cookies.get()).forEach(function (cookie) {
        Cookies.remove(cookie, attributes);
    });
};

function isUrl(url) {
    return /^http[s]?:\/\/.*/.test(url)
}

function selector(e) {
    if (document.body) {
        return document.body.querySelector(e);
    }
    return null;
}

function insertImage(href, src) {
    // let newSrc = src.replace(/^http:\/\//i, 'https://');
    $(`a[href='${href}']`).prepend(`<img id="theImg" src="${src}" /><br>`);
}

const sites = [
    {
        "domain": "www.imgbabes.com",
    },
    {
        "domain": "imgdrive.net",
    },
    {
        "domain": "www.iceimg.net",
        "redirect": true
    },
    {
        "domain": "i.loli.net",
        "direct": true
    },
    {
        "domain": "imgtaxi.com"
    },
    {
        "domain": "imagetwist.com"
    }
];

const currentHost = document.location.hostname;
if (_.isUndefined(_.find(sites, ["domain", currentHost]))) {
    $("a").each(function () {
        let href = this.href;
        if (isUrl(href)) {
            let linkHost = new URL(href).hostname;
            let site = _.find(sites, ["domain", linkHost]);
            if (site) {
                if (site.direct) {
                    insertImage(href, href);
                } else {
                    chrome.extension.sendMessage({
                        type: "newTab",
                        href: href,
                        payload: site
                    });
                }
            }
        }
    });
} else {
    let src = null;
    switch (currentHost) {
        case "www.imgbabes.com":
            // https://sukebei.nyaa.si/view/2523849
            $("input[type='submit']").click();
            src = $("#this_image").attr("src");
            break;
        case "imgtaxi.com":
        case "imgwallet.com":
        case "imgdrive.net":
            // https://sukebei.nyaa.si/view/2523825
            let btn = selector("a.overlay_ad_link");
            if (btn) {
                btn.click();
            } else {
                src = $(".centred_resized").attr("src");
            }
            break;
        case "imagetwist.com":
            try {
                closeOverlay();
            } catch (e) {

            }
            src = $(".pic").attr("src");
            break;
    }

    if (src) {
        chrome.extension.sendMessage({
            type: 'closeTab',
            src: src
        });
    }
}