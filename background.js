chrome.runtime.onMessage.addListener(
    function (request, sender) {

        function onCallback(id, url) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    url: url
                });
            });
            chrome.tabs.remove(id);
        }

        switch (request.type) {
            case 'newTabs':
                chrome.tabs.create({
                    url: request.url,
                    selected: false
                }, function (tab) {
                    if (request.direct) {
                        let flag = setInterval(function () {
                            chrome.tabs.get(tab.id, function (newTab) {
                                if (newTab.status === 'complete') {
                                    clearInterval(flag);
                                    onCallback(newTab.id, newTab.url);
                                }
                            })
                        }, 1500)
                    }
                });
                break;
            case 'closeTab':
                onCallback(sender.tab.id, request.url);
        }
    });
