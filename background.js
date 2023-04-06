browser.contextMenus.create({
  id: "es",
  title: "Spanish to English",
  contexts: ["all"]
});
browser.contextMenus.create({
  id: "en",
  title: "English to Spanish",
  contexts: ["all"]
});

browser.contextMenus.onClicked.addListener((info) => {
  browser.tabs.query({
    active: true,
    currentWindow: true
  }).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, info.menuItemId)
  })
})