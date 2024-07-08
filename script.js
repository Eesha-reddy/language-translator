const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchangeIcon = document.querySelector(".exchange"),
      selectTag = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".icons i"),
      translateBtn = document.querySelector("button");

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? (country_code == "en-GB" ? "selected" : "") : (country_code == "hi-IN" ? "selected" : "");
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            data.matches.forEach(match => {
                if (match.id === 0) {
                    toText.value = match.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
        });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value && !toText.value) return;
        
        if (target.classList.contains("fa-copy")) {
            if (target.id === "from-copy") {
                navigator.clipboard.writeText(fromText.value)
                    .then(() => console.log("Copied fromText to clipboard"))
                    .catch(err => console.error("Failed to copy text:", err));
            } else if (target.id === "to-copy") {
                navigator.clipboard.writeText(toText.value)
                    .then(() => console.log("Copied toText to clipboard"))
                    .catch(err => console.error("Failed to copy text:", err));
            }
        } else if (target.classList.contains("fa-volume-up")) {
            let utterance;
            if (target.id === "from-volume") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else if (target.id === "to-volume") {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
            console.log("Speech synthesis utterance spoken.");
        }
    });
});
