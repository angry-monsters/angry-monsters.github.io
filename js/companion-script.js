var npc = {
  dimensions: [{
    name: "Interaction",
    stats: [],
    features: []
  }],
  separationPoint: 1,
  doubleColumns: false,
  name: "Companion",
  size: "medium",
  type: "humanoid",
  tag: "",
  tier: "apprentice",
  classification: "hireling",
  strPoints: 1,
  dexPoints: 1,
  conPoints: 1,
  intPoints: 1,
  wisPoints: 1,
  chaPoints: 1,
  savingThrow: "*",
  blindsight: 0,
  blind: false,
  darkvision: 0,
  tremorsense: 0,
  truesight: 0,
  telepathy: 0,
  skills: [],
  languages: [],
  understandsBut: "",
  loyalty: "none",
  loyalMaster: false,
  alignment: "none",
  ac: 10,
  armor: "",
  speed: 30,
  burrowSpeed: 0,
  climbSpeed: 0,
  flySpeed: 0,
  hover: false,
  swimSpeed: 0,
  customSpeed: false,
  speedDesc: "30 ft.",
  hitDie: 6,
  moraleTrig: "Critical",
  moraleFail: "Retreats",
  damagetypes: [],
  specialdamage: [],
  conditions: [],
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

  npc.strPoints = $("#str-c").val() * 1;
  npc.dexPoints = $("#dex-c").val() * 1;
  npc.conPoints = $("#con-c").val() * 1;
  npc.intPoints = $("#int-c").val() * 1;
  npc.wisPoints = $("#wis-c").val() * 1;
  npc.chaPoints = $("#cha-c").val() * 1;
  npc.savingThrow = $("#csave-input").val();

  npc.blindsight = $("#blindsight-inputc").val() * 1;
  npc.blind = $("#blindness-inputc").prop("checked");
  npc.darkvision = $("#darkvision-inputc").val() * 1;
  npc.tremorsense = $("#tremorsense-inputc").val() * 1;
  npc.truesight = $("#truesight-inputc").val() * 1;

  npc.telepathy = $("#telepathy-inputc").val() * 1;

  npc.understandsBut = $("#cbut-input").val();

  npc.loyalty = $("#cloyal-input").val();
  npc.loyalMaster = $("#loyal-master-inputc").prop("checked");
  npc.alignment = $("#calign-input").val();

  npc.ac = $("#ac-inputc").val() * 1;
  npc.armor = $("#acdesc-inputc").val();
  npc.hitDie = $("#chitdie-inputc").val() * 1;

  npc.customSpeed = $("#speed-other-inputc").prop("checked");
  npc.speedDesc = $("#custom-speed-inputc").val();
  npc.speed = $("#speed-inputc").val() * 1;

  npc.swimSpeed = $("#swim-inputc").val() * 1;
  npc.burrowSpeed = $("#burrow-inputc").val() * 1;
  npc.climbSpeed = $("#climb-inputc").val() * 1;

  npc.flySpeed = $("#fly-inputc").val() * 1;
  npc.hover = $("#hover-inputc").prop("checked");

  npc.moraleTrig = $("#moraletrig-inputc").val();
  npc.moraleFail = $("#moralefail-inputc").val();

  updateCompBlock(0);
}

