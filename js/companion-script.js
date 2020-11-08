var npc = {
  dimensions: [],
  separationPoint: 1,
  doubleColumns: false,
  name: "Companion",
  size: "medium",
  type: "humanoid",
  tag: "",
  tier: "apprentice",
  classification: "hireling",
};

var cdata;

function getNPC() {
  npc.name = $("#cname-input").val().trim();
  npc.size = $("#csize-input").val().toLowerCase();
  npc.type = $("#ctype-input").val();
  if (npc.type == "*")
    npc.type = $("#cother-type-input").val();
  npc.classification = $("#cclass-input").val();
  if (npc.classification == "*")
    npc.classification = $("#cother-class-input").val();
  npc.tier = $("#ctier-input").val();
  npc.tag = $("#ctag-input").val().trim();

  updateCompBlock(0);
}

var ComStrFunctions = {
  WriteSubheader: function(npc_id) {
    return StringFunctions.StringCapitalize(npc_id.size) + " " + npc_id.type + (npc_id.tag != "" ? " (" + npc_id.tag + ")" : "") + ", " + npc_id.tier + " tier " + npc_id.classification;
  },
}

function setInputs() {
  $("#col-toggle").prop("checked", npc.doubleColumns);
  ComFormFunctions.ShowHideSeparatorInput();

  $("#cname-input").val(npc.name);
  $("#csize-input").val(npc.size);
  $("#ctier-input").val(npc.tier);
  $("#ctag-input").val(npc.tag);

  if (data.types.includes(npc.type))
    $("#ctype-input").val(npc.type);
  else {
    $("#ctype-input").val("*");
    $("#cother-type-input").val(npc.type);
  }
  ComFormFunctions.ShowHideOther('cother-type-input', 'ctype-input');

  if (cdata.classifications.includes(npc.classification))
    $("#cclass-input").val(npc.classification);
  else {
    $("#cclass-input").val("*");
    $("#cother-class-input").val(npc.classification);
  }
  ComFormFunctions.ShowHideOther('cother-class-input', 'cclass-input');

  updateCompBlock(0);
}

var ComFormFunctions = {
  ShowHideOther: function(other, select, checker = "*") {
    FormFunctions.ShowHideHtmlElement(("#" + other), $("#" + select).val() === checker);
  },

  ShowHideSection: function(select) {
    for (let i = 0; i < npc.dimensions.length; i++) {
      FormFunctions.ShowHideHtmlElement(("#dim-" + npc.dimensions[i].name), select !== npc.dimensions[i].name);
    }
  },

  ShowHideParch: function() {
    $("#c-block").toggleClass("c-plain", !$("#parch-toggle").prop("checked"));
  },

  ShowHideSeparatorInput: function() {
    FormFunctions.ShowHideHtmlElement("#c-separator-button", npc.doubleColumns);
  },

  MakeDisplayList: function(arrIdx, arrName, isBlock = false, isDim = false) {
    let arr = (isDim ? npc.dimensions : npc.dimensions[arrIdx][arrName]),
    displayArr = [],
      content = "",
      arrElement = "#" + arrName + "-input-list";
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index],
      content = "<b>" + StringFunctions.FormatString(element.name, false) + (element.hasOwnProperty("desc") ?
          ":</b> " + StringFunctions.FormatString(element.desc, isBlock) : "</b>");

      let functionArgs = arrIdx + " ,\"" + arrName + "\", " + index + ", " + isBlock + ", " + isDim,
        imageHTML = "<svg class='statblock-image' onclick='ComFormFunctions.RemoveDisplayListItem(" + functionArgs + ")'><use xlink:href='dndimages/icons.svg?version=1.0#x-icon'></use></svg>";
      if (isBlock)
        imageHTML += " <svg class='statblock-image' onclick='ComFormFunctions.EditDisplayListItem(" + functionArgs + ")'><use xlink:href='dndimages/icons.svg?version=1.0#edit-icon'></use></svg>";
        imageHTML += " <svg class='statblock-image' onclick='ComFormFunctions.SwapDisplayListItem(" + functionArgs + ", -1)'><use xlink:href='dndimages/icons.svg?version=1.0#up-icon'></use></svg>" +
        " <svg class='statblock-image' onclick='ComFormFunctions.SwapDisplayListItem(" + functionArgs + ", 1)'><use xlink:href='dndimages/icons.svg?version=1.0#down-icon'></use></svg>";
      displayArr.push("<li> " + imageHTML + " " + content + "</li>");
    }
    $(arrElement).html(displayArr.join(""));

    $(arrElement).parent()[arr.length == 0 ? "hide" : "show"]();
  },

  RemoveDisplayListItem: function(arrIdx, arrName, index, isBlock, isDim) {
    let arr = (isDim ? npc.dimensions : npc.dimensions[arrIdx][arrName]);
    arr.splice(index, 1);
    if (isDim) $("#dim-options").val("");
    updateCompBlock(0);
    this.MakeDisplayList(arrIdx, arrName, isBlock, isDim);
  },

  EditDisplayListItem: function(arrIdx, arrName, index, isBlock, isDim) {
    let arr = npc.dimensions[arrIdx][arrName][index];
    $("#"+arrName+"-name-input").val(arr.name);
    $("#"+arrName+"-desc-input").val(arr.desc);
  },

  SwapDisplayListItem: function(arrIdx, arrName, index, isBlock, isDim, swap) {
    let arr = (isDim ? npc.dimensions : npc.dimensions[arrIdx][arrName]);
    if (index + swap < 0 || index + swap >= arr.length) return;
    let temp = arr[index + swap];
    arr[index + swap] = arr[index];
    arr[index] = temp;
    updateCompBlock(0);
    this.MakeDisplayList(arrIdx, arrName, isBlock, isDim);
  },
};

