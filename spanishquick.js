const WHITELIST = ["garbanzo"]

function showMeaning(event, data) {
    var info = getSelectionInfo(event);
    if (!info) {
        return;
    }
    createDiv(info, data);
}

function getSelectionInfo(event) {
    var word;
    var boundingRect;
    if (window.getSelection()
        .toString()
        .length > 1) {
        word = window.getSelection()
            .toString();
        boundingRect = getSelectionCoords(window.getSelection());
    } else {
        return null;
    }
    var top = boundingRect.top + window.scrollY,
        bottom = boundingRect.bottom + window.scrollY,
        left = boundingRect.left + window.scrollX;
    if (boundingRect.height == 0) {
        top = event.pageY;
        bottom = event.pageY;
        left = event.pageX;
    }
    return {
        top: top,
        bottom: bottom,
        left: left,
        word: word,
        clientY: event.clientY,
        height: boundingRect.height
    };
}

function createDiv(info, data) {
    var hostDiv = document.createElement("div");
    hostDiv.className = "dictionaryDiv";
    hostDiv.style.left = info.left - 10 + "px";
    hostDiv.style.position = "absolute";
    hostDiv.style.zIndex = "1000000"
    hostDiv.attachShadow({
        mode: 'open'
    });
    var shadow = hostDiv.shadowRoot;
    var style = document.createElement("style");
    style.textContent = ".mwe-popups{background:#fff;position:absolute;z-index:110;-webkit-box-shadow:0 30px 90px -20px rgba(0,0,0,0.3),0 0 1px #a2a9b1;box-shadow:0 30px 90px -20px rgba(0,0,0,0.3),0 0 1px #a2a9b1;padding:0;font-size:14px;min-width:300px;border-radius:2px}.mwe-popups.mwe-popups-is-not-tall{width:320px}.mwe-popups .mwe-popups-container{color:#222;margin-top:-9px;padding-top:9px;text-decoration:none}.mwe-popups.mwe-popups-is-not-tall .mwe-popups-extract{min-height:40px;max-height:140px;overflow:hidden;margin-bottom:47px;padding-bottom:0}.mwe-popups .mwe-popups-extract{margin:16px;display:block;color:#222;text-decoration:none;position:relative} .mwe-popups.flipped_y:before{content:'';position:absolute;border:8px solid transparent;border-bottom:0;border-top: 8px solid #a2a9b1;bottom:-8px;left:10px}.mwe-popups.flipped_y:after{content:'';position:absolute;border:11px solid transparent;border-bottom:0;border-top:11px solid #fff;bottom:-7px;left:7px} .mwe-popups.mwe-popups-no-image-tri:before{content:'';position:absolute;border:8px solid transparent;border-top:0;border-bottom: 8px solid #a2a9b1;top:-8px;left:10px}.mwe-popups.mwe-popups-no-image-tri:after{content:'';position:absolute;border:11px solid transparent;border-top:0;border-bottom:11px solid #fff;top:-7px;left:7px} .audio{background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcUlEQVQ4y2P4//8/AyUYQhAH3gNxA7IAIQPmo/H3g/QA8XkgFiBkwHyoYnRQABVfj88AmGZcTuuHyjlgMwBZM7IE3NlQGhQe65EN+I8Dw8MLGgYoFpFqADK/YUAMwOsFigORatFIlYRElaRMWmaiBAMAp0n+3U0kqkAAAAAASUVORK5CYII=);background-position: center;background-repeat: no-repeat;cursor:pointer;margin-left: 8px;opacity: 0.5; width: 16px; display: inline-block;} .audio:hover {opacity: 1;}";
    shadow.appendChild(style);
    var encapsulateDiv = document.createElement("div");
    encapsulateDiv.style = "all: initial; text-shadow: transparent 0px 0px 0px, rgba(0,0,0,1) 0px 0px 0px !important;";
    shadow.appendChild(encapsulateDiv);
    var popupDiv = document.createElement("div");
    popupDiv.style = "font-family: arial,sans-serif; border-radius: 12px; border: 1px solid #a2a9b1; box-shadow: 0 0 17px rgba(0,0,0,0.5)";
    encapsulateDiv.appendChild(popupDiv);
    var contentContainer = document.createElement("div");
    contentContainer.className = "mwe-popups-container";
    popupDiv.appendChild(contentContainer);
    var heightBefore = popupDiv.clientHeight;
    var content = document.createElement("div");
    content.className = "mwe-popups-extract";
    content.style = "line-height: 1.4; margin-top: 0px; margin-bottom: 11px; max-height: none";
    contentContainer.appendChild(content);
    var heading = document.createElement("h3");
    heading.style = "margin-block-end: 0px; display:inline-block;";
    heading.textContent = data['word'];
    var meaning = document.createElement("p");
    meaning.style = "margin-top: 10px";
    meaning.textContent = data['trans'];
    content.appendChild(heading);
    content.appendChild(meaning);
    document.body.appendChild(hostDiv);
    if (info.clientY < window.innerHeight / 2) {
        popupDiv.className = "mwe-popups mwe-popups-no-image-tri mwe-popups-is-not-tall";
        hostDiv.style.top = info.bottom + 10 + "px";
        if (info.height == 0) {
            hostDiv.style.top = parseInt(hostDiv.style.top) + 8 + "px";
        }
    } else {
        popupDiv.className = "mwe-popups flipped_y mwe-popups-is-not-tall";
        hostDiv.style.top = info.top - 10 - popupDiv.clientHeight + "px";
        if (info.height == 0) {
            hostDiv.style.top = parseInt(hostDiv.style.top) - 8 + "px";
        }
    }
}

