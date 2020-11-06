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

}

var ComFormFunctions = {
  ShowHideOther: function(other, select) {
    FormFunctions.ShowHideHtmlElement(("#" + other), $("#" + select).val() == "*");
  },
};

function addStat(npc_id) {
  let statName = $("#shortname-input").val().toLowerCase(),
    statVal = $("#shortval-input").val(),
    catIdx = $("#dim-options").val() * 1;
  let shortStats = npc_id.dimensions[catIdx].stats;

  if (statVal && statName) {
    shortStats.splice(0, 0, {
      "name": statName,
      "value": statVal,
    });

    updateCompBlock(0);
  }
}

function updateCompBlock(moveSepPoint) {
  let maxSep = npc.dimensions.length - 1;
  if (npc.separationPoint == undefined)
    npc.separationPoint = Math.floor(maxSep / 2);
  if (moveSepPoint != undefined)
    npc.separationPoint = MathFunctions.Clamp(npc.separationPoint + moveSepPoint, 0, maxSep);

  let blockWidth = $("#c-block");
  npc.doubleColumns ? blockWidth.addClass('wide') : blockWidth.removeClass('wide');

  let leftDimsArr = [],
    rightDimsArr = [];

  for (let i = 0; i < npc.dimensions.length; i++) {
    let dimTxt = BlockFunctions.DrawDimension(npc, i);
    (i < npc.separationPoint ? leftDimsArr : rightDimsArr).push(dimTxt);
  }

  $("#dimension-left").html(leftDimsArr.join(""));
  $("#dimension-right").html(rightDimsArr.join(""));

  $("#comp-name").html(npc.name);
  $("#comp-tagline").html(ComStrFunctions.WriteSubheader(npc));

  localStorage.setItem("npc", JSON.stringify(npc));
}

var BlockFunctions = {
  DrawDimension: function(npc_id, idx) {
    let dataSet = npc_id.dimensions[idx],
      displayArr = [];

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

    return displayArr.join("");

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
    let htmlClass = "c-line";
    htmlClass += lastLine ? " last" : "";
    htmlClass += firstLine ? " first" : "";
    return "<div class=\"" + htmlClass + "\"><div><h4>" + StringFunctions.WordCapitalize(features.name) + "</h4> <br> <p>" + StringFunctions.FormatString(features.description, false) + "</p></div></div>"
  },
}

function addFeat(npc_id) {
  let featName = $("#cfeat-name-input").val().toLowerCase(),
    featDesc = $("#cfeat-desc-input").val(),
    catIdx = $("#dim-options").val() * 1;
  let features = npc_id.dimensions[catIdx].features;

  if (featDesc && featName) {
    features.splice(0, 0, {
      "name": featName,
      "description": featDesc,
    });

    updateCompBlock(0);
  }

}

function addNewDimension(npc_id) {
  let newName = $("#newdim-input").val().toLowerCase(),
    add = true,
    dropdownBuffer = [];

  for (let i = 0; i < npc_id.dimensions.length; i++) {
    if (npc_id.dimensions[i].name === newName) {
      alert("The '" + StringFunctions.WordCapitalize(newName) + "' dimension already exists");
      add = false;
    };
    dropdownBuffer.push("<option value=", i, ">", StringFunctions.WordCapitalize(npc_id.dimensions[i].name), "</option>");
  }

  if (add) {
    dropdownBuffer.push("<option value=", npc_id.dimensions.length, ">", StringFunctions.WordCapitalize(newName), "</option>");
    $("#dim-options").html(dropdownBuffer.join(""));

    npc_id.dimensions.push({
      "name": newName,
      "stats": [],
      "features": [],
    });

  }

  updateCompBlock(0);

};
