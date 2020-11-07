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
  $("#c1col-input").prop("checked", !npc.doubleColumns);
  $("#c2col-input").prop("checked", npc.doubleColumns);
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

  ShowHideSeparatorInput: function() {
    FormFunctions.ShowHideHtmlElement("#c-separator-button", npc.doubleColumns);
  },
};

function addStat(npc_id) {
  let statName = $("#shortname-input").val().toLowerCase(),
    statVal = $("#shortval-input").val(),
    catIdx = getFindIdx(npc_id.dimensions, "name", $("#dim-options").val());
  let shortStats = npc_id.dimensions[catIdx].stats;

  if (statVal && statName) {
    let addIdx = getFindIdx(shortStats, "name", statName) > -1 ? getFindIdx(shortStats, "name", statName) : null;
    if (addIdx || addIdx === 0) {
      shortStats.splice(addIdx, 1, {
        "name": statName,
        "value": statVal,
      });
    } else {
      shortStats.push({
        "name": statName,
        "value": statVal,
      });
    }

    updateCompBlock(0);

    $("#shortname-input").val("");
    $("#shortval-input").val("");
  }
}

function getFindIdx(Arr, Prop, Val) {
  return Arr.findIndex(function(Arr2) {
    return Arr2[Prop] === Val;
  })
}

function changeWidth() {
  npc.doubleColumns = $("#c2col-input").prop("checked");
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
    dropdownBuffer.push("<option value=", npc.dimensions[i].name, ">", StringFunctions.WordCapitalize(npc.dimensions[i].name), "</option>");
  }

  $("#dim-options").html(dropdownBuffer.join(""));
  dropdownBuffer.splice(0, 0, "<option value='*'>No Hidden Dimensions</option>");
  $("#dim-hide").html(dropdownBuffer.join(""));

  $("#dimension-left").html(leftDimsArr.join(""));
  $("#dimension-right").html(rightDimsArr.join(""));

  $("#comp-name").html(npc.name);
  $("#comp-tagline").html(ComStrFunctions.WriteSubheader(npc));

  CompData.SaveToLocalStorage;
}

var BlockFunctions = {
  DrawDimension: function(npc_id, idx) {
    let dimIDn = "<div id='dim-" + npc_id.dimensions[idx].name + "'>";
    let dataSet = npc_id.dimensions[idx],
      displayArr = [dimIDn];

    displayArr.push("<svg height='.3125rem' width='100%' class='tapered-rule'><polyline points='0,0 0,3 400,3 400,0'></polyline></svg>");
    displayArr.push("<h3>" + StringFunctions.WordCapitalize(dataSet.name) + "</h3>")

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
    return "<div class=\"" + htmlClass + "\"><div><h4>" + StringFunctions.WordCapitalize(stats.name) + "</h4> <p>" + StringFunctions.FormatString(stats.value, false) + "</p></div></div>"
  },

  MakeFeatHTML: function(features, firstLine, lastLine) {
    if (features.length == 0) return "";
    let htmlClass = "c-line black";
    htmlClass += lastLine ? " last" : "";
    htmlClass += firstLine ? " first" : "";
    return "<div class=\"" + htmlClass + "\"><div><h4>" + StringFunctions.WordCapitalize(features.name) + "</h4> <br> <p>" + StringFunctions.FormatString(features.description, false) + "</p></div></div>"
  },
}

function addFeat(npc_id) {
  let featName = $("#cfeat-name-input").val().toLowerCase(),
    featDesc = $("#cfeat-desc-input").val(),
    catIdx = getFindIdx(npc_id.dimensions, "name", $("#dim-options").val());
  let features = npc_id.dimensions[catIdx].features;

  if (featDesc && featName) {
    let addIdx = getFindIdx(features, "name", featName) > -1 ? getFindIdx(features, "name", featName) : null;
    if (addIdx || addIdx === 0) {
      features.splice(addIdx, 1, {
        "name": featName,
        "description": featDesc,
      });
    } else {
      features.push({
        "name": featName,
        "description": featDesc,
      });
    }

    updateCompBlock(0);

    $("#cfeat-name-input").val("");
    $("#cfeat-desc-input").val("");
  }

}

function addNewDimension(npc_id) {
  let newName = $("#newdim-input").val().toLowerCase(),
    add = true;

  if (getFindIdx(npc_id.dimensions, "name", newName) > -1) {
    alert("The '" + StringFunctions.WordCapitalize(newName) + "' dimension already exists");
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