function addStat(npc_id) {
  if ($("#dim-options").val()) {
    let statName = $("#stats-name-input").val(),
      statVal = $("#stats-desc-input").val(),
      catIdx = getFindIdx(npc_id.dimensions, "name", $("#dim-options").val());
    let shortStats = npc_id.dimensions[catIdx].stats;

    if (statVal && statName) {
      let addIdx = getFindIdx(shortStats, "name", statName) > -1 ? getFindIdx(shortStats, "name", statName) : null;
      if (addIdx || addIdx === 0) {
        shortStats.splice(addIdx, 1, {
          "name": statName,
          "desc": statVal,
        });
      } else {
        shortStats.push({
          "name": statName,
          "desc": statVal,
        });
      }

      updateCompBlock(0);

      $("#stats-name-input").val("");
      $("#stats-desc-input").val("");
    }
  }
}

function getFindIdx(Arr, Prop, Val) {
  return Arr.findIndex(function(Arr2) {
    return Arr2[Prop].toLowerCase() === Val.toLowerCase();
  })
}

function changeWidth() {
  npc.doubleColumns = $("#col-toggle").prop("checked");
  ComFormFunctions.ShowHideSeparatorInput();
  updateCompBlock(0);
}

function updateCompBlock(moveSepPoint) {
  let maxSep = npc.dimensions.length - 1;
  if (npc.separationPoint == undefined)
    npc.separationPoint = Math.floor(maxSep / 2);
  if (moveSepPoint != undefined)
    npc.separationPoint = MathFunctions.Clamp(npc.separationPoint + moveSepPoint, 0, maxSep);

  let blockWidth = $("#c-block");
  npc.doubleColumns ? blockWidth.addClass('wide') : blockWidth.removeClass('wide');

  let dropdownBuffer = [],
    leftDimsArr = [],
    rightDimsArr = [];

  for (let i = 0; i < npc.dimensions.length; i++) {
    let dimTxt = BlockFunctions.DrawDimension(npc, i);
    (i < npc.separationPoint ? leftDimsArr : rightDimsArr).push(dimTxt);
    dropdownBuffer.push("<option value='" + npc.dimensions[i].name + "'>" + npc.dimensions[i].name + "</option>");
  }
  let dropV1 = $("#dim-options").val();
  $("#dim-options").html(dropdownBuffer.join(""));
  if (dropV1) {
    $("#dim-options").val(dropV1)
  } else {
    dropV1 = $("#dim-options").val();
  };

  dropdownBuffer.splice(0, 0, "<option value='*'>No Hidden Dimensions</option>");
  let dropV2 = $("#dim-hide").val();
  $("#dim-hide").html(dropdownBuffer.join(""));
  if (dropV2) $("#dim-hide").val(dropV2);

  $("#dimension-left").html(leftDimsArr.join(""));
  $("#dimension-right").html(rightDimsArr.join(""));

  $("#comp-name").html(npc.name);
  $("#comp-tagline").html(ComStrFunctions.WriteSubheader(npc));

  CompData.SaveToLocalStorage();

  updateFSList(dropV1);
  ComFormFunctions.MakeDisplayList(null, "dims", false, true);
  ComFormFunctions.ShowHideParch();
}

function updateFSList(dropV1) {
  if (dropV1) {
    let catIdx = getFindIdx(npc.dimensions, "name", dropV1);
    ComFormFunctions.MakeDisplayList(catIdx, "stats", true);
    ComFormFunctions.MakeDisplayList(catIdx, "features", true);
  }
}