var ComStrFunctions = {
  WriteSubheader: function(npc_id) {
    return StringFunctions.StringCapitalize(npc_id.size) + " " + npc_id.type + (npc_id.tag != "" ? " (" + npc_id.tag + ")" : "") + ", " + npc_id.tier + " tier " + npc_id.classification;
  },

  GetPassive: function(npc_id, skillName, skillAbility) {
    let ppData = ArrayFunctions.FindInList(npc_id.skills, skillName),
      pp = 10 + npc_id[skillAbility + "Points"];
    if (ppData != null)
      pp += data.tiers[npc_id.tier].prof * (ppData.hasOwnProperty("note") ? 2 : 1);
    return pp;
  },

  GetSkills: function(npc_id) {
    let skillsDisplayArr = [];
    for (let index = 0; index < npc_id.skills.length; index++) {
      let skillData = npc_id.skills[index];
      skillsDisplayArr.push(StringFunctions.StringCapitalize(skillData.name) + " " +
        StringFunctions.BonusFormat(npc_id[skillData.stat + "Points"] + data.tiers[npc_id.tier].prof * (skillData.hasOwnProperty("note") ? 2 : 1)));
    }
    return skillsDisplayArr.join(", ");
  },

  GetLangs: function(npc_id) {
    let langsDisplayArr = [],
      langsDisplayArr2 = [];

    for (let index = 0; index < npc_id.languages.length; index++) {
      let langData = npc_id.languages[index];
      if (langData.hasOwnProperty("note")) {
        langsDisplayArr2.push(StringFunctions.StringCapitalize(langData.name));
      } else {
        langsDisplayArr.push(StringFunctions.StringCapitalize(langData.name));
      }
    }

    if (langsDisplayArr2.length > 0) {
      langsDisplayArr2.splice(0, 1, ("understands " + langsDisplayArr2[0]));

      if (langsDisplayArr2.length > 1) {
        let removeIdx = langsDisplayArr2.length - 2;
        langsDisplayArr2.splice(removeIdx, 2, (langsDisplayArr2[removeIdx] + " and " + langsDisplayArr2[removeIdx + 1]));
      }

      if (npc_id.understandsBut !== "") {
        let removeIdx = langsDisplayArr2.length - 1;
        langsDisplayArr2.splice(removeIdx, 1, (langsDisplayArr2[removeIdx] + " but " + npc_id.understandsBut));
      }

      langsDisplayArr = langsDisplayArr.concat(langsDisplayArr2);
    }

    if (npc_id.telepathy > 0) langsDisplayArr.push("telepathy " + npc_id.telepathy + " ft.");

    return langsDisplayArr.join(", ");
  },

  GetHealth: function(npc_id) {
    let conBonus = npc_id.conPoints,
      baseDie = npc_id.hitDie,
      effLev = cdata.tiers[npc_id.tier].lev;

    let perLev = Math.ceil((baseDie + 1) / 2) + conBonus;

    return conBonus + baseDie + ((effLev - 1) * perLev);
  },

  GetArray: function(npcArr) {
    let arrDisplayArr = [];

    for (let index = 0; index < npcArr.length; index++) {
      let arrData = npcArr[index];
      arrDisplayArr.push(arrData.name);
    }

    return arrDisplayArr;
  },

  GetCondArray: function(npcArr, arrNote) {
    let npcDisplayArr = [];

    for (let index = 0; index < npcArr.length; index++) {
      let arrData = npcArr[index];
      if (arrData.note === arrNote) npcDisplayArr.push(arrData);
    }

    return this.GetArray(npcDisplayArr);
  },
}

function splitSkillTools(npc_id) {
  let finalR = {
    name: "tools",
    switch: []
  };
  for (let i = 0; i < npc_id.skills.length; i++) {
    let profData = npc_id.skills[i],
      isSkill = ArrayFunctions.FindInList(data.allSkills, profData.name);
    finalR.switch.push((isSkill == null ? 2 : 0));
  }
  return finalR;
}

