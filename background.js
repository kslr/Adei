chrome.runtime.onMessage.addListener(
    function (request, sender) {

        function onFill(tabId, src) {
            let data = localStorage.getItem(tabId);
            if (data !== null) {
                let aims = JSON.parse(data);
                chrome.tabs.sendMessage(aims.originTab, {
                    src: src,
                    href: aims.href
                });
            }
        }

        switch (request.type) {
            case 'newTab':
                chrome.tabs.create({
                    url: request.href,
                    selected: false,
                    // pinned: true
                }, function (tab) {
                    localStorage.setItem(tab.id, JSON.stringify({
                        originTab: sender.tab.id,
                        href: request.href
                    }));

                    if (request.payload.redirect) {
                        let flag = setInterval(function () {
                            chrome.tabs.get(tab.id, function (newTab) {
                                if (newTab.status === 'complete') {
                                    clearInterval(flag);
                                    onFill(tab.id, newTab.url);
                                    chrome.tabs.remove(tab.id);
                                }
                            })
                        }, 1500)
                    }
                });
                break;
            case 'closeTab':
                onFill(sender.tab.id, request.src);
                chrome.tabs.remove(sender.tab.id);
        }
    });
