browser.contextMenus.create({
  id: "trans",
  title: "Spanish to English",
  contexts: ["all"]
}); 
browser.contextMenus.create({
  id: "trans2",
  title: "English to Spanish",
  contexts: ["all"]
});

browser.contextMenus.onClicked.addListener((info) => {
  browser.tabs.query({active: true, currentWindow: true }).then((tabs) => {
    switch (info.menuItemId) {
      case "trans":
        browser.tabs.sendMessage(tabs[0].id, "es")
        break;
      case "trans2":
        browser.tabs.sendMessage(tabs[0].id, "en")
        break;
    }
  })
})