function setInputs() {
  $("#col-toggle").prop("checked", npc.doubleColumns);
  ComFormFunctions.ShowHideSeparatorInput();

  $("#cname-input").val(npc.name);
  $("#csize-input").val(npc.size);
  $("#ctier-input").val(npc.tier);
  $("#ctag-input").val(npc.tag);

  if (data.types.includes(npc.type)) {
    $("#ctype-input").val(npc.type);
    $("#cother-type-input").val("");
  } else {
    $("#ctype-input").val("*");
    $("#cother-type-input").val(npc.type);
  }
  ComFormFunctions.ShowHideOther('cother-type-input', 'ctype-input');

  if (cdata.classifications.includes(npc.classification)) {
    $("#cclass-input").val(npc.classification);
    $("#cother-class-input").val("");
  } else {
    $("#cclass-input").val("*");
    $("#cother-class-input").val(npc.classification);
  }
  ComFormFunctions.ShowHideOther('cother-class-input', 'cclass-input');

  $("#str-c").val(npc.strPoints);
  $("#dex-c").val(npc.dexPoints);
  $("#con-c").val(npc.conPoints);
  $("#int-c").val(npc.intPoints);
  $("#wis-c").val(npc.wisPoints);
  $("#cha-c").val(npc.chaPoints);
  $("#csave-input").val(npc.savingThrow);

  $("#blindsight-inputc").val(npc.blindsight);
  $("#blindness-inputc").prop("checked", npc.blind);
  ComFormFunctions.ShowHideTrueFalse('blind-toggle', npc.blindsight > 0);
  $("#darkvision-inputc").val(npc.darkvision);
  $("#tremorsense-inputc").val(npc.tremorsense);
  $("#truesight-inputc").val(npc.truesight);

  $("#telepathy-inputc").val(npc.telepathy);

  $("#cbut-input").val(npc.understandsBut);

  $("#cloyal-input").val(npc.loyalty);
  $("#loyal-master-inputc").prop("checked", npc.loyalMaster);
  ComFormFunctions.ShowHideTrueFalse('loyalty-master-toggle', npc.loyalty !== "none");
  $("#calign-input").val(npc.alignment);

  $("#ac-inputc").val(npc.ac);
  $("#acdesc-inputc").val(npc.armor);
  $("#chitdie-inputc").val(npc.hitDie);

  $("#speed-other-inputc").prop("checked", npc.customSpeed);
  $("#custom-speed-inputc").val(npc.speedDesc);
  $("#speed-inputc").val(npc.speed);
  ComFormFunctions.ShowHideTrueFalse('speed-table-c', !npc.customSpeed);
  ComFormFunctions.ShowHideTrueFalse('speed-inputc', !npc.customSpeed);
  ComFormFunctions.ShowHideTrueFalse('custom-speed-inputc', npc.customSpeed)

  $("#swim-inputc").val(npc.swimSpeed);
  $("#burrow-inputc").val(npc.burrowSpeed);
  $("#climb-inputc").val(npc.climbSpeed);

  $("#fly-inputc").val(npc.flySpeed);
  $("#hover-inputc").prop("checked", npc.hover);
  ComFormFunctions.ShowHideTrueFalse('hover-toggle', npc.flySpeed > 0)

  $("#moraletrig-inputc").val(npc.moraleTrig);
  $("#moralefail-inputc").val(npc.moraleFail);

  updateCompBlock(0);
}

