chrome.runtime.onMessage.addListener(function (request) {
    $('#torrent-description').prepend($('<img>', { src: request.url }))
});

$(function () {

    function extractHostname(url) {
        let hostname;
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }
        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];
        return hostname;
    }

    function nyaa() {
        const sites = [
            {
                "domain": "www.imgbabes.com",
                "direct": false
            },
            {
                "domain": "imgdrive.net",
                "direct": false
            },
            {
                "domain": "www.iceimg.net",
                "direct": true
            }
        ];

        $("#torrent-description a").each(function() {
            let href = $(this).attr('href');
            let hostName = extractHostname(href);
            sites.map(function(item) {
                if (item.domain === hostName) {
                    chrome.extension.sendMessage({
                        type: 'newTabs',
                        url: href,
                        direct: item.direct
                    });
                }
            });
        });
    }

    function wwwImgbabesCom() {
        $("input[type='submit']").click();
        let src = $("#this_image").attr("src");
        chrome.extension.sendMessage({
            type: 'closeTab',
            url: src
        });
    }

    const hostName = document.location.hostname;
    switch (hostName) {
        case "nyaa.si":
            nyaa();
            break;
        case "sukebei.nyaa.si":
            nyaa();
            break;
        case "www.imgbabes.com":
            wwwImgbabesCom();
            break;
    }

});