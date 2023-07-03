javascript: if (window.location.href.indexOf("flags&mode=log") < 0) {
  //relocate
  window.location.assign(game_data.link_base_pure + "flags&mode=log&page=1");
}
if (localStorage.getItem("FlagLogShinko")) {
  temp = JSON.parse(localStorage.getItem("FlagLogShinko"));
  console.log("Loading previous data");
  flagPerType = temp.flagPerType;
  stopDate = temp.lastDate;
  stopChange = temp.lastChange;
  var skip = false;
} else {
  var skip = false;
  var flagPerType = {
    "Resource production": 0,
    "Recruitment speed": 0,
    "Attack strength": 0,
    "Defense strength": 0,
    Luck: 0,
    "Population capacity": 0,
    "Lower coin costs": 0,
    "Haul capacity": 0,
  };
  stopDate = 0;
  stopChange = 0;
}

var langShinko = {
  en_DK: {
    "Produced nobleman": "Produced nobleman",
    "Resource production": "Resource production",
    "Recruitment speed": "Recruitment speed",
    "Attack strength": "Attack strength",
    "Defense strength": "Defense strength",
    Luck: "Luck",
    "Population capacity": "Population capacity",
    "Lower coin costs": "Lower coin costs",
    "Haul capacity": "Haul capacity",
    "Reduced package costs": "Reduced package costs",
  },
  de_DE: {
    "Produced nobleman": "Adelsgeschlecht erzeugt",
    "Resource production": "Rohstoffproduktion",
    "Recruitment speed": "Rekrutierungs-Geschwindigkeit",
    "Attack strength": "Angriffsstärke",
    "Defense strength": "Verteidigungsstärke",
    Luck: "Glück",
    "Population capacity": "Einwohnerzahl",
    "Lower coin costs": "Reduzierte Münzkosten",
    "Haul capacity": "Beutekapazität",
    "Reduced package costs": "Reduzierte Einlagerungskosten",
  },
  en_US: {
    "Produced nobleman": "Produced nobleman",
    "Resource production": "Resource production",
    "Recruitment speed": "Recruitment speed",
    "Attack strength": "Attack strength",
    "Defense strength": "Defense strength",
    Luck: "Luck",
    "Population capacity": "Population capacity",
    "Lower coin costs": "Lower coin costs",
    "Haul capacity": "Haul capacity",
    "Reduced package costs": "Reduced package costs",
  },
  en_UK: {
    "Produced nobleman": "Produced nobleman",
    "Resource production": "Resource production",
    "Recruitment speed": "Recruitment speed",
    "Attack strength": "Attack strength",
    "Defense strength": "Defense strength",
    Luck: "Luck",
    "Population capacity": "Population capacity",
    "Lower coin costs": "Lower coin costs",
    "Haul capacity": "Haul capacity",
    "Reduced package costs": "Reduced package costs",
  },
  nl_NL: {
    "Produced nobleman": "Geproduceerde edelman",
    "Resource production": "Grondstoffenproductie",
    "Recruitment speed": "Rekruteringssnelheid",
    "Attack strength": "Aanvalssterkte",
    "Defense strength": "Verdedigingskracht",
    Luck: "Geluk",
    "Population capacity": "Inwonersaantal",
    "Lower coin costs": "Muntkosten verlagen",
    "Haul capacity": "Buitcapaciteit",
    "Reduced package costs": "?",
  },
  it_IT: {
    "Produced nobleman": "Nobile prodotto",
    "Resource production": "Produzione risorse",
    "Recruitment speed": "VelocitÃ  di reclutamento",
    "Attack strength": "Potenza di attacco",
    "Defense strength": "Forza di difesa",
    Luck: "Fortuna",
    "Population capacity": "CapacitÃ  della popolazione",
    "Lower coin costs": "Minori costi di moneta",
    "Haul capacity": "CapacitÃ  bottino",
    "Reduced package costs": "?",
  },
  pt_BR: {
    "Produced nobleman": "Nobres produzidos",
    "Resource production": "ProduÃ§Ã£o de recursos",
    "Recruitment speed": "Velocidade de recrutamento",
    "Attack strength": "ForÃ§a de ataque",
    "Defense strength": "ForÃ§a de defesa",
    Luck: "Sorte",
    "Population capacity": "Capacidade da populaÃ§Ã£o",
    "Lower coin costs": "Menores custos de moeda",
    "Haul capacity": "Capacidade de saque",
    "Reduced package costs": "?",
  },
  pt_PT: {
    "Produced nobleman": "Nobres produzidos",
    "Resource production": "ProduÃ§Ã£o de recursos",
    "Recruitment speed": "Velocidade de recrutamento",
    "Attack strength": "ForÃ§a de ataque",
    "Defense strength": "ForÃ§a Defesa",
    Luck: "Sorte",
    "Population capacity": "Capacidade da populaÃ§Ã£o",
    "Lower coin costs": "Menores custos de moeda",
    "Haul capacity": "Capacidade de carga",
    "Reduced package costs": "?",
  },
  sv_SE: {
    "Produced nobleman": "Producerad adelsman",
    "Resource production": "Resursproduktion",
    "Recruitment speed": "Rekryteringshastighet",
    "Attack strength": "Attackstyrka",
    "Defense strength": "FÃ¶rsvarsstyrka",
    Luck: "Lycka",
    "Population capacity": "Befolkningskapacitet",
    "Lower coin costs": "LÃ¤gre myntkostnader",
    "Haul capacity": "BÃ¤rkapacitet",
    "Reduced package costs": "?",
  },
};