var ComFormFunctions = {
  ShowHideOther: function(other, select, checker = "*") {
    FormFunctions.ShowHideHtmlElement(("#" + other), $("#" + select).val() === checker);
  },

  ShowHideTrueFalse: function(inputID, checkCond) {
    FormFunctions.ShowHideHtmlElement(("#" + inputID), checkCond);
  },

  ShowHideSection: function(select) {
    for (let i = 0; i < npc.dimensions.length; i++) {
      FormFunctions.ShowHideHtmlElement(("#dim-" + npc.dimensions[i].name), select !== npc.dimensions[i].name);
    }
  },

  ShowHideParch: function() {
    $("#c-block").toggleClass("c-plain", !$("#parch-toggle").prop("checked"));
    $(".blue-border").toggleClass("c-plain", !$("#parch-toggle").prop("checked"));
  },

  ShowHideSeparatorInput: function() {
    FormFunctions.ShowHideHtmlElement("#c-separator-button", npc.doubleColumns);
  },

  MakeDisplayList: function(arrIdx, arrName, isBlock = false, isDim = false, outElem = arrName) {
    let arr = (isDim ? npc.dimensions : npc.dimensions[arrIdx][arrName]),
      displayArr = [],
      content = "",
      arrElement = "#" + outElem + "-input-list";
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index],
        content = (isBlock ? "<b>" : "") + StringFunctions.FormatString(element.name, false) + (element.hasOwnProperty("desc") ?
          ":" + (isBlock ? "</b>" : "") + " " + StringFunctions.FormatString(element.desc, isBlock) : (isBlock ? "</b>" : ""));

      let functionArgs = arrIdx + " ,\"" + arrName + "\", " + index + ", " + isDim,
        imageHTML = "<svg class='statblock-image' onclick='ComFormFunctions.RemoveDisplayListItem(" + functionArgs + ")'><use xlink:href='dndimages/icons.svg?version=1.0#x-icon'></use></svg>";
      if (isDim && element.name === "Interaction") imageHTML = "<svg class='statblock-image' style='cursor: default'></svg>";
      if (isBlock)
        imageHTML += " <svg class='statblock-image' onclick='ComFormFunctions.EditDisplayListItem(" + functionArgs + ", \"" + outElem + "\")'><use xlink:href='dndimages/icons.svg?version=1.0#edit-icon'></use></svg>";
      imageHTML += " <svg class='statblock-image' onclick='ComFormFunctions.SwapDisplayListItem(" + functionArgs + ", -1)'><use xlink:href='dndimages/icons.svg?version=1.0#up-icon'></use></svg>" +
        " <svg class='statblock-image' onclick='ComFormFunctions.SwapDisplayListItem(" + functionArgs + ", 1)'><use xlink:href='dndimages/icons.svg?version=1.0#down-icon'></use></svg>";
      displayArr.push("<li> " + imageHTML + " " + content + "</li>");
    }
    $(arrElement).html(displayArr.join(""));

    $(arrElement).parent()[arr.length == 0 ? "hide" : "show"]();
  },

  RemoveDisplayListItem: function(arrIdx, arrName, index, isDim) {
    let arr = (isDim ? npc.dimensions : npc.dimensions[arrIdx][arrName]);
    arr.splice(index, 1);
    if (isDim) $("#dim-options").val("");
    updateCompBlock(0);
  },

  EditDisplayListItem: function(arrIdx, arrName, index, isDim, outElem) {
    let arr = npc.dimensions[arrIdx][arrName][index];
    $("#" + outElem + "-name-input").val(arr.name);
    $("#" + outElem + "-desc-input").val(arr.desc);
  },

  SwapDisplayListItem: function(arrIdx, arrName, index, isDim, swap) {
    let arr = (isDim ? npc.dimensions : npc.dimensions[arrIdx][arrName]);
    if (index + swap < 0 || index + swap >= arr.length) return;
    let temp = arr[index + swap];
    arr[index + swap] = arr[index];
    arr[index] = temp;
    updateCompBlock(0);
  },

  MakeNPCList: function(arrName, capitalize, altDisplayArr = null) {
    let arr = (arrName === "damage" ? npc.damagetypes.concat(npc.specialdamage) : npc[arrName]),
      displayArr = [],
      content = "",
      arrElement = "#" + arrName + "c-input-list",
      displayArr2 = [];
    for (let index = 0; index < arr.length; index++) {
      let element = arr[index],
        elementName = capitalize ? StringFunctions.StringCapitalize(element.name) : element.name,
        note = element.hasOwnProperty("note") ? element.note : "",
        switchVal = (altDisplayArr ? altDisplayArr.switch[index] : 0);


      content = "" + StringFunctions.FormatString(elementName + note, false) + (
        switchVal > 1 ?
        ": " + StringFunctions.FormatString(element.stat, false) : "");

      let functionArgs = arrName + "\", " + index,
        imageHTML = "<svg class='statblock-image' onclick='ComFormFunctions.RemoveNPCListItem(\"" + functionArgs + ")'><use xlink:href='dndimages/icons.svg?version=1.0#x-icon'></use></svg>";
      if (
        switchVal > 0) {
        displayArr2.push("<li> " + imageHTML + " " + content + "</li>");
      } else {
        displayArr.push("<li> " + imageHTML + " " + content + "</li>");
      }
    }

    if (altDisplayArr) {
      arrElement2 = "#" + altDisplayArr.name + "c-input-list";
      $(arrElement2).html(displayArr2.join(""));
      $(arrElement2).parent()[displayArr2.length == 0 ? "hide" : "show"]();
    }

    $(arrElement).html(displayArr.join(""));
    $(arrElement).parent()[displayArr.length == 0 ? "hide" : "show"]();
  },

  RemoveNPCListItem: function(arrName, index) {
    let arr;
    if (arrName == "damage") {
      if (npc.damagetypes.length - index > 0)
        arr = npc.damagetypes;
      else {
        index -= npc.damagetypes.length;
        arr = npc.specialdamage;
      }
    } else
      arr = npc[arrName];

    arr.splice(index, 1);
    updateCompBlock(0);
  },
};