var BlockFunctions = {
  DrawDimension: function(npc_id, idx) {
    let dimIDn = "<div id='dim-" + npc_id.dimensions[idx].name + "'>";
    let dataSet = npc_id.dimensions[idx],
      displayArr = [dimIDn];

    displayArr.push("<svg height='.3125rem' width='100%' class='tapered-rule'><polyline points='0,0 0,3 400,3 400,0'></polyline></svg>");
    displayArr.push("<h3>" + dataSet.name + "</h3>")

    for (let i = 0; i < dataSet.stats.length; i++) {
      let lastC = ((i === dataSet.stats.length - 1) && (dataSet.features.length < 1));
      displayArr.push(this.MakeStatHTML(dataSet.stats[i], i === 0, lastC));
    }

    for (let i = 0; i < dataSet.features.length; i++) {
      let firstC = ((i === 0) && (dataSet.stats.length < 1));
      displayArr.push(this.MakeFeatHTML(dataSet.features[i], firstC, (i === dataSet.features.length - 1)));
    }

    return displayArr.join("") + "</div>";

  },

  MakeStatHTML: function(stats, firstLine, lastLine) {
    if (stats.length == 0) return "";
    let htmlClass = "c-line";
    htmlClass += lastLine ? " last" : "";
    htmlClass += firstLine ? " first" : "";
    return "<div class=\"" + htmlClass + "\"><h4>" + StringFunctions.WordCapitalize(stats.name) + "</h4> <p>" + StringFunctions.FormatString(stats.desc, false) + "</p></div>"
  },

  MakeFeatHTML: function(features, firstLine, lastLine) {
    if (features.length == 0) return "";
    let htmlClass = "c-line";
    htmlClass += lastLine ? " last" : "";
    htmlClass += firstLine ? " first" : "";
    return "<div class=\"" + htmlClass + "\"><h4>" + StringFunctions.WordCapitalize(features.name) + "</h4><div class='c-indent'><div>" + StringFunctions.FormatString(features.desc, false, true) + "</div></div></div>"
  },
}

function addFeat(npc_id) {
  if ($("#dim-options").val()) {
    let featName = $("#features-name-input").val(),
      featDesc = $("#features-desc-input").val(),
      catIdx = getFindIdx(npc_id.dimensions, "name", $("#dim-options").val());
    let features = npc_id.dimensions[catIdx].features;

    if (featDesc && featName) {
      let addIdx = getFindIdx(features, "name", featName) > -1 ? getFindIdx(features, "name", featName) : null;
      if (addIdx || addIdx === 0) {
        features.splice(addIdx, 1, {
          "name": featName,
          "desc": featDesc,
        });
      } else {
        features.push({
          "name": featName,
          "desc": featDesc,
        });
      }

      updateCompBlock(0);

      $("#features-name-input").val("");
      $("#features-desc-input").val("");
    }
  }
}

function addNewDimension(npc_id) {
  let newName = $("#newdim-input").val(),
    add = true;

  if (getFindIdx(npc_id.dimensions, "name", newName) > -1) {
    alert("The '" + newName + "' dimension already exists");
    add = false;
  };

  if (add) {
    npc_id.dimensions.push({
      "name": newName,
      "stats": [],
      "features": [],
    });

    $("#newdim-input").val("");

    updateCompBlock(0);
  }

};

var TrySaveFile4 = () => {
  CompData.SaveToFile();
}

var TryLoadFile4 = () => {
  CompData.RetrieveFromFile();
  $("#file-upload4").val("");
}

var LoadFilePrompt4 = () => {
  $("#file-upload4").click();
}

function ClearCompanion() {
  npc = {
    dimensions: [],
    separationPoint: 1,
    doubleColumns: false,
    name: "Companion",
    size: "medium",
    type: "humanoid",
    tag: "",
    tier: "apprentice",
    classification: "hireling",
  };
  setInputs();
}

function CompImage() {
  domtoimage.toBlob(document.getElementById("c-block"))
    .then(function(blob) {
      window.saveAs(blob, npc.name.toLowerCase() + ".png");
    });
}

var CompData = {
  // Saving
  SaveToLocalStorage: () => localStorage.setItem("npc", JSON.stringify(npc)),

  SaveToFile: () => saveAs(new Blob([JSON.stringify(npc)], {
    type: "text/plain;charset=utf-8"
  }), npc.name.toLowerCase() + ".companion"),

  // Retrieving
  RetrieveFromLocalStorage: function() {
    let savedData = localStorage.getItem("npc");
    if (savedData != undefined)
      npc = JSON.parse(savedData);
  },

  RetrieveFromFile: function() {
    let file = $("#file-upload4").prop("files")[0],
      reader = new FileReader();

    reader.onload = function(e) {
      let npc_add = JSON.parse(reader.result);
      if (npc_add.length > 0) npc = npc_add[0];
      else npc = npc_add;
      setInputs();
    };

    reader.readAsText(file);
  },
}

$(function() {
  $.getJSON("js/JSON/companiondata.json?version=1.0", function(json2) {
    cdata = json2;
    $.getJSON("js/JSON/statblockdata.json?version=5.0", function(json) {
      data = json;
      CompData.RetrieveFromLocalStorage();
      setInputs();
    });
  });
});