URLs = [];
baseURL = "/game.php?&screen=flags&mode=log&page=";
if ($(".paged-nav-item").length) {
  amountOfPages = parseInt(
    $(".paged-nav-item")[$(".paged-nav-item").length - 1].href.match(
      /page=(\d+)/
    )[1]
  );
} else {
  amountOfPages = 0;
}
let width;
if ($("#contentContainer")[0]) {
  width = $("#contentContainer")[0].clientWidth;
  $("#contentContainer").eq(0).prepend(`
<div id="progressbar" class="progress-bar progress-bar-alive">
<span id="count" class="label">0/${amountOfPages.length}</span>
<div id="progress"><span id="count2" class="label" style="width: ${width}px;">0/${amountOfPages.length}</span></div>
</div>`);
} else {
  width = $("#mobileHeader")[0].clientWidth;
  $("#mobileHeader").eq(0).prepend(`
<div id="progressbar" class="progress-bar progress-bar-alive">
<span id="count" class="label">0/${amountOfPages.length}</span>
<div id="progress"><span id="count2" class="label" style="width: ${width}px;">0/${amountOfPages.length}</span></div>
</div>`);
}
for (var i = 0; i <= amountOfPages; i++) {
  URLs.push(baseURL + i);
}
$.getAll = function (
  urls, // array of URLs
  onLoad, // called when any URL is loaded, params (index, data)
  onDone, // called when all URLs successfully loaded, no params
  onError // called when a URL load fails or if onLoad throws an exception, params (error)
) {
  var numDone = 0;
  var lastRequestTime = 0;
  var minWaitTime = 200; // ms between requests
  loadNext();
  function loadNext() {
    if (numDone == urls.length || skip == true) {
      onDone();
      return;
    }

    let now = Date.now();
    let timeElapsed = now - lastRequestTime;
    if (timeElapsed < minWaitTime) {
      let timeRemaining = minWaitTime - timeElapsed;
      setTimeout(loadNext, timeRemaining);
      return;
    }
    $("#progress").css("width", `${((numDone + 1) / urls.length) * 100}%`);
    $("#count").text(`${numDone + 1} / ${urls.length}`);
    $("#count2").text(`${numDone + 1} / ${urls.length}`);
    lastRequestTime = now;
    $.get(urls[numDone])
      .done((data) => {
        try {
          onLoad(numDone, data);
          ++numDone;
          loadNext();
        } catch (e) {
          onError(e);
        }
      })
      .fail((xhr) => {
        onError(xhr);
      });
  }
};