function addSkillC(note) {
  GetVariablesFunctions.AddSkill($("#skills-inputc").val(), note, npc);

  updateCompBlock(0);
}

function addToolC(note) {
  GetVariablesFunctions.AddSkill($("#tools-inputc").val(), note, npc, $("#toolsAS-inputc").val());

  updateCompBlock(0);
}

function addLangC(note) {
  let lang = $("#clanguages-input").val();
  if (lang === "*")
    lang = $("#cother-language-input").val().trim();
  if (!lang.length) return;

  if (npc.languages.length > 0) {
    if (lang.toLowerCase() === "all" || npc.languages[0].name.toLowerCase() === "all")
      npc.languages = [];
  }

  let newLang = {
    "name": lang,
  };
  if (note) newLang["note"] = note;

  ArrayFunctions.ArrayInsert(npc.languages, newLang, true);

  updateCompBlock(0);
}

function addDamageC(note) {
  let damageName = $("#damagetypes-inputc").val();
  if (damageName === "*")
    damageName = $("#cother-damage-input").val().trim();
  if (!damageName.length) return;

  let special = !data.allNormalDamageTypes.includes(damageName.toLowerCase());

  ArrayFunctions.ArrayInsert(npc[special ? "specialdamage" : "damagetypes"], {
    "name": damageName,
    "note": note
  }, true);

  updateCompBlock(0);
}

