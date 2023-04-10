const i18n = {
  allowLang: ["kr", "en"],
  defaultLang: "kr",
  langPath: "/js/lang/",

  getLang() {
    const url = new URL(window.location);
    let lang = url.searchParams.get("lang") && url.searchParams.get("lang")!='' ? url.searchParams.get("lang") : localStorage.getItem("lang");
    if (!lang || this.allowLang.indexOf(lang.toLowerCase()) <= -1) {
      lang = this.defaultLang;
    }
    return lang;
  },

  dropdownTxtSetting(lang){
    let el = document.querySelector(".dropdown.lang");
    let item =  document.querySelectorAll(".lang .dropdown-menu li");
    if(item.length > 0){
      el.children[0].innerHTML = `${lang.toUpperCase()}`;
    }
    item.forEach(function(element) {
      if(element.innerText.toLowerCase() == lang ){
        element.classList.add('active');
      }
    });
  },

  _getScriptUrl() {
    return this.langPath + this.getLang() + ".js";
  },

  prefixLangScript() {
    if (!this.getLang()) { return; }

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.responseText) {
          const langScript = document.createElement("script");
          langScript.innerHTML = xhr.responseText;
          document.getElementsByTagName('head')[0].appendChild(langScript);

          if (i18nLangs && typeof i18n.replaceLang === 'function') {
            const launchI18nScript = document.createElement("script");
            launchI18nScript.innerHTML = "i18n.replaceLang();";
            document.body.appendChild(launchI18nScript);
          }
        }
      }
    }
    xhr.open('GET', this._getScriptUrl(), true);
    xhr.send(null);
  },

  replaceLang() {
    if (!i18nLangs) { return; }
    // 쿠키에 언어 저장
    localStorage.setItem("lang", this.getLang());
    this.dropdownTxtSetting(this.getLang());
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      if (!i18nLangs[element.dataset.i18n]) {
        return;
      }

      if (element.dataset.i18n_target) {
        element[element.dataset.i18n_target] = i18nLangs[element.dataset.i18n];
      } else {
        switch (element.tagName.toLowerCase()) {
          case "input":
          case "textarea":
            element.placeholder = i18nLangs[element.dataset.i18n];
          default:
            element.innerHTML = i18nLangs[element.dataset.i18n];
        }
      }
    });
  },
}
i18n.prefixLangScript();