function getSelectionCoords(selection) {
    var oRange = selection.getRangeAt(0); //get the text range
    var oRect = oRange.getBoundingClientRect();
    return oRect;
}

function removeMeaning(event) {
    var element = event.target;
    if (!element.classList.contains("dictionaryDiv")) {
        document.querySelectorAll(".dictionaryDiv")
            .forEach(function (Node) {
                Node.remove();
            });
    }
}
async function getTranslation(text, type, mode) {
    const requestOptions = {
        method: "GET",
        mode: "no-cors"
    }

    text = text.trim()
    text = encodeURIComponent(text)
    const url2 = `https://www.spanishdict.com/translate/${text}`;
    const req2 = await fetch(url2, requestOptions)
    const htmlStuff = await req2.text()
    const splitted = htmlStuff.split("\n")
    for (var i = 0; i < splitted.length; i++) {
        if (splitted[i].includes("global.SD_MT_KEY")) {
            const key = splitted[i].split("'")[1]
            if (key != '') {
                const res = await fetch(
                    `https://traductor1.spanishdict.com/machine-translation/${type}?langFrom=${mode}&query=${text}&key=${key}`,
                    requestOptions)
                if (res.status == 200) {
                    const jsonified = await res.json()
                    return jsonified['data']['translation']
                } else {
                    /*const jsonified = await res.json()
                    console.log(jsonified)*/
                    return "An error has occured :("
                }
            } else {
                const url = `https://examples1.spanishdict.com/explore?lang=${mode}&q=${text}&numExplorationSentences=100`
                const req = await fetch(url, requestOptions)
                if (req.status == 200) {
                    const jsonified = await req.json()
                    let possibleTranslations = "";
                    if (jsonified['data']['translations'].length == 0) {
                        for (var htmlshit = 0; htmlshit < splitted.length; htmlshit++) {
                            if (splitted[htmlshit].includes('class="tds4TDh9">')) {
                                return splitted[htmlshit].split('class="tds4TDh9">')[1].split("<")[0]
                            }
                        }
                    } else {
                        for (var e = 0; e < jsonified['data']['translations'].length; e++) {
                            let lower = jsonified['data']['translations'][e]['translation']
                            possibleTranslations += lower.charAt(0).toUpperCase() + lower.slice(1) + ", "
                        }
                        const trimmed = possibleTranslations.trim()
                        const finished = trimmed.slice(0, -1)

                        return finished
                    }

                } else {
                    return "Oopsies! Something went wrong :("
                }
            }
        }
    }
};

function solve(text, val, msg) {
    try {
        getTranslation(text, val.state, msg).then(
            (result) => {
                //console.log(result)
                return showMeaning(text, {
                    "word": text,
                    "trans": result
                });
            }
        )
    } catch (error) {
        if (error.name == 'NetworkError') {
            solve(text, val, msg)
        }
        console.error(error);
    }
}

if (WHITELIST.some(substring=>document.URL.includes(substring))) {
    document.styleSheets[0].insertRule("* { user-select:text !important }", 1);
}

browser.runtime.onMessage.addListener((msg) => {
    const text = window.getSelection().toString();
    browser.storage.sync.get("state").then((val) => {
        solve(text, val, msg)
    });
});

document.addEventListener('click', removeMeaning);