function addConditionC() {
  ArrayFunctions.ArrayInsert(npc.conditions, {
    "name": $("#conditions-inputc").val()
  }, true);

  updateCompBlock(0);
}

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

  let interactIdx = getFindIdx(npc.dimensions, "name", "Interaction");
  npc.dimensions[interactIdx].stats = [];

  if (npc.alignment !== "none") {
    npc.dimensions[interactIdx].stats.push({
      name: "Alignment",
      desc: npc.alignment
    });
  }

  if (npc.languages.length > 0) {
    npc.dimensions[interactIdx].stats.push({
      name: "Languages",
      desc: ComStrFunctions.GetLangs(npc)
    });
  }

  if (npc.loyalty !== "none") {
    npc.dimensions[interactIdx].stats.push({
      name: "Loyalty",
      desc: npc.loyalty + (npc.loyalMaster ? " (master)" : "")
    });
  }

  let dropdownBuffer = [],
    leftDimsArr = [],
    rightDimsArr = [];

  for (let i = 0; i < npc.dimensions.length; i++) {
    let dimTxt = BlockFunctions.DrawDimension(npc, i);
    (i < npc.separationPoint ? leftDimsArr : rightDimsArr).push(dimTxt);
    if (npc.dimensions[i].name !== "Interaction")
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

  let setPtsC = (id, pts) =>
    $(id).html(StringFunctions.BonusFormat(pts));
  setPtsC("#strptsc", npc.strPoints);
  setPtsC("#dexptsc", npc.dexPoints);
  setPtsC("#conptsc", npc.conPoints);
  setPtsC("#intptsc", npc.intPoints);
  setPtsC("#wisptsc", npc.wisPoints);
  setPtsC("#chaptsc", npc.chaPoints);

  setPtsC("#initc", npc.dexPoints);

  $("#ac-numc").html(npc.ac);
  $("#ac-descc").html((npc.armor ? "(" + npc.armor + ")" : ""));
  $("#speedc").html(StringFunctions.GetSpeed(npc));

  let hpMax = ComStrFunctions.GetHealth(npc);
  let hpString = hpMax + "|" + Math.floor(hpMax / 2) + "|" + Math.floor(Math.floor(hpMax / 2) / 2);
  let hpDie = cdata.tiers[npc.tier].lev + "d" + npc.hitDie + StringFunctions.BonusFormat(cdata.tiers[npc.tier].lev * npc.conPoints);

  $("#healthc").html(hpString);
  $("#healthc-diecode").html(hpDie);
  $("#recover-c").html(Math.floor(0.75 * hpMax));

  $("#morale-c").html(npc.moraleTrig + " (" + npc.moraleFail + ")");

  let combatStatsArr = [];

  let addCombatArr = (arr, arr2, code, arr3 = []) => {
    let codeAdj = " (" + code + ")";
    let comArr = ComStrFunctions.GetCondArray(arr, codeAdj),
      comArr2 = ComStrFunctions.GetCondArray(arr2, codeAdj),
      comArr3 = ComStrFunctions.GetArray(arr3);
    if ((comArr.length + comArr2.length + comArr3.length) > 0) {
      let addStr = StringFunctions.ConcatUnlessEmpty(comArr.join(", "), comArr2.join("; "), "; ").toLowerCase();
      let addStrFinal = StringFunctions.ConcatUnlessEmpty(addStr, comArr3.join(", "), "; ").toLowerCase();
      combatStatsArr.push(BlockFunctions.MakePieceHTML(code, addStrFinal));
    }
  }

  addCombatArr(npc.damagetypes, npc.specialdamage, "Vulnerable")
  addCombatArr(npc.damagetypes, npc.specialdamage, "Absorbs")
  addCombatArr(npc.damagetypes, npc.specialdamage, "Resists")
  addCombatArr(npc.damagetypes, npc.specialdamage, "Immune", npc.conditions)

  $("#dimension-combatStats").html(combatStatsArr.join(""));

  if (npc.savingThrow !== "*") {
    let oldPts = npc[npc.savingThrow + "Points"];
    $("#" + npc.savingThrow + "ptsc").html(StringFunctions.BonusFormat(oldPts) + "|" + StringFunctions.BonusFormat((oldPts + data.tiers[npc.tier].prof)));
  }

  let absSavesProfsArr = [];

  if (npc.skills.length !== 0) {
    absSavesProfsArr.push(BlockFunctions.MakePieceHTML('Proficiencies', ComStrFunctions.GetSkills(npc)));
  }
  if (StringFunctions.GetSenses(npc, true) !== "") {
    absSavesProfsArr.push(BlockFunctions.MakePieceHTML('Senses', StringFunctions.GetSenses(npc, true)));
  }
  absSavesProfsArr.push(BlockFunctions.MakePieceHTML('Passive Perception', ComStrFunctions.GetPassive(npc, "Perception", "wis"), true));

  $("#dimension-sensesProfs").html(absSavesProfsArr.join(""));

  CompData.SaveToLocalStorage();

  updateFSList(dropV1);
  ComFormFunctions.MakeDisplayList(null, "dims", false, true);
  ComFormFunctions.MakeDisplayList(interactIdx, "features", true, false, "personality");
  ComFormFunctions.MakeNPCList("skills", true, splitSkillTools(npc));
  ComFormFunctions.MakeNPCList("languages", true);
  ComFormFunctions.MakeNPCList("conditions", true);
  ComFormFunctions.MakeNPCList("damage", true);
  ComFormFunctions.ShowHideParch();
}

