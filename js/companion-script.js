var npc = {
  dimensions: [],
  separationPoint: 1,
  doubleColumns: false,
};

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

  shortStats.splice(0, 0, {
    "name": statName,
    "value": statVal,
  });

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

  let leftDimsArr = [],
    rightDimsArr = [];

  for (let i = 0; i < npc.dimensions.length; i++) {
    let dimTxt = BlockFunctions.DrawDimension(npc, i);
    (i < npc.separationPoint ? leftDimsArr : rightDimsArr).push(dimTxt);
  }

  $("#dimension-left").html(leftDimsArr.join(""));
  $("#dimension-right").html(rightDimsArr.join(""));
}

var BlockFunctions = {
  DrawDimension: function(npc_id, idx) {
    let dataSet = npc_id.dimensions[idx],
      displayArr = [];

    displayArr.push("<svg height='.3125rem' width='100%' class='tapered-rule'><polyline points='0,0 0,3 400,3 400,0'></polyline></svg>");
    displayArr.push("<h3>" + StringFunctions.WordCapitalize(dataSet.name) + "</h3>")

    for (let i = 0; i < dataSet.stats.length; i++) {
      displayArr.push(this.MakeStatHTML(dataSet.stats[i], i === 0, (i === dataSet.stats.length - 1)));
    }
    return displayArr.join("");

  },

  MakeStatHTML: function(stats, firstLine, lastLine) {
    if (stats.length == 0) return "";
    let htmlClass = lastLine ? "property-line last" : firstLine ? "property-line first" : "property-line";
    return "<div class=\"" + htmlClass + "\"><div><h4>" + StringFunctions.WordCapitalize(stats.name) + "</h4> <p>" + StringFunctions.FormatString(stats.value, false) + "</p></div></div>"
  },
}

function addFeat(npc_id) {
  let featName = $("#cfeat-name-input").val().toLowerCase(),
    featDesc = $("#cfeat-desc-input").val(),
    catIdx = $("#dim-options").val() * 1;
  let features = npc_id.dimensions[catIdx].features;

  features.splice(0, 0, {
    "name": featName,
    "description": featDesc,
  });

  updateCompBlock(0);
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