$.getAll(
  URLs,
  (i, data) => {
    console.log("Grabbing page " + i);

    /*if ($(data).find("#recaptcha-token").outerHTML!=undefined){
            alert("Triggered captcha! Please restart the script")
            throw Error("Rip");
        }*/

    tempRows = $(data).find("table .vis> tbody > tr");
    if (i == 0) {
      //we are on first page, check what the last entry is so we can remember for next time at the end
      //storing both time, and change, so if multiple changes happen on same time, we can stop at the correct one
      lastDate = tempRows[2].children[0].innerText.trim();
      lastChange = tempRows[2].children[1].innerText.trim();
    }

    for (var j = 0; j < tempRows.length - 2; j++) {
      if (
        tempRows[j + 2].children[0].innerText.trim() == stopDate &&
        tempRows[j + 2].children[1].innerText.trim() == stopChange
      ) {
        //REACHED LAST ENTRY, SKIP THE REST
        console.log("REACHED PREVIOUS LAST ENTRY");
        i = URLs.length;
        numDone = URLs.length;
        skip = true;
        break;
      } else {
        // Produced nobleman
        if (
          tempRows[j + 2].children[4].innerText.indexOf(
            langShinko[game_data.locale]["Produced nobleman"]
          ) > -1
        ) {
          console.log("Found a grey flag!");
          switch (tempRows[j + 2].children[1].innerText.trim()) {
            case langShinko[game_data.locale]["Resource production"]:
              flagPerType["Resource production"] += 1;
              break;
            case langShinko[game_data.locale]["Recruitment speed"]:
              flagPerType["Recruitment speed"] += 1;
              break;
            case langShinko[game_data.locale]["Attack strength"]:
              flagPerType["Attack strength"] += 1;
              break;
            case langShinko[game_data.locale]["Defense strength"]:
              flagPerType["Defense strength"] += 1;
              break;
            case langShinko[game_data.locale]["Luck"]:
              flagPerType["Luck"] += 1;
              break;
            case langShinko[game_data.locale]["Population capacity"]:
              flagPerType["Population capacity"] += 1;
              break;
            case langShinko[game_data.locale]["Lower coin costs"]:
              flagPerType["Lower coin costs"] += 1;
              break;
            case langShinko[game_data.locale]["Haul capacity"]:
              flagPerType["Haul capacity"] += 1;
              break;
            case langShinko[game_data.locale]["Reduced package costs"]:
              flagPerType["Lower coin costs"] += 1;
              break;
            default:
              console.log("Problem: " + tempRows[j + 2].children[1].innerText);
              throw Error("Can't recognize this flag");
          }
        }
      }
    }
  },
  () => {
    storeData = {};
    storeData.flagPerType = flagPerType;
    storeData.lastChange = lastChange;
    storeData.lastDate = lastDate;
    console.log(storeData);
    localStorage.setItem("FlagLogShinko", JSON.stringify(storeData));
    $("#progressbar").remove();
    var html = "";
    for (var i = 0; i < Object.keys(flagPerType).length; i++) {
      html += `
        <tr>
            <td><img src='/graphic/flags/medium/${i + 1}_1.png' title='${
        langShinko[game_data.locale][
          Object.keys(langShinko[game_data.locale])[i + 1]
        ]
      }'/></td>
            <td>${flagPerType[Object.keys(flagPerType)[i]]}</td>
        </tr>`;
    }
    Dialog.show(
      "Log:",
      `
        <div width="100%">
            <table class="vis" width="100%">
            ${html}
            </table>
        </div>
        `
    );
    console.table(flagPerType);
  },
  (error) => {
    console.error(error);
  }
);