function updateFSList(dropV1) {
  if (dropV1) {
    let catIdx = getFindIdx(npc.dimensions, "name", dropV1);
    ComFormFunctions.MakeDisplayList(catIdx, "stats", true);
    ComFormFunctions.MakeDisplayList(catIdx, "features", true);
  } else {
    $("#features-input-list").parent()["hide"]();
    $("#stats-input-list").parent()["hide"]();
    $("#features-input-list").html("");
    $("#stats-input-list").html("");
  }
}

var BlockFunctions = {
  DrawDimension: function(npc_id, idx) {
    let dimIDn = "<div id='dim-" + npc_id.dimensions[idx].name + "'>";
    let dataSet = npc_id.dimensions[idx],
      displayArr = [dimIDn];

    displayArr.push("<svg height='.3125rem' width='100%' class='tapered-rule'><polyline points='0,0 400,2.5 0,5'></polyline></svg>");
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

  MakePieceHTML: function(pieceName, pieceText, lastLine = false) {
    let htmlClass = "c-line";
    htmlClass += lastLine ? " last" : "";
    return "<div class=\"" + htmlClass + "\"><h4>" + pieceName + "</h4> <p>" + pieceText + "</p></div>"
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

function insertFeat(npc_id, selDim, featName, featDesc) {
  let catIdx = getFindIdx(npc_id.dimensions, "name", selDim);
  let features = npc_id.dimensions[catIdx].features;

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
}

function addFeat(npc_id) {
  let selDim = $("#dim-options").val();
  if (selDim) {
    let featName = $("#features-name-input").val(),
      featDesc = $("#features-desc-input").val();

    if (featDesc && featName) {

      insertFeat(npc_id, selDim, featName, featDesc);

      $("#features-name-input").val("");
      $("#features-desc-input").val("");
    }
  }
}

function addPersFeat(npc_id) {
  let featName = $("#personality-name-input").val(),
    featDesc = $("#personality-desc-input").val();

  if (featDesc && featName) {

    insertFeat(npc_id, "Interaction", featName, featDesc);

    $("#personality-name-input").val("");
    $("#personality-desc-input").val("");
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
    dimensions: [{
      name: "Interaction",
      stats: [],
      features: []
    }],
    separationPoint: 1,
    doubleColumns: false,
    name: "Companion",
    size: "medium",
    type: "humanoid",
    tag: "",
    tier: "apprentice",
    classification: "hireling",
    strPoints: 1,
    dexPoints: 1,
    conPoints: 1,
    intPoints: 1,
    wisPoints: 1,
    chaPoints: 1,
    savingThrow: "*",
    blindsight: 0,
    blind: false,
    darkvision: 0,
    tremorsense: 0,
    truesight: 0,
    telepathy: 0,
    skills: [],
    languages: [],
    understandsBut: "",
    loyalty: "none",
    loyalMaster: false,
    alignment: "none",
    ac: 10,
    armor: "",
    speed: 30,
    burrowSpeed: 0,
    climbSpeed: 0,
    flySpeed: 0,
    hover: false,
    swimSpeed: 0,
    customSpeed: false,
    speedDesc: "30 ft.",
    hitDie: 6,
    moraleTrig: "Critical",
    moraleFail: "Retreats",
    damagetypes: [],
    specialdamage: [],
    conditions: [],
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
  $.getJSON("js/JSON/companiondata.json?version=1.5", function(json2) {
    cdata = json2;
    $.getJSON("js/JSON/statblockdata.json?version=5.5", function(json) {
      data = json;
      CompData.RetrieveFromLocalStorage();
      setInputs();
    });
  });
});
