function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "flex";
  if (evt) {
    evt.currentTarget.className += " active";
  } else {
    document.getElementById('defaultOpen').className += " active";
  }
}

function encSort(value, index, self) {
    return self.indexOf(value) === index;
}

function showHideEncNotes(show) {
  if (show) {
    $("#enc-block").addClass('wide');
  } else {
    $("#enc-block").removeClass('wide');
  }
  $("#show-terrain").toggle();
  $("#hide-terrain").toggle();
}

var encDat = {
  battle: "Encounter",
  numPCs: "1",
  type: "30",
  terrain: "",
  tactics: "",
  conflict: "",
  exp: 0,
  pcTier: "apprentice"
};

var data;

var mon2 = [];
var mon3 = [];
var mon4 = [];
var monico = [];

var mon = {
    name: "Monster",
    size: "medium",
    type: "humanoid",
    tag: "",
    alignment: "any alignment",
    armorName: "average",
    acadj: 0,
    hpName: "average",
    hpCut: 1,
    hpadj: 0,
    shieldBonus: 0,
    dprName: "average",
    atkName: "average",
    stName: "average",
    otherArmorDesc: "no armor",
    speed: 30,
    burrowSpeed: 0,
    climbSpeed: 0,
    flySpeed: 0,
    hover: false,
    swimSpeed: 0,
    customSpeed: false,
    speedDesc: "30 ft.",
    strPoints: 10,
    dexPoints: 10,
    conPoints: 10,
    intPoints: 10,
    wisPoints: 10,
    chaPoints: 10,
    blindsight: 0,
    blind: false,
    darkvision: 0,
    tremorsense: 0,
    truesight: 0,
    telepathy: 0,
    tier: "apprentice",
    isLegendary: false,
    legendariesDescription: "",
    properties: [],
    abilities: [],
    actions: [],
    bonuses: [],
    villains: [],
    reactions: [],
    legendaries: [],
    sthrows: [],
    skills: [],
    damagetypes: [],
    specialdamage: [],
    conditions: [],
    languages: [],
    doubleColumns: false,
    separationPoint: 1,
    mtrig: "staggered",
    mthresh: .5,
    mtype: "retreat",
    mdc: 12,
    avgHP: 0,
    org: "group",
    threatadj: 0,
    threatval: 0,
    avgDMG: 0,
    paragon: []
};

// Update bestiary
function getMonsterInfo() {
  FormFunctions.MakeMonsterList();
}

function sortBestiary(sort_cat) {
  let order_check = $("#mon-sort-order").val();

  if ($("#mon-sort-order").val() === sort_cat) {
    mon2 = mon2.sort(function(a, b){
    var x = a[sort_cat].toLowerCase();
    var y = b[sort_cat].toLowerCase();
    if (x < y) {return 1;}
    if (x > y) {return -1;}
    return 0;
    });
    $("#mon-sort-order").val("");
  } else {
    mon2 = mon2.sort(function(a, b){
    var x = a[sort_cat].toLowerCase();
    var y = b[sort_cat].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
    });
    $("#mon-sort-order").val(sort_cat);
  }

  getMonsterInfo();
}

// Update encounters
function getEncounterInfo() {
  FormFunctions.MakeEncounterList();
}

// Save function
var TrySaveFile = () => {
    SavedData.SaveToFile();
}

var TrySaveFile2 = () => {
    ListData.SaveToFile();
}

var TrySaveFile3 = () => {
    mon3[mon3.length] = encDat;
    EncounterData.SaveToFile();
}

var TryManual = () => {
    UpdateBlockFromVariables(0);
    LoadBestiary.retrieveFromWindow();
    getMonsterInfo();
}

var LoadBestiary = {
  retrieveFromWindow: function() {
    let mon_inc = JSON.parse(JSON.stringify(mon));
    let endAdd = true;
    for (let index = 0; index < mon2.length; index++) {
      let lowercaseElement = mon_inc.name.toLowerCase();
      let lowercaseIndex = mon2[index].name.toLowerCase();
      if (lowercaseIndex == lowercaseElement) {
        mon2.splice(index, 1, mon_inc)
        endAdd = false;
      }
    }
    if (endAdd) mon2.push(mon_inc);
    localStorage.setItem("Mon2", JSON.stringify(mon2));
  },
}

function clearStorage() {
  localStorage.clear();
}

function ClearEncounter() {
  encDat = {
    battle: "Encounter",
    numPCs: "1",
    type: "30",
    terrain: "",
    tactics: "",
    conflict: "",
    exp: 0,
    pcTier: "apprentice"
  };
  FormFunctions.SetEncVars();
  localStorage.setItem("Enc3", JSON.stringify(encDat));
  mon3 = [];
  getEncounterInfo();
  localStorage.setItem("Mon3", JSON.stringify(mon3));
}

var TryEncounter = () => {
    UpdateBlockFromVariables(0);
    LoadEncounterAdd.retrieveFromWindow(mon);
    getEncounterInfo();
}

var TryEncounterAdd = () => {
    let mon_idx = $("#monster-options").val();
    let num_add = $("#creature-size").val();
    var incr;
    for (incr = 0; incr < num_add; incr++) LoadEncounterAdd.retrieveFromWindow(mon2[mon_idx]);
    getEncounterInfo();
}

var LoadEncounterAdd = {
  retrieveFromWindow: function(monArr) {
    let mon_inc = JSON.parse(JSON.stringify(monArr));
    mon3.push(mon_inc);
    localStorage.setItem("Mon3", JSON.stringify(mon3));
  },
}

// Upload file function
var LoadFilePrompt = () => {
    $("#file-upload").click();
}

var LoadFilePrompt2 = () => {
    $("#file-upload2").click();
}

var LoadFilePrompt3 = () => {
    $("#file-upload3").click();
}

// Load functions
var TryLoadFile = () => {
    SavedData.RetrieveFromFile();
    $("#file-upload").val("");
}

var TryLoadFile2 = () => {
    ListData.RetrieveFromFile();
    $("#file-upload2").val("");
}

var TryLoadFile3 = () => {
    EncounterData.RetrieveFromFile();
    $("#file-upload3").val("");
}

// Print function
function TryPrint(monster_page) {
    let printWindow = window.open();
    printWindow.document.write('<html><head><meta charset="utf-8"/><title>' + mon.name + '</title><link rel="stylesheet" type="text/css" href="css/statblock-style.css?version=2.2"><link rel="stylesheet" type="text/css" href="css/libre-baskerville.css"><link rel="stylesheet" type="text/css" href="css/noto-sans.css"></head><body><div id="print-block" class="content">');
    if (monster_page) {
      printWindow.document.write($("#stat-block-wrapper").html());
    } else {
      printWindow.document.write($("#enc-block-wrapper").html());
    }
    printWindow.document.write('</div></body></html>');
    printWindow.document.close();
}

// View as image function
function TryImage(monster_page) {
  if (monster_page) {
    domtoimage.toBlob(document.getElementById("stat-block"))
        .then(function(blob) {
            window.saveAs(blob, mon.name.toLowerCase() + ".png");
        });
  } else {
    domtoimage.toBlob(document.getElementById("enc-block"))
        .then(function(blob) {
            window.saveAs(blob, $("#enc-name-input").val().toLowerCase() + ".png");
        });
  }
}

function calcThreat() {
  let threat = mon.threatadj;
  if (mon.hpName === "poor") threat = threat - 1;
  if (mon.hpName === "good") threat = threat + 1;
  if (mon.armorName === "poor") threat = threat - 1;
  if (mon.armorName === "good") threat = threat + 1;
  if (mon.dprName === "poor") threat = threat - 1;
  if (mon.dprName === "good") threat = threat + 1;

  if (mon.atkName === "good" || mon.stName === "good") threat = threat + 1;
  if (mon.atkName === "poor" && mon.stName === "poor") threat = threat - 1;
  return threat;
}

// Update the main stat block from form variables
function UpdateBlockFromVariables(moveSeparationPoint) {
    GetVariablesFunctions.GetAllVariables();
    UpdateStatblock(moveSeparationPoint);
}

// Functions for saving/loading data
var SavedData = {
    // Saving

    SaveToLocalStorage: () => localStorage.setItem("SavedData", JSON.stringify(mon)),

    SaveToFile: () => saveAs(new Blob([JSON.stringify(mon)], {
        type: "text/plain;charset=utf-8"
    }), mon.name.toLowerCase() + ".monster"),

    // Retrieving

    RetrieveFromLocalStorage: function() {
        let savedData = localStorage.getItem("SavedData");
        if (savedData != undefined)
            mon = JSON.parse(savedData);
    },

    RetrieveFromFile: function() {
        let file = $("#file-upload").prop("files")[0],
            reader = new FileReader();

        reader.onload = function(e) {
            let mon_add = JSON.parse(reader.result);
            if (mon_add.length > 0) mon = mon_add[0];
            else mon = mon_add;
            Populate();
        };

        reader.readAsText(file);
    },
}

var ListData = {
    // Saving
    SaveToFile: () => saveAs(new Blob([JSON.stringify(mon2)], {
        type: "text/plain;charset=utf-8"
    }), "bestiary.compendium"),

    RetrieveFromLocalStorage: function() {
        let listData = localStorage.getItem("Mon2");
        if (listData != undefined) {
          mon2 = JSON.parse(listData);
          getMonsterInfo();
        }
    },

    RetrieveFromFile: function() {
        let file = $("#file-upload2").prop("files")[0],
            reader = new FileReader();

        reader.onload = function(e) {
            let mon_add = JSON.parse(reader.result);
            if (mon_add.length > 0) mon2 = mon2.concat(mon_add);
            else mon2.push(mon_add);
            if (mon2.slice(-1)[0].battle) {
              mon2.pop();
            }
            getMonsterInfo();
            localStorage.setItem("Mon2", JSON.stringify(mon2));
        };

        reader.readAsText(file);
    },
}

var EncounterData = {
    // Saving
    SaveToFile: () => saveAs(new Blob([JSON.stringify(mon3)], {
        type: "text/plain;charset=utf-8"
    }), $("#enc-name-input").val().toLowerCase() + ".encounter"),

    RetrieveFromLocalStorage: function() {
      let encDesc = localStorage.getItem("Enc3");
      if (encDesc != undefined) {
        encDat = JSON.parse(encDesc);
        FormFunctions.SetEncVars();
      }

      let encData = localStorage.getItem("Mon3");
        if (encData != undefined) {
          mon3 = JSON.parse(encData);
          getEncounterInfo();
        }

    },

    RetrieveFromFile: function() {
        let file = $("#file-upload3").prop("files")[0],
            reader = new FileReader();

        reader.onload = function(e) {
            let enc_add = JSON.parse(reader.result);
            if (enc_add.slice(-1)[0].battle) {
              encDat = enc_add.pop();
              localStorage.setItem("Enc3", JSON.stringify(encDat));
              FormFunctions.SetEncVars();
              mon3 = [];
            }
            if (enc_add.length > 0) mon3 = mon3.concat(enc_add);
            else mon3.push(enc_add);
            getEncounterInfo();
            localStorage.setItem("Mon3", JSON.stringify(mon3));
        };

        reader.readAsText(file);
    },
}

// Update the main stat block
function UpdateStatblock(moveSeparationPoint) {
    // Set Separation Point
    let separationMax = mon.abilities.length + mon.actions.length + mon.bonuses.length + mon.villains.length + mon.reactions.length - 1;

    if (mon.isLegendary)
        separationMax += (mon.legendaries.length == 0 ? 1 : mon.legendaries.length);

    if (mon.separationPoint == undefined)
        mon.separationPoint = Math.floor(separationMax / 2);

    if (moveSeparationPoint != undefined)
        mon.separationPoint = MathFunctions.Clamp(mon.separationPoint + moveSeparationPoint, 0, separationMax);

    // Save Before Continuing
    SavedData.SaveToLocalStorage();

    // One column or two columns
    let statBlock = $("#stat-block");
    mon.doubleColumns ? statBlock.addClass('wide') : statBlock.removeClass('wide');

    // Name and type
    $("#monster-name").html(mon.name);
    $("#monster-type").html(StringFunctions.StringCapitalize(mon.size) + " " + mon.type +
        (mon.tag == "" ? "" : " (" + mon.tag + ")") + (mon.alignment == "" ? "" : ", " + mon.alignment));

    // Armor Class
    $("#armor-class").html(StringFunctions.FormatString(StringFunctions.GetArmorData(mon,true)));

    // Hit Points
    $("#hit-points").html(StringFunctions.GetHP());
    StringFunctions.SetParagon();

    // Morale
    $("#morale").html(StringFunctions.GetMorale());

    // Speed
    $("#speed").html(StringFunctions.GetSpeed());

    // CR
    $("#cr-level").html(StringFunctions.GetCR());

    // Threat
    mon.threatval = calcThreat();
    $("#threat-level").html(StringFunctions.GetThreat(mon.threatval,true));

    // Stats
    let setPts = (id, pts) =>
        $(id).html(pts + " (" + StringFunctions.BonusFormat(MathFunctions.PointsToBonus(pts)) + ")");
    setPts("#strpts", mon.strPoints);
    setPts("#dexpts", mon.dexPoints);
    setPts("#conpts", mon.conPoints);
    setPts("#intpts", mon.intPoints);
    setPts("#wispts", mon.wisPoints);
    setPts("#chapts", mon.chaPoints);

    let propertiesDisplayArr = StringFunctions.GetPropertiesDisplayArr(mon);

    // Display All Properties (except CR)
    let propertiesDisplayList = [];
    propertiesDisplayList.push(StringFunctions.MakePropertyHTML(propertiesDisplayArr[0], true));
    for (let index = 1; index < propertiesDisplayArr.length; index++)
        propertiesDisplayList.push(StringFunctions.MakePropertyHTML(propertiesDisplayArr[index]));
    $("#properties-list").html(propertiesDisplayList.join(""));

    // Tier and Organization
    $("#tier-org").html(StringFunctions.StringCapitalize(mon.tier) + " tier, " + mon.org + " organization");

    // Abilities
    let traitsHTML = [];

    if (mon.abilities.length > 0) AddToTraitList(traitsHTML, mon.abilities);
    if (mon.actions.length > 0) AddToTraitList(traitsHTML, mon.actions, "<h3>Actions</h3>");
    if (mon.bonuses.length > 0) AddToTraitList(traitsHTML, mon.bonuses, "<h3>Bonus Actions</h3>");
    if (mon.reactions.length > 0) AddToTraitList(traitsHTML, mon.reactions, "<h3>Reactions</h3>");
    if (mon.villains.length > 0) AddToTraitList(traitsHTML, mon.villains, "<h3>Villain Actions</h3>");
    if (mon.isLegendary)
        AddToTraitList(traitsHTML, mon.legendaries, mon.legendariesDescription == "" ? "<h3>Legendary Actions</h3>" : ["<h3>Legendary Actions</h3><div class='property-block'>", mon.legendariesDescription, "</div></br>"], true);

    // Add traits, taking into account the width of the block (one column or two columns)
    let leftTraitsArr = [],
        rightTraitsArr = [],
        separationCounter = 0;
    for (let index = 0; index < traitsHTML.length; index++) {
        let trait = traitsHTML[index],
            raiseCounter = true;
        if (trait[0] == "*") {
            raiseCounter = false;
            trait = trait.substr(1);
        }
        (separationCounter < mon.separationPoint ? leftTraitsArr : rightTraitsArr).push(trait);
        if (raiseCounter)
            separationCounter++;
    }
    $("#traits-list-left").html(leftTraitsArr.join(""));
    $("#traits-list-right").html(rightTraitsArr.join(""));

    // Show or hide the separator input depending on how many columns there are
    FormFunctions.ShowHideSeparatorInput();
}

// Function used by UpdateStatblock for abilities
function AddToTraitList(traitsHTML, traitsArr, addElements, isLegendary = false) {
    let traitsDisplayList = [];

    // Add specific elements to the beginning of the array, usually a header
    if (addElements != undefined) {
        if (Array.isArray(addElements)) {
            for (let index = 0; index < addElements.length; index++)
                traitsHTML.push("*" + addElements[index]);
        } else
            traitsHTML.push("*" + addElements);
    }

    // There's a small difference in formatting for legendary actions
    for (let index = 0; index < traitsArr.length; index++)
        traitsHTML.push(StringFunctions[isLegendary ? "MakeTraitHTMLLegendary" : "MakeTraitHTML"](traitsArr[index].name, ReplaceTraitTags(traitsArr[index].desc,mon)));
}

function ReplaceTraitTags(desc,mon_id) {
    const bracketExp = /\[(.*?)\]/g,
        damageExp = /\d*d\d+/,
        bonusExp = /^[+-] ?(\d+)$/;
    let matches = [],
        match = null;
    while ((match = bracketExp.exec(desc)) != null)
        matches.push(match);

    matches.forEach(function(match) {
        const GetPoints = (pts) => data.statNames.includes(pts) ? MathFunctions.PointsToBonus(mon_id[pts + "Points"]) : null;
        let readString = match[1].toLowerCase().replace(/ +/g, ' ').trim();

        if (readString.length > 0) {
            if (readString == "mon")
                desc = desc.replace(match[0], mon_id.name.toLowerCase());
            else {
                let readPosition = 0,
                    type = null,
                    statPoints = GetPoints(readString.substring(0, 3)),
                    bonus = 0,
                    roll = null,
                    total = 0;

                // Get stat mods
                if (statPoints != null) {
                    bonus = statPoints;
                    readPosition = 3;
                    type = "stat";
                    if (readString.length > 3) {
                        if (readString.substring(3, 7) == " atk") {
                            bonus += data.tiers[mon_id.tier].prof;
                            readPosition = 7;
                            type = "atk";
                        } else if (readString.substring(3, 8) == " save") {
                            bonus += data.tiers[mon_id.tier].prof + 8;
                            readPosition = 8;
                            type = "save";
                        }
                    }

                    if (readPosition < readString.length) {
                        if (readString[readPosition] == " ")
                            readPosition++;
                        else
                            type = "error";
                    }
                }

                // Get roll
                if ((type == null || type == "stat") && readPosition < readString.length) {
                    let nextSpace = readString.indexOf(" ", readPosition),
                        nextToken = nextSpace >= 0 ? readString.substring(readPosition, nextSpace) : readString.substring(readPosition);

                    if (damageExp.test(nextToken)) {
                        roll = nextToken;
                        readPosition += nextToken.length;
                        type = "dmg";

                        if (readPosition < readString.length) {
                            if (readString[readPosition] == " ")
                                readPosition++;
                            else
                                type = "error";
                        }
                    }
                }

                // Get bonus
                if (type != "error" && readPosition < readString.length) {
                    let nextToken = readString.substring(readPosition),
                        bonusMatch = nextToken.match(bonusExp);
                    if (bonusMatch)
                        bonus += nextToken[0] == "-" ? -parseInt(bonusMatch[1]) : parseInt(bonusMatch[1]);
                    else
                        type = "error";
                }

                // Make the string
                if (type != null && type != "error") {
                    let replaceString = null;
                    switch (type) {
                        case "stat":
                        case "atk":
                            replaceString = StringFunctions.BonusFormat(bonus);
                            break;
                        case "save":
                            replaceString = bonus;
                            break;
                        case "dmg":
                            let splitRoll = roll.split("d"),
                                multiplier = splitRoll[0].length > 0 ? parseInt(splitRoll[0]) : 1,
                                dieSize = parseInt(splitRoll[1]);
                            replaceString = Math.max(Math.floor(multiplier * ((dieSize + 1) / 2) + bonus), 1) + " (" + multiplier + "d" + dieSize;
                            replaceString += bonus > 0 ?
                                " + " + bonus : bonus < 0 ?
                                " - " + -bonus : "";
                            replaceString += ")";
                            break;
                    }
                    desc = desc.replace(match[0], replaceString);
                }
            }
        }
    });

    return desc;
}

// Homebrewery/GM Binder markdown
function TryMarkdown() {
    let markdownWindow = window.open();
    let markdown = ['<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>', mon.name, '</title></head><body><h2>Homebrewery/GM Binder Markdown</h2><code>', mon.doubleColumns ? "___<br>___<br>" : "___<br>", '> ## ', mon.name, '<br>> #### *', (StringFunctions.StringCapitalize(mon.tier) + " tier, " + mon.org + " organization"), '* <br>> *', StringFunctions.StringCapitalize(mon.size), ' ', mon.type];
    if (mon.tag != "")
        markdown.push(' (', mon.tag, ')');
    markdown.push((mon.alignment == "" ? "" : ", " + mon.alignment), '*<br> > ## &lt;!-- --&gt; &lt;div style="margin-top:-25px"&gt;&amp;nbsp;&lt;/div&gt; <br> >___<br>> - **Armor Class** ', StringFunctions.FormatString(StringFunctions.GetArmorData(mon,true)), '<br>> - **Hit Points** ', StringFunctions.GetHP(), StringFunctions.GetMdMorale(), '<br>> - **Speed** ', StringFunctions.GetSpeed(), "<br>>___<br>>|STR|DEX|CON|INT|WIS|CHA|<br>>|:---:|:---:|:---:|:---:|:---:|:---:|<br>>|",
        mon.strPoints, " (", StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon.strPoints)), ")|",
        mon.dexPoints, " (", StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon.dexPoints)), ")|",
        mon.conPoints, " (", StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon.conPoints)), ")|",
        mon.intPoints, " (", StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon.intPoints)), ")|",
        mon.wisPoints, " (", StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon.wisPoints)), ")|",
        mon.chaPoints, " (", StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon.chaPoints)), ")|<br>>___<br>");

    let propertiesDisplayArr = StringFunctions.GetPropertiesDisplayArr(mon);

    for (let index = 0; index < propertiesDisplayArr.length; index++) {
        markdown.push('> - **', propertiesDisplayArr[index].name, "** ",
            (Array.isArray(propertiesDisplayArr[index].arr) ? propertiesDisplayArr[index].arr.join(", ") : propertiesDisplayArr[index].arr),
            "<br>");
    }
    markdown.push(StringFunctions.GetMdCR(), "> - **Threat** ", StringFunctions.GetThreat(mon.threatval,true));

    if (mon.abilities.length > 0) markdown.push("<br>", GetTraitMarkdown(mon.abilities, false));
    if (mon.actions.length > 0) markdown.push("<br>> ### Actions<br>", GetTraitMarkdown(mon.actions, false));
    if (mon.bonuses.length > 0) markdown.push("<br>> ### Bonus Actions<br>", GetTraitMarkdown(mon.bonuses, false));
    if (mon.reactions.length > 0) markdown.push("<br>> ### Reactions<br>", GetTraitMarkdown(mon.reactions, false));
    if (mon.villains.length > 0) markdown.push("<br>> ### Villain Actions<br>", GetTraitMarkdown(mon.villains, false));
    if (mon.isLegendary) {
        markdown.push("<br>> ### Legendary Actions<br>> ", mon.legendariesDescription);
        if (mon.legendaries.length > 0) markdown.push("<br>><br>", GetTraitMarkdown(mon.legendaries, true));
    }

    markdown.push("</code></body></html>")

    markdownWindow.document.write(markdown.join(""));
    markdownWindow.document.close();
}

function GetTraitMarkdown(traitArr, legendary) {
    let markdown = [];
    for (let index = 0; index < traitArr.length; index++) {
        let desc = ReplaceTraitTags(traitArr[index].desc,mon)
            .replace(/(\r\n|\r|\n)\s*(\r\n|\r|\n)/g, '\n>\n')
            .replace(/(\r\n|\r|\n)>/g, '\&lt;br&gt;<br>>')
            .replace(/(\r\n|\r|\n)/g, '\&lt;br&gt;<br>> &amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;');
        markdown.push("> " +
            (legendary ? "**" : "***") +
            traitArr[index].name +
            (legendary ? ".** " : ".*** ") +
            desc);
    }
    return markdown.join("<br>><br>");
}

// Functions for form-setting
var FormFunctions = {
    // Set the forms
    SetForms: function() {
        // Name and type
        $("#name-input").val(mon.name);
        $("#size-input").val(mon.size);

        if (data.types.includes(mon.type))
            $("#type-input").val(mon.type);
        else {
            $("#type-input").val("*");
            $("#other-type-input").val(mon.type);
        }
        this.ShowHideTypeOther();

        // Tag and Alignment
        $("#tag-input").val(mon.tag);
        $("#alignment-input").val(mon.alignment);

        // Armor Class
        $("#otherarmor-input").val(mon.otherArmorDesc);
        $("#armor-input").val(mon.armorName);
	      $("#ac-updown").val(mon.acadj);
        $("#shield-input").prop("checked", (mon.shieldBonus > 0 ? true : false));

        // Hit Dice
        $("#hp-input").val(mon.hpName);
	      $("#hp-updown").val(mon.hpadj);
        $("#half-hp").prop("checked", (mon.hpCut < 1 ? true : false));
        $("#paragon-input").prop("checked",false);
        StringFunctions.LoadParagon();
        this.ShowHideParagon();

        // Morale
	      $("#mdc-input").val(mon.mdc);
        $("#mreact-input").val(mon.mtype);
        $("#mtrig-input").val(mon.mtrig);
        $("#mthresh-input").val(mon.mthresh);
        $("#morale-input").prop("checked",true);
        this.ShowHideMorale();

        // CR
        $("#cr-input").prop("checked",false);
        this.ShowHideCR();

	      // Threat
	      $("#threat-mod").val(mon.threatadj);

        // Speeds
        $("#speed-input").val(mon.speed);
        $("#burrow-speed-input").val(mon.burrowSpeed);
        $("#climb-speed-input").val(mon.climbSpeed);
        $("#fly-speed-input").val(mon.flySpeed);
        $("#hover-input").prop("checked", mon.hover);
        this.ShowHideHoverBox();
        $("#swim-speed-input").val(mon.swimSpeed);
        $("#custom-speed-prompt").val(mon.speedDesc);
        $("#custom-speed-input").prop("checked", mon.customSpeed);
        this.ShowHideCustomSpeed();

        // Stats
        this.SetStatForm("str", mon.strPoints);
        this.SetStatForm("dex", mon.dexPoints);
        this.SetStatForm("con", mon.conPoints);
        this.SetStatForm("int", mon.intPoints);
        this.SetStatForm("wis", mon.wisPoints);
        this.SetStatForm("cha", mon.chaPoints);

        // Senses
        $("#blindsight-input").val(mon.blindsight);
        $("#blindness-input").prop("checked", mon.blind);
        this.ShowHideBlindBox();
        $("#darkvision-input").val(mon.darkvision);
        $("#tremorsense-input").val(mon.tremorsense);
        $("#truesight-input").val(mon.truesight);

        // Properties
        this.MakeDisplayList("sthrows", true);
        this.MakeDisplayList("skills", true);
        this.MakeDisplayList("conditions", true);
        this.MakeDisplayList("damage", true);
        this.ShowHideDamageOther();
        this.MakeDisplayList("languages", false);
        this.ShowHideLanguageOther();
        $("#telepathy-input").val(mon.telepathy);

        // Abilities
        this.MakeDisplayList("abilities", false, true);
        this.MakeDisplayList("actions", false, true);
        if (!mon.bonuses) mon.bonuses = [];
        this.MakeDisplayList("bonuses", false, true);
        this.MakeDisplayList("reactions", false, true);
        if (!mon.villains) mon.villains = [];
        this.MakeDisplayList("villains", false, true);
        this.MakeDisplayList("legendaries", false, true);

        // Is Legendary?
        $("#is-legendary-input").prop("checked", mon.isLegendary);
        this.ShowHideLegendaryCreature();

        // Tier
        $("#tier-input").val(mon.tier);
        this.ChangeTierForm();

	      // Org
        $("#org-input").val(mon.org);
        this.ChangeDPRForm();

        // Attack Bonus
        $("#attack-input").val(mon.atkName);
        this.ChangeAtkBForm();

        // Save DC
        $("#savedc-input").val(mon.stName);
        this.ChangeSDCForm();

        // DPR
        $("#dpr-input").val(mon.dprName);
        this.ChangeDPRForm();

        // Column Radio Buttons
        this.ChangeColumnRadioButtons();
    },

    // Show/Hide form options to make it less overwhelming - only call these from SetForms or HTML elements
    ShowHideHtmlElement: function(element, show) {
        show ? $(element).show() : $(element).hide();
    },

    ShowHideTypeOther: function() {
        this.ShowHideHtmlElement("#other-type-input", $("#type-input").val() == "*");
    },

    ShowHideMorale: function() {
        $("#mdc-form, #mreact-form, #mtrig-form, #mthresh-input-prompt, #m-block").hide();
        if ($("#morale-input").prop('checked'))
            $("#mdc-form, #mreact-form, #mtrig-form, #mthresh-input-prompt, #m-block").show();
    },

    ShowHideCR: function() {
        $("#cr-block").hide();
        if ($("#cr-input").prop('checked'))
            $("#cr-block").show();
    },

    ShowHideParagon: function() {
        $("#hp-block, #paragon-tag, #hpnum-form").hide();
        for (let i = 1; i <= 6; i++) {
          $('#pstat-' + i).hide();
        }
        if ($("#paragon-input").prop('checked')) {
          $("#hp-block, #paragon-tag, #hpnum-form").show();
          for (let i = 1; i <= $("#hpnum-input").val(); i++) {
            $('#pstat-' + i).show();
          }
        }
    },

    ShowHideCustomSpeed: function() {
        $(".normal-speed-col, .custom-speed-col").hide();
        if ($("#custom-speed-input").prop('checked'))
            $(".custom-speed-col").show();
        else
            $(".normal-speed-col").show();
    },

    ShowHideDamageOther: function() {
        this.ShowHideHtmlElement("#other-damage-input", $("#damagetypes-input").val() == "*");
    },

    ShowHideLanguageOther: function() {
        this.ShowHideHtmlElement("#other-language-input", $("#languages-input").val() == "*");
    },

    ShowHideHoverBox: function() {
        this.ShowHideHtmlElement("#hover-box-note", $("#fly-speed-input").val() > 0);
    },

    ShowHideBlindBox: function() {
        this.ShowHideHtmlElement("#blind-box-note", $("#blindsight-input").val() > 0);
    },

    ShowHideSeparatorInput: function() {
        this.ShowHideHtmlElement("#left-separator-button", mon.doubleColumns);
        this.ShowHideHtmlElement("#right-separator-button", mon.doubleColumns);
    },

    ShowHideLegendaryCreature: function() {
        $("#is-legendary-input:checked").val() ?
            $("#add-legendary-button, #legendary-actions-form").show() :
            $("#add-legendary-button, #legendary-actions-form").hide();
    },

    ShowHideFormatHelper: function() {
        this.ShowHideHtmlElement("#format-helper", $("#format-helper-checkbox:checked").val())
    },

    // Set the ability bonus given ability scores
    ChangeBonus: function(stat) {
        $("#" + stat + "bonus").html(StringFunctions.BonusFormat(MathFunctions.PointsToBonus($("#" + stat + "-input").val())));
    },

    // Set the proficiency bonus based on the monster's Tier
    ChangeTierForm: function() {
        $("#prof-bonus").html("Proficiency Bonus: +" + data.tiers[mon.tier].prof);
    },

    // Set the attack bonus based on the monster's Tier
    ChangeAtkBForm: function() {
        $("#atk-bonus").html("Attack Bonus: +" + StringFunctions.GetAttackBonus(mon));
    },

    // Set the save dc based on the monster's Tier
    ChangeSDCForm: function() {
        $("#save-dc").html("Ability Save DC: " + StringFunctions.GetSaveDC(mon));
    },

    // Set the averageDPR based on the monster's Tier and organization
    ChangeDPRForm: function() {
        $("#avg-dpr").html("Average DPR: " + StringFunctions.GetDPR(mon));
    },

    // For setting the column radio buttons based on saved data
    ChangeColumnRadioButtons: function() {
        $("#1col-input").prop("checked", !mon.doubleColumns);
        $("#2col-input").prop("checked", mon.doubleColumns);
    },

    // For setting the legendary action description
    SetLegendaryDescriptionForm: function() {
        $("#legendaries-descsection-input").val(mon.legendariesDescription);
    },

    SetCommonAbilitiesDropdown: function() {
        $("#common-ability-input").html("");
        for (let index = 0; index < data.commonAbilities.length; index++)
            $("#common-ability-input").append("<option value='" + index + "'>" + data.commonAbilities[index].name + "</option>");
    },

    // Set ability scores and bonuses
    SetStatForm: function(statName, statPoints) {
        $("#" + statName + "-input").val(statPoints);
        $("#" + statName + "bonus").html(StringFunctions.BonusFormat(MathFunctions.PointsToBonus(statPoints)));
    },

    // Make a list of removable items and add it to the editor
    MakeDisplayList: function(arrName, capitalize, isBlock = false) {
        let arr = (arrName == "damage" ? mon.damagetypes.concat(mon.specialdamage) : mon[arrName]),
            displayArr = [],
            content = "",
            arrElement = "#" + arrName + "-input-list";
        for (let index = 0; index < arr.length; index++) {
            let element = arr[index],
                elementName = capitalize ? StringFunctions.StringCapitalize(element.name) : element.name,
                note = element.hasOwnProperty("note") ? element.note : "";

            content = "<b>" + StringFunctions.FormatString(elementName + note, false) + (element.hasOwnProperty("desc") ?
                ":</b> " + StringFunctions.FormatString(element.desc, isBlock) : "</b>");

            let functionArgs = arrName + "\", " + index + ", " + capitalize + ", " + isBlock,
                imageHTML = "<img class='statblock-image' src='dndimages/x-icon.png' alt='Remove' title='Remove' onclick='FormFunctions.RemoveDisplayListItem(\"" + functionArgs + ")'>";
            if (isBlock)
                imageHTML += " <img class='statblock-image' src='dndimages/edit-icon.png' alt='Edit' title='Edit' onclick='FormFunctions.EditDisplayListItem(\"" + functionArgs + ")'>" +
                " <img class='statblock-image' src='dndimages/up-icon.png' alt='Up' title='Up' onclick='FormFunctions.SwapDisplayListItem(\"" + arrName + "\", " + index + ", -1)'>" +
                " <img class='statblock-image' src='dndimages/down-icon.png' alt='Down' title='Down' onclick='FormFunctions.SwapDisplayListItem(\"" + arrName + "\", " + index + ", 1)'>";
            displayArr.push("<li> " + imageHTML + " " + content + "</li>");
        }
        $(arrElement).html(displayArr.join(""));

        $(arrElement).parent()[arr.length == 0 ? "hide" : "show"]();
    },

    // Remove an item from a display list and update it
    RemoveDisplayListItem: function(arrName, index, capitalize, isBlock) {
        let arr;
        if (arrName == "damage") {
            if (mon.damagetypes.length - index > 0)
                arr = mon.damagetypes;
            else {
                index -= mon.damagetypes.length;
                arr = mon.specialdamage;
            }
        } else
            arr = mon[arrName];
        arr.splice(index, 1);
        this.MakeDisplayList(arrName, capitalize, isBlock);
    },

    // Bring an item into the abilities textbox for editing
    EditDisplayListItem: function(arrName, index, capitalize) {
        let item = mon[arrName][index];
        $("#abilities-name-input").val(item.name);
        $("#abilities-desc-input").val(item.desc);
    },

    // Change position
    SwapDisplayListItem: function(arrName, index, swap) {
        arr = mon[arrName];
        if (index + swap < 0 || index + swap >= arr.length) return;
        let temp = arr[index + swap];
        arr[index + swap] = arr[index];
        arr[index] = temp;
        this.MakeDisplayList(arrName, false, true);
    },

    MakeMonsterList: function() {
        let displayArr = [],
            dropdownBuffer = [],
            content = "",
            content2 = "",
            arrElement = "#mon2-input-list";

        let fullFilter = $("#monster-filter").val();
        fullFilter = fullFilter.replace(/\s\,\s|\s\,|\,\s|\,/g, "|");
        fullFilter = fullFilter.replace(/\s\;\s|\s\;|\;\s|\;/g, "))(?=.*(");
        fullFilter = "(?=.*(" + fullFilter + "))";
        let filterRegex = (fullFilter === "(?=.*())" ? new RegExp('.', 'gi') : new RegExp(fullFilter, 'gi'));

        for (let index = 0; index < mon2.length; index++) {
            let element = mon2[index],
                elementName = StringFunctions.StringCapitalize(element.name),
                content_name = "<td colspan='3' nowrap><b>" + StringFunctions.FormatString(elementName, false) + "</b></td>",
                content_tier = "<td style='text-align: center'>" + element.tier + "</td>",
                content_org = "<td style='text-align: center'>" + element.org + "</td>",
                content_size = "<td style='text-align: center'>" + element.size + "</td>",
                content_type = "<td style='text-align: center'>" + element.type + "</td>",
                content_tags = "<td colspan='4'><i>" + element.tag + "</i></td>",
                content2 = StringFunctions.FormatString(elementName, false) + " (" + element.org + " organization)";
            let functionArgs = index,
                imageHTML = "<td style='text-align: center' nowrap><img class='statblock-image' src='dndimages/x-icon.png' alt='Remove' title='Remove from Bestiary' onclick='FormFunctions.RemoveMonsterListItem(" + functionArgs + ")'>";
                imageHTML += " <img class='statblock-image' src='dndimages/edit-icon.png' alt='Edit' title='Edit Monster' onclick='FormFunctions.EditMonsterListItem(" + functionArgs + ")'>";
                imageHTML += " <img class='statblock-image' src='dndimages/plus-icon.png' alt='Add' title='Add to Encounter' onclick='LoadEncounterAdd.retrieveFromWindow(mon2[" + functionArgs + "]);getEncounterInfo();'></td>";

                let fullDisplayString = content_name + content_tier + content_org + content_size + content_type + content_tags;

                if (filterRegex.test(fullDisplayString)) {
                  displayArr.push("<tr> " + imageHTML + fullDisplayString + "</tr>");
                  if (element.tier === $("#tier-level").val())  dropdownBuffer.push("<option value=", index, ">", content2, "</option>");
                }

        }
        $(arrElement).html(displayArr.join(""));

        $("#monster-options").html(dropdownBuffer.join(""));

        $(arrElement).parent()[mon2.length == 0 ? "hide" : "show"]();
        localStorage.setItem("Mon2", JSON.stringify(mon2));
    },

    RemoveMonsterListItem: function(index) {
        mon2.splice(index, 1);
        this.MakeMonsterList();
        localStorage.setItem("Mon2", JSON.stringify(mon2));
    },

    EditMonsterListItem: function(index) {
      let mon_rep = JSON.parse(JSON.stringify(mon2[index]));
      mon = mon_rep;
      Populate();
      openTab(null, 'monster');
    },

    MakeEncounterList: function() {
        encDat.type = $("#enc-type").val();
        encDat.numPCs = $("#party-size").val();
        encDat.pcTier = $("#tier-level").val();

        let displayArr = [],
            display_icons = [],
            threatsum = 0,
            positsum = 0,
            content = "";
        for (let index = 0; index < mon3.length; index++) {
            let element = mon3[index],
                elementName = StringFunctions.StringCapitalize(element.name),
            content = StringFunctions.FormatString(elementName, false) + "</b> (" + StringFunctions.StringCapitalize(element.tier) + " Tier, " + StringFunctions.StringCapitalize(element.org) + ") <i>Threat: " + StringFunctions.StringCapitalize(StringFunctions.GetThreat(element.threatval,false)) + "</i>";
            threatsum += (5 + element.threatval) * data.organizations[element.org].nums * data.tiers[element.tier].trow / data.tiers[encDat.pcTier].trow;
            positsum += data.organizations[element.org].nums;
            displayArr.push(content + "</li>");
        }

        let mon_tmp = displayArr.filter( encSort );
        monico = [];
        mon4 = [];
        let mon_ct = 0;
        for (let index = 0; index < mon_tmp.length; index++) {
          monico.push(displayArr.indexOf(mon_tmp[index]));
          mon_ct = 0;
          for (let newdx = 0; newdx < displayArr.length; newdx++) {
            if (mon_tmp[index] === displayArr[newdx]) mon_ct += 1;
          }
          let oldIndex = displayArr.lastIndexOf(mon_tmp[index]);
          let imageHTML = "<img class='statblock-image' src='dndimages/x-icon.png' alt='Remove' title='Remove' onclick='FormFunctions.RemoveEncounterListItem(" + oldIndex + ")'>" +
                " <img class='statblock-image' src='dndimages/up-icon.png' alt='Up' title='Up' onclick='FormFunctions.SwapEncounterListItem(" + index + ", -1)'>" +
                " <img class='statblock-image' src='dndimages/down-icon.png' alt='Down' title='Down' onclick='FormFunctions.SwapEncounterListItem(" + index + ", 1)'>" +
                " <img class='statblock-image' src='dndimages/plus-icon.png' alt='Add' title='Add to Encounter' onclick='LoadEncounterAdd.retrieveFromWindow(mon3[" + oldIndex + "]);getEncounterInfo();'></td>";
          mon4.push("<li> <b>" + mon_ct + "x " + mon_tmp[index]);
          display_icons.push("<li> " + imageHTML + "</li>");
        }

        $("#mon3-input-list").html(mon4.join(""));
        $("#mon3-input-list-icons").html(display_icons.join(""));

        $("#xp-amt").html(this.GetEncXP(mon3));

	      let overall_threat = (threatsum / encDat.numPCs) - 5;
        $("#mon3-enc-threat").html("Overall Encounter Threat: " + StringFunctions.StringCapitalize(StringFunctions.GetThreat(overall_threat,false)));

        $("#force-size").html(Math.ceil(positsum) + "-position force vs. " + encDat.numPCs + " " + encDat.pcTier + "-tier PCs");

        $("#mon3-input-list").parent()[mon3.length == 0 ? "hide" : "show"]();
        $("#mon3-input-list-icons").parent()[mon3.length == 0 ? "hide" : "show"]();

        let zone_target = Math.min(80,encDat.type * (encDat.numPCs/4));
        let positrange = Math.min(positsum/10,1) * 100;
        document.getElementById("slot-bar").style.width = positrange + "%";
        document.getElementById("slot-bar").style.marginRight = (100 - positrange) + "%";
        document.getElementById("slot-target").style.marginRight = (80 - zone_target) + "%";
        document.getElementById("slot-target").style.marginLeft = zone_target + "%";

        let abb_nameline = "",
          abb_hitline = "",
          abb_statline = "",
          abb_atks = "",
          abb_profa = "",
          abb_profb = "",
          abb_prof = "",
          abb_sense = "",
          abb_vul = "",
          abb_resist = "",
          abb_immune = "",
          abb_immunea = "",
          abb_immuneb = "",
          abb_absorb = "",
          abb_arr = [];
        for (let index = 0; index < monico.length; index++) {
          let element = mon3[monico[index]];
          abb_nameline = "<h3>" + StringFunctions.StringCapitalize(element.name) + "</h3> (" + element.size + " " + element.type + ")";
          abb_hitline = "<b>AC </b>" + StringFunctions.GetArmorData(element,false) + " <b>HP </b>" + element.avgHP + " <b>SPD </b>" + element.speedDesc;
          abb_statline = "<b>STR </b>" + StringFunctions.BonusFormat(MathFunctions.PointsToBonus(element.strPoints)) + " <b>DEX </b>" + StringFunctions.BonusFormat(MathFunctions.PointsToBonus(element.dexPoints)) +  " <b>CON </b>" + StringFunctions.BonusFormat(MathFunctions.PointsToBonus(element.conPoints)) +  " <b>INT </b>" + StringFunctions.BonusFormat(MathFunctions.PointsToBonus(element.intPoints)) +  " <b>WIS </b>" + StringFunctions.BonusFormat(MathFunctions.PointsToBonus(element.wisPoints)) +  " <b>CHA </b>" +  StringFunctions.BonusFormat(MathFunctions.PointsToBonus(element.chaPoints));
          abb_atks = this.GetAtkExp(element);

          let elementProps = StringFunctions.GetPropertiesDisplayArr(element);

          abb_profa = getFindVal(elementProps,"name","Saving Throws") ? getFindVal(elementProps,"name","Saving Throws").arr.join(" ") : "";
          abb_profa = abb_profa ? abb_profa.replace(/\+/gi, "ST +") : "";
          abb_profb = getFindVal(elementProps,"name","Skills") ? getFindVal(elementProps,"name","Skills").arr.join(" ") : "";
          abb_prof = ((abb_profa || abb_profb) ? "<br>" : "") + abb_profa + ((abb_profa && abb_profb) ? " " : "") + abb_profb;

          abb_sense = getFindVal(elementProps,"name","Senses") ? getFindVal(elementProps,"name","Senses").arr : "";
          abb_sense = abb_sense ? abb_sense.replace(/ this radius|(, p|p)assive perception +[0-9].*/gi, "") : "";
          abb_sense = abb_sense ? "<br>" + abb_sense : "";

          abb_vul = getFindVal(elementProps,"name","Damage Vulnerabilities") ? "<br><b>Vulnerable:</b> " + getFindVal(elementProps,"name","Damage Vulnerabilities").arr : "";
          abb_resist = getFindVal(elementProps,"name","Damage Resistances") ? "<br><b>Resist:</b> " + getFindVal(elementProps,"name","Damage Resistances").arr : "";

          abb_immunea = getFindVal(elementProps,"name","Damage Immunities") ? getFindVal(elementProps,"name","Damage Immunities").arr : "";
          abb_immuneb = getFindVal(elementProps,"name","Condition Immunities") ? getFindVal(elementProps,"name","Condition Immunities").arr.join(", ") : "";
          abb_immune = ((abb_immunea || abb_immuneb) ? "<br><b>Immune:</b> " : "") + abb_immunea + ((abb_immunea && abb_immuneb) ? ", " : "") + abb_immuneb;

          abb_absorb = getFindVal(elementProps,"name","Damage Absorption") ? "<br><b>Absorb:</b> " + getFindVal(elementProps,"name","Damage Absorption").arr : "";

          let upperLine = "<br><li> " + abb_nameline + "<br>" +  abb_hitline + "<br>" +  abb_statline;
          let atkLine = $("#beta-input").prop("checked") ? "<span style='color:black;'>" + abb_atks + "</span>" : "";

          let midline = abb_prof + abb_sense + abb_vul + abb_resist + abb_immune + abb_absorb;

          abb_arr.push(upperLine,  midline, atkLine, "</li>");
        }

        $("#abbrev-input-list").html(abb_arr.join(""));

    },

    RemoveEncounterListItem: function(index) {
        mon3.splice(index, 1);
        this.MakeEncounterList();
        localStorage.setItem("Mon3", JSON.stringify(mon3));
    },

    SwapEncounterListItem: function(index, swap) {
        if (index + swap < 0 || index + swap >= monico.length) return;
        let indx = monico[index];
        let indx2 = monico[index+swap];
        let temp = mon3[indx2];
        mon3[indx2] = mon3[indx];
        mon3[indx] = temp;
        this.MakeEncounterList();
        localStorage.setItem("Mon3", JSON.stringify(mon3));
    },

    UpdateEncName: function() {
      this.GetEncVars();
      this.SetEncVars();
    },

    GetEncVars: function() {
      encDat.battle = $("#enc-name-input").val();
      encDat.conflict = $("#enc-conflict-input").val();
      encDat.terrain = $("#enc-terrain-input").val();
      encDat.tactics = $("#enc-tactics-input").val();
      encDat.exp = $("#xp-in").val();
    },

    SetEncVars: function() {
      $("#enc-name").html(encDat.battle);
      $("#enc-conflict").html(encDat.conflict);
      $("#enc-terrain").html(encDat.terrain);
      $("#enc-tactics").html(encDat.tactics);
      $("#enc-name-input").val(encDat.battle);
      $("#enc-conflict-input").val(encDat.conflict);
      $("#enc-terrain-input").val(encDat.terrain);
      $("#enc-tactics-input").val(encDat.tactics);
      $("#enc-type").val(encDat.type);
      $("#party-size").val(encDat.numPCs);
      $("#tier-level").val(encDat.pcTier);
      if (!encDat.exp) encDat.exp = 0;
      $("#xp-in").val(encDat.exp);
    },

    GetEncXP: function(monArr) {
      encDat.exp = $("#xp-in").val() * 1;
      if (encDat.exp != 0) {
        return encDat.exp + " total awarded XP";
      } else {
        for (let index = 0; index < monArr.length; index++) {
          let act = monArr[index];
          let xp_incr = data.xpforcr[StringFunctions.GetCRdx(act)];
          encDat.exp += xp_incr;
        }
        return encDat.exp + " total awarded XP";
      }
    },

    GetAtkExp: function(monArr) {
      let atkArr = [],
        atkRes = "";
      /* for (let index = 0; index < monArr.abilities.length; index++) {
        let act = monArr.abilities[index];
        let revName = act.desc;
        atkRes = "<b>" + act.name + ":</b> ";
        atkArr.push("<br>" + atkRes);
      } */
      for (let index = 0; index < monArr.actions.length; index++) {
        let act = monArr.actions[index];
        let revName = act.desc;
        revName = revName.replace(/_|damage| to hit| one (target|creature).|(reach|range) |\[MON\]| reach 5 ft.,/gi, "");
        revName = revName.replace(/ Hit:|The /gi, "");
        revName = revName.replace(/melee/gi, "M");
        revName = revName.replace(/ranged/gi, "R");
        revName = revName.replace(/weapon/gi, "W");
        revName = revName.replace(/attack/gi, "ATK");
        revName = revName.replace(/escape/gi, "esc");
        revName = revName.replace(/medium /gi, "med ");
        revName = revName.replace(/large /gi, "lg ");
        revName = revName.replace(/small /gi, "sm ");
        revName = revName.replace(/\]/gi, "]</b>");
        revName = revName.replace(/\[/gi, "<b>[");
        revName = revName.replace(/ \./g, ".");
        revName = revName.replace(/ \,/g, ",");
        atkRes = "<b>" + act.name + ":</b> " + ReplaceTraitTags(revName,monArr);
        if (revName.length < 144) atkArr.push("<br>" + atkRes);
      }
      /* for (let index = 0; index < monArr.reactions.length; index++) {
        let act = monArr.reactions[index];
        let revName = act.desc;
        atkRes = "<b>" + act.name + " (React):</b> ";
        atkArr.push("<br>" + atkRes);
      } */
      return atkArr.join("");
    }
}

function getFindVal(Arr,Prop,Val) {
  return Arr[Arr.findIndex(function(Arr2) {
    return Arr2[Prop] === Val;
  })]
}

// Input functions to be called only through HTML
var InputFunctions = {
    // Get all variables from a preset
    GetPreset: function() {
        let name = $("#monster-select").val(),
            creature;
        if (name == "") return;
        if (name == "default") {
            GetVariablesFunctions.SetPreset(data.defaultPreset);
            FormFunctions.SetForms();
            UpdateStatblock();
            return;
        }
        $.getJSON("https://api.open5e.com/monsters/" + name, function(jsonArr) {
                GetVariablesFunctions.SetPreset(jsonArr);
                FormFunctions.SetForms();
                UpdateStatblock();
            })
            .fail(function() {
                console.error("Failed to load preset.");
                return;
            })
    },

    // Adding items to lists

    AddSthrowInput: function() {
        // Insert, complying with standard stat order
        GetVariablesFunctions.AddSthrow($("#sthrows-input").val());

        // Display
        FormFunctions.MakeDisplayList("sthrows", true);
    },

    AddSkillInput: function(note) {
        // Insert Alphabetically
        GetVariablesFunctions.AddSkill($("#skills-input").val(), note);

        // Display
        FormFunctions.MakeDisplayList("skills", true);
    },

    AddDamageTypeInput: function(type) {
        // Insert normal damage alphabetically, then special damage alphabetically
        GetVariablesFunctions.AddDamageType($("#damagetypes-input").val(), type);

        // Display
        FormFunctions.MakeDisplayList("damage", true);
    },

    AddConditionInput: function() {
        // Insert alphabetically
        GetVariablesFunctions.AddCondition($("#conditions-input").val());

        // Display
        FormFunctions.MakeDisplayList("conditions", true);
    },

    AddLanguageInput: function() {
        // Insert alphabetically
        GetVariablesFunctions.AddLanguage($("#languages-input").val());

        // Display
        FormFunctions.MakeDisplayList("languages", false);
    },

    // Change Tier based on input dropdown
    InputTier: function() {
        mon.tier = $("#tier-input").val();
        FormFunctions.ChangeTierForm();
        FormFunctions.ChangeAtkBForm();
        FormFunctions.ChangeSDCForm();
        FormFunctions.ChangeDPRForm();
    },

    // Change Org based on input dropdown
    InputOrg: function() {
        mon.org = $("#org-input").val();
        FormFunctions.ChangeDPRForm();
    },

    InputAtk: function() {
        mon.atkName = $("#attack-input").val();
        FormFunctions.ChangeAtkBForm();
    },

    InputSDC: function() {
        mon.stName = $("#savedc-input").val();
        FormFunctions.ChangeSDCForm();
    },

    InputDPR: function() {
        mon.dprName = $("#dpr-input").val();
        FormFunctions.ChangeDPRForm();
    },

    InputArchetype: function(arch_sel) {
      if (arch_sel === "paragon") {
        mon.atkName = "good";
        mon.dprName = "good";
        mon.armorName = "good";
        mon.hpName = "good";
      }
      if (arch_sel === "tank") {
        mon.atkName = "poor";
        mon.dprName = "poor";
        mon.armorName = "good";
        mon.hpName = "good";
      }
      if (arch_sel === "bulwark") {
        mon.atkName = "good";
        mon.dprName = "poor";
        mon.armorName = "good";
        mon.hpName = "poor";
      }
      if (arch_sel === "enforcer") {
        mon.atkName = "good";
        mon.dprName = "good";
        mon.armorName = "average";
        mon.hpName = "average";
      }
      if (arch_sel === "striker") {
        mon.atkName = "good";
        mon.dprName = "poor";
        mon.armorName = "average";
        mon.hpName = "average";
      }
      if (arch_sel === "baseline") {
        mon.atkName = "average";
        mon.dprName = "average";
        mon.armorName = "average";
        mon.hpName = "average";
      }
      if (arch_sel === "ward") {
        mon.atkName = "average";
        mon.dprName = "average";
        mon.armorName = "good";
        mon.hpName = "poor";
      }
      if (arch_sel === "meat") {
        mon.atkName = "average";
        mon.dprName = "average";
        mon.armorName = "poor";
        mon.hpName = "good";
      }
      if (arch_sel === "brute") {
        mon.atkName = "poor";
        mon.dprName = "good";
        mon.armorName = "poor";
        mon.hpName = "good";
      }
      if (arch_sel === "sniper") {
        mon.atkName = "good";
        mon.dprName = "good";
        mon.armorName = "poor";
        mon.hpName = "poor";
      }
      if (arch_sel === "fodder") {
        mon.atkName = "poor";
        mon.dprName = "poor";
        mon.armorName = "poor";
        mon.hpName = "poor";
      }

        mon.stName = mon.atkName;
        FormFunctions.ChangeAtkBForm();
        FormFunctions.ChangeSDCForm();
        FormFunctions.ChangeDPRForm();
        $("#armor-input").val(mon.armorName);
        $("#hp-input").val(mon.hpName);
        $("#attack-input").val(mon.atkName);
        $("#savedc-input").val(mon.stName);
        $("#dpr-input").val(mon.dprName);
    },

    AddAbilityInput: function(arrName) {
        let abilityName = $("#abilities-name-input").val().trim(),
            abilityDesc = $("#abilities-desc-input").val().trim();

        if (abilityName.length == 0 || abilityDesc.length == 0)
            return;

        // Insert at end, or replace ability if it exists already
        GetVariablesFunctions.AddAbility(arrName, abilityName, abilityDesc, true);

        // Display
        FormFunctions.MakeDisplayList(arrName, false, true);

        // Clear forms
        $("#abilities-name-input").val("");
        $("#abilities-desc-input").val("");
    },

    // Reset legendary description to default
    LegendaryDescriptionDefaultInput: function() {
        GetVariablesFunctions.LegendaryDescriptionDefault();
        FormFunctions.SetLegendaryDescriptionForm();
    },

    AddCommonAbilityInput: function() {
        let commonAbility = data.commonAbilities[$("#common-ability-input").val()];
        if (commonAbility.desc) {
            $("#abilities-name-input").val(commonAbility.hasOwnProperty("realname") ? commonAbility.realname : commonAbility.name);
            $("#abilities-desc-input").val(commonAbility.desc);
            //$("#abilities-desc-input").val(StringFunctions.StringReplaceAll(commonAbility.desc, "[MON]", mon.name.toLowerCase()));
        }
    }
}

// Functions to get/set important variables
var GetVariablesFunctions = {
    // Get all Variables from forms
    GetAllVariables: function() {
        // Name and Type
        mon.name = $("#name-input").val().trim();
        mon.size = $("#size-input").val().toLowerCase();
        mon.type = $("#type-input").val();
        if (mon.type == "*")
            mon.type = $("#other-type-input").val();
        mon.tag = $("#tag-input").val().trim();
        mon.alignment = $("#alignment-input").val().trim();

        // Armor Class
        mon.armorName = $("#armor-input").val();
	      mon.acadj = $("#ac-updown").val() * 1;
        mon.otherArmorDesc = $("#otherarmor-input").val();
        mon.shieldBonus = $("#shield-input").prop("checked") ? 2 : 0;

        // Save DC
        mon.stName = $("#savedc-input").val();

        // Attack Bonus
        mon.atkName = $("#attack-input").val();

        // Hit Points
        mon.hpName = $("#hp-input").val();
	      mon.hpadj = $("#hp-updown").val() * 1;
        mon.hpCut = $("#half-hp").prop("checked") ? .5 : 1;
        StringFunctions.GetParagon();

        // Damage
        mon.dprName = $("#dpr-input").val();

        // Speeds
        mon.speed = $("#speed-input").val();
        mon.burrowSpeed = $("#burrow-speed-input").val();
        mon.climbSpeed = $("#climb-speed-input").val();
        mon.flySpeed = $("#fly-speed-input").val();
        mon.hover = $("#hover-input").prop("checked");
        mon.swimSpeed = $("#swim-speed-input").val();
        mon.speedDesc = $("#custom-speed-prompt").val();
        mon.customSpeed = $("#custom-speed-input").prop("checked");

        // Stats
        mon.strPoints = $("#str-input").val();
        mon.dexPoints = $("#dex-input").val();
        mon.conPoints = $("#con-input").val();
        mon.intPoints = $("#int-input").val();
        mon.wisPoints = $("#wis-input").val();
        mon.chaPoints = $("#cha-input").val();

        // Senses
        mon.blindsight = $("#blindsight-input").val();
        mon.blind = $("#blindness-input").prop("checked");
        mon.darkvision = $("#darkvision-input").val();
        mon.tremorsense = $("#tremorsense-input").val();
        mon.truesight = $("#truesight-input").val();

        // Telepathy
        mon.telepathy = parseInt($("#telepathy-input").val());

        // Tier
        mon.tier = $("#tier-input").val();

        // Organization
        mon.org = $("#org-input").val();

        // Morale
        mon.mdc = $("#mdc-input").val();
        mon.mtype = $("#mreact-input").val();
        mon.mtrig = $("#mtrig-input").val();
        mon.mthresh = $("#mthresh-input").val() * 1;

        // Threat
        mon.threatadj = $("#threat-mod").val() * 1;
        mon.threatval = calcThreat();

        // Legendaries
        mon.isLegendary = $("#is-legendary-input").prop("checked");
        if (mon.isLegendary)
            mon.legendariesDescription = $("#legendaries-descsection-input").val().trim();

        // One or two columns ?
        mon.doubleColumns = $("#2col-input").prop("checked");
    },

    // Get all variables from preset
    SetPreset: function(preset) {
        // Name and type
        mon.name = preset.name.trim();
        mon.size = preset.size.trim().toLowerCase();
        mon.type = preset.type.trim();
        mon.tag = preset.subtype.trim();
        mon.alignment = preset.alignment.trim();

        // Stats
        mon.strPoints = preset.strength;
        mon.dexPoints = preset.dexterity;
        mon.conPoints = preset.constitution;
        mon.intPoints = preset.intelligence;
        mon.wisPoints = preset.wisdom;
        mon.chaPoints = preset.charisma;

        // Tier
        mon.tier = "apprentice";

        // Organization
        mon.org = "group";

	      // Morale
	      mon.mtrig = "staggered";
        mon.mthresh = 0.5;
        mon.mtype = "retreat";
        mon.mdc = 12;

        // Armor Class
        mon.armorName = "average";
	      mon.acadj = 0;
        mon.shieldBonus = 0;
        let armorDescData = preset.armor_desc ? preset.armor_desc.split(",") : null;
        if (armorDescData) {
            mon.otherArmorDesc = armorDescData[0];
            // If we have a shield and nothing else
            if (armorDescData.length == 1 && armorDescData[0].trim() == "shield") {
                mon.shieldBonus = 2;
                mon.otherArmorDesc = null;
            } else {
                // If we have a shield in addition to something else
                if (armorDescData.length > 1) {
                    if (armorDescData[1].trim() == "shield") {
                        mon.shieldBonus = 2;
                        mon.otherArmorDesc = armorDescData[0];
                    }
                }
              }
            }

        // Save DC
        mon.stName = "average";

        // Attack Bonus
        mon.atkName = "average";

	      // Threat
	      mon.threatadj = 0;

        // Hit Dice
        mon.hpName = "average";
	      mon.hpadj = 0;
	      mon.hpCut = 1;
        mon.paragon = ["3","Head",0,"Torso",0,"L Arm",0,"R Arm",0,"L Leg",0,"R Leg",0];

        // Damage
        mon.dprName = "average";

        // Speeds
        let GetSpeed = (speedList, speedType) => speedList.hasOwnProperty(speedType) ? parseInt(speedList[speedType]) : 0;

        mon.speed = GetSpeed(preset.speed, "walk");
        mon.burrowSpeed = GetSpeed(preset.speed, "burrow");
        mon.climbSpeed = GetSpeed(preset.speed, "climb");
        mon.flySpeed = GetSpeed(preset.speed, "fly");
        mon.swimSpeed = GetSpeed(preset.speed, "swim");
        mon.hover = preset.speed.hasOwnProperty("hover");

        if (preset.speed.hasOwnProperty("notes")) {
            mon.customSpeed = true;
            mon.speedDesc = preset.speed.walk + " ft. (" + preset.speed.notes + ")";
        } else {
            mon.customSpeed = false;
            mon.speedDesc = StringFunctions.GetSpeed();
        }

        // Saving Throws
        mon.sthrows = [];
        if (preset.strength_save)
            this.AddSthrow("str");
        if (preset.dexterity_save)
            this.AddSthrow("dex");
        if (preset.constitution_save)
            this.AddSthrow("con");
        if (preset.intelligence_save)
            this.AddSthrow("int");
        if (preset.wisdom_save)
            this.AddSthrow("wis");
        if (preset.charisma_save)
            this.AddSthrow("cha");

        // Skills
        mon.skills = [];
        if (preset.skills) {
            for (let index = 0; index < data.allSkills.length; index++) {
                let currentSkill = data.allSkills[index],
                    skillCheck = StringFunctions.StringReplaceAll(currentSkill.name.toLowerCase(), " ", "_");
                if (preset.skills[skillCheck]) {
                    let expectedExpertise = MathFunctions.PointsToBonus(mon[currentSkill.stat + "Points"]) + Math.ceil(data.tiers[mon.tier].prof * 1.5),
                        skillVal = preset.skills[skillCheck];
                    this.AddSkill(data.allSkills[index].name, (skillVal >= expectedExpertise ? " (ex)" : null));
                }
            }
        }

        // Conditions
        mon.conditions = [];
        let conditionsPresetArr = ArrayFunctions.FixPresetArray(preset.condition_immunities);
        for (let index = 0; index < conditionsPresetArr.length; index++)
            this.AddCondition(conditionsPresetArr[index]);

        // Damage Types
        mon.damagetypes = [];
        mon.specialdamage = [];
        this.AddPresetDamage(preset.damage_vulnerabilities, "v");
        this.AddPresetDamage(preset.damage_resistances, "r");
        this.AddPresetDamage(preset.damage_immunities, "i");

        // Languages
        mon.languages = [];
        mon.telepathy = 0;
        let languagesPresetArr = preset.languages.split(",");
        for (let index = 0; index < languagesPresetArr.length; index++) {
            let languageName = languagesPresetArr[index].trim();
            languageName.toLowerCase().includes("telepathy") ?
                mon.telepathy = parseInt(languageName.replace(/\D/g, '')) :
                this.AddLanguage(languageName);
        }

        // Senses
        mon.blindsight = 0;
        mon.blind = false;
        mon.darkvision = 0;
        mon.tremorsense = 0;
        mon.truesight = 0;
        let sensesPresetArr = preset.senses.split(",");
        for (let index = 0; index < sensesPresetArr.length; index++) {
            let senseString = sensesPresetArr[index].trim().toLowerCase(),
                senseName = senseString.split(" ")[0],
                senseDist = StringFunctions.GetNumbersOnly(senseString);
            switch (senseName) {
                case "blindsight":
                    mon.blindsight = senseDist;
                    mon.blind = senseString.toLowerCase().includes("blind beyond");
                    break;
                case "darkvision":
                    mon.darkvision = senseDist;
                    break;
                case "tremorsense":
                    mon.tremorsense = senseDist;
                    break;
                case "truesight":
                    mon.truesight = senseDist;
                    break;
            }
        }

        // Legendary?
        mon.isLegendary = Array.isArray(preset.legendary_actions);
        if (preset.legendary_desc == null || preset.legendary_desc.length == 0)
            this.LegendaryDescriptionDefault();
        else
            mon.legendariesDescription = preset.legendary_desc;
        FormFunctions.SetLegendaryDescriptionForm();

        // Abilities
        mon.abilities = [];
        mon.actions = [];
        mon.bonuses = [];
        mon.reactions = [];
        mon.villains = [];
        mon.legendaries = [];
        let abilitiesPresetArr = preset.special_abilities,
            actionsPresetArr = preset.actions,
            reactionsPresetArr = preset.reactions,
            legendariesPresetArr = preset.legendary_actions;

        let self = this,
            AbilityPresetLoop = function(arr, name) {
                if (Array.isArray(arr)) {
                    for (let index = 0; index < arr.length; index++)
                        self.AddAbilityPreset(name, arr[index]);
                }
            }

        AbilityPresetLoop(abilitiesPresetArr, "abilities");
        AbilityPresetLoop(actionsPresetArr, "actions");
        AbilityPresetLoop(reactionsPresetArr, "reactions");
        if (mon.isLegendary)
            AbilityPresetLoop(legendariesPresetArr, "legendaries");

        mon.separationPoint = undefined; // This will make the separation point be automatically calculated in UpdateStatblock
    },

    // Add stuff to arrays

    AddSthrow: function(sthrowName) {
        if (!sthrowName) return;
        let sthrowData = ArrayFunctions.FindInList(data.stats, sthrowName),
            inserted = false;
        if (sthrowData == null) return;

        // Non-alphabetical ordering
        for (let index = 0; index < mon.sthrows.length; index++) {
            if (mon.sthrows[index].name == sthrowName) return;
            if (mon.sthrows[index].order > sthrowData.order) {
                mon.sthrows.splice(index, 0, sthrowData)
                inserted = true;
                break;
            }
        }
        if (!inserted)
            mon.sthrows.push(sthrowData);
    },

    AddSkill: function(skillName, note) {
        let skillData = ArrayFunctions.FindInList(data.allSkills, skillName);
        if (skillData == null) return;

        let skill = {
            "name": skillData.name,
            "stat": skillData.stat
        };
        if (note)
            skill["note"] = note;
        ArrayFunctions.ArrayInsert(mon.skills, skill, true);
    },

    AddDamageType: function(damageName, type) {
        let special = false,
            note;
        if (!data.allNormalDamageTypes.includes(damageName.toLowerCase())) {
            special = true;
            if (damageName == "*") {
                damageName = $("#other-damage-input").val().trim();
                if (damageName.length == 0)
                    return;
            }
        }
        note = type == 'v' ? " (Vulnerable)" : type == 'i' ? " (Immune)" : type == 'a' ? " (Absorb)" : " (Resistant)";
        ArrayFunctions.ArrayInsert(mon[special ? "specialdamage" : "damagetypes"], {
            "name": damageName,
            "note": note,
            "type": type
        }, true);
    },

    AddPresetDamage: function(string, type) {
        if (string.length == 0) return;
        let arr = string.split(";");
        if (arr[0].toLowerCase().includes("magic"))
            this.AddDamageType(arr[0].trim(), type);
        else {
            let normalArr = arr[0].split(",");
            for (let index = 0; index < normalArr.length; index++)
                this.AddDamageType(normalArr[index].trim(), type);
            for (let index = 1; index < arr.length; index++)
                this.AddDamageType(arr[index].trim(), type);
        }
    },

    AddCondition: function(conditionName) {
        ArrayFunctions.ArrayInsert(mon.conditions, {
            "name": conditionName
        }, true);
    },

    AddLanguage: function(languageName) {
        if (languageName == "") return;
        if (languageName == "*") {
            languageName = $("#other-language-input").val().trim();
            if (languageName.length == 0) return;
        }
        if (mon.languages.length > 0) {
            if (languageName.toLowerCase() == "all" || mon.languages[0].name.toLowerCase() == "all")
                mon.languages = [];
        }
        ArrayFunctions.ArrayInsert(mon.languages, {
            "name": languageName
        }, true);
    },

    AddAbility: function(arrName, abilityName, abilityDesc) {
        let arr = mon[arrName];
        ArrayFunctions.ArrayInsert(arr, {
            "name": abilityName.trim(),
            "desc": abilityDesc.trim()
        }, false);
    },

    AddAbilityPreset: function(arrName, ability) {
        let abilityName = ability.name.trim(),
            abilityDesc = ability.desc;
		if(Array.isArray(abilityDesc))
			abilityDesc = abilityDesc.join("\n");
        abilityDesc = abilityDesc.trim();

        // In case of spellcasting
        if (arrName == "abilities" && abilityName.toLowerCase().includes("spellcasting") && abilityDesc.includes("\n")) {
            abilityDesc = abilityDesc.split("\u2022").join(""), // Remove bullet points
                spellcastingAbility =
                abilityDesc.toLowerCase().includes("intelligence") ? "INT" :
                abilityDesc.toLowerCase().includes("wisdom") ? "WIS" :
                abilityDesc.toLowerCase().includes("charisma") ? "CHA" : null;

            if (spellcastingAbility != null) {
                abilityDesc = abilityDesc
                    .replace(/DC \d+/g.exec(abilityDesc), "DC [" + spellcastingAbility + " SAVE]")
                    .replace(/[\+\-]\d+ to hit/g.exec(abilityDesc), "[" + spellcastingAbility + " ATK] to hit");
            }

            // For hag covens
            let postDesc = "";
            if (abilityName.toLowerCase().includes("shared spellcasting")) {
                let lastLineBreak = abilityDesc.lastIndexOf("\n\n");
                postDesc = abilityDesc.substr(lastLineBreak).trim();
                abilityDesc = abilityDesc.substring(0, lastLineBreak);
            }

            let firstLineBreak = abilityDesc.indexOf("\n");
            spellcastingDesc = abilityDesc.substr(0, firstLineBreak).trim();
            spellcastingSpells = abilityDesc.substr(firstLineBreak).trim();

            spellsArr = spellcastingSpells.split("\n");
            for (let index = 0; index < spellsArr.length; index++) {
                let string = spellsArr[index],
                    splitString = string.split(":");
                if (splitString.length < 2) continue;
                let newString = splitString[1];
                newString = StringFunctions.StringReplaceAll(newString, "(", "_(");
                newString = StringFunctions.StringReplaceAll(newString, ")", ")_");

                spellsArr[index] = " " + splitString[0].trim() + ": _" + newString.trim() + "_";
            }

            spellcastingSpells = spellsArr.join("\n>");

            abilityDesc = spellcastingDesc + "\n\n\n>" + spellcastingSpells;

            // For hag covens
            if (postDesc.length > 0)
                abilityDesc += "\n\n" + postDesc;
        }

        // In case of attacks
        if (arrName == "actions" && abilityDesc.toLowerCase().includes("attack")) {
            // Italicize the correct parts of attack-type actions
            let lowercaseDesc = abilityDesc.toLowerCase();
            for (let index = 0; index < data.attackTypes.length; index++) {
                let attackType = data.attackTypes[index];
                if (lowercaseDesc.includes(attackType)) {
                    let indexOfStart = lowercaseDesc.indexOf(attackType),
                        indexOfHit = lowercaseDesc.indexOf("hit:");
                    if (indexOfStart != 0) break;
                    abilityDesc = "_" + abilityDesc.slice(0, attackType.length) + "_" + abilityDesc.slice(attackType.length, indexOfHit) + "_" + abilityDesc.slice(indexOfHit, indexOfHit + 4) + "_" + abilityDesc.slice(indexOfHit + 4);
                    break;
                }
            }
        }

        if (abilityName.length != 0 && abilityDesc.length != 0)
            this.AddAbility(arrName, abilityName, abilityDesc);
    },

    // Return the default legendary description
    LegendaryDescriptionDefault: function() {
        let monsterName = name.toLowerCase();
        mon.legendariesDescription = "The " + mon.name.toLowerCase() + " can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The " + mon.name.toLowerCase() + " regains spent legendary actions at the start of its turn.";
    }
}

// Functions that return a string
var StringFunctions = {
    // Add a + if the ability bonus is non-negative
    BonusFormat: (stat) => stat >= 0 ? "+" + stat : stat,

    // Get the string displayed for the monster's AC
    GetArmorVal: function(mon_name) {
      let armor_mod = 0;
      if (mon_name.armorName === "poor") armor_mod = -1;
      if (mon_name.armorName === "good") armor_mod = 1;

      return mon_name.acadj + data.armorclass[(data.tiers[mon_name.tier].trow+armor_mod)];
    },

    GetArmorData: function(mon_name,shownote) {
      let armor_note = "";
      if (shownote) {
        if (mon_name.shieldBonus > 0) armor_note = " (shield)";
        if (mon_name.otherArmorDesc) armor_note = " (" + mon_name.otherArmorDesc + ")";
        if (mon_name.otherArmorDesc && (mon_name.shieldBonus > 0)) armor_note = " (" + mon_name.otherArmorDesc + ", shield)";
      }

      return this.GetArmorVal(mon_name) + armor_note;
    },

    // Get the string displayed for the monster's Save DC
    GetSaveDC: function(mon_id) {
      let st_mod = 0;
      if (mon_id.stName === "poor") st_mod = -1;
      if (mon_id.stName === "good") st_mod = 1;

      return data.savedc[(data.tiers[mon_id.tier].trow+st_mod)];
    },

    // Get the string displayed for the monster's Attack Bonus
    GetAttackBonus: function(mon_id) {
      let atk_mod = 0;
      if (mon_id.atkName === "poor") atk_mod = -1;
      if (mon_id.atkName === "good") atk_mod = 1;

      return data.atkbonus[(data.tiers[mon_id.tier].trow+atk_mod)];
    },

    // Get the string displayed for the monster's HP
    GetHP: function() {
        let hp_mod = 0;
        if (mon.hpName === "poor") hp_mod = -1;
        if (mon.hpName === "good") hp_mod = 1;

        let conBonus = MathFunctions.PointsToBonus(mon.conPoints);
        let hitDieSize = data.sizes[mon.size].hitDie;

        mon.avgHP = mon.hpadj + Math.floor(mon.hpCut * data.hitpoints[(data.tiers[mon.tier].trow+hp_mod)][data.organizations[mon.org].ocol]);

        mon.hitDice = Math.round(mon.avgHP / (((hitDieSize + 1) / 2) + conBonus));
        let avgMod = mon.avgHP - Math.floor(mon.hitDice * ((hitDieSize + 1) / 2));

        if (avgMod > 0)
            return mon.avgHP + " (" + mon.hitDice + "d" + hitDieSize + " + " + avgMod + ")";
        if (conBonus == 0)
            return mon.avgHP + " (" + mon.hitDice + "d" + hitDieSize + ")";
        return mon.avgHP + " (" + mon.hitDice + "d" + hitDieSize + " - " + -(avgMod) + ")";
    },

    // Get the average damage per round
    GetDPR: function(mon_id) {
        let dpr_mod = 0;
        if (mon_id.dprName === "poor") dpr_mod = -1;
        if (mon_id.dprName === "good") dpr_mod = 1;

        mon_id.avgDMG = data.dpr[(data.tiers[mon_id.tier].trow+dpr_mod)][data.organizations[mon_id.org].ocol];

        return mon_id.avgDMG;
    },

    GetMorale: function() {
      let morale_hp = .25 + (mon.mthresh / 2);
      if (mon.mtrig === "wounded") morale_hp = .5 + (mon.mthresh / 2);
      if (mon.mtrig === "critical" || mon.mtrig === "about to die") morale_hp = (mon.mthresh / 2);
      return "DC " + mon.mdc + " or " + mon.mtype + " when " + mon.mtrig + " (" + Math.floor(morale_hp * mon.avgHP) + ")";
    },

    GetParagon: function() {
      mon.paragon = [];
      mon.paragon.push($("#hpnum-input").val());
      for (let i = 1; i <= 6; i++) {
        mon.paragon.push($('#psn-' + i).val(),$('#psv-' + i).val());
      }
    },

    LoadParagon: function() {
      if (!mon.paragon) {
        mon.paragon = ["3","Head",0,"Torso",0,"L Arm",0,"R Arm",0,"L Leg",0,"R Leg",0];
      }
      $("#hpnum-input").val(mon.paragon[0]);
      for (let i = 1; i <= 6; i++) {
        $('#psn-' + i).val(mon.paragon[2*i-1]);
        $('#psv-' + i).val(mon.paragon[2*i]);
      }
    },

    SetParagon: function() {
      let num_pools = mon.paragon[0] * 1;
      for (let i = 1; i <= num_pools; i++) {
        $('#pool-' + i).html(mon.paragon[2*i-1]);
        $('#pval-' + i).html(mon.paragon[2*i]);
      }
      for (let i = num_pools + 1; i <= 6; i++) {
        $('#pool-' + i).html("");
        $('#pval-' + i).html("");
      }
    },

    GetMdMorale: function() {
      if ($("#morale-input").prop('checked')) return '<br>> - **Morale** ' + this.GetMorale();
      return "";
    },

    GetCRdx: function(mon_id) {
      // defensive cr
      // get cr from hp
      let dcr_idx = data.hpforcr.findIndex(element => element <= mon_id.avgHP);
      // get AC diff and adjust dCR
      dcr_idx = dcr_idx - Math.floor((this.GetArmorVal(mon_id) - data.acforcr[dcr_idx]) / 2);
      // offensive cr
      let ocr_idx = data.dmgforcr.findIndex(element => element <= this.GetDPR(mon_id));
      // get ATK or save diff and adjust oCR
      ocr_idx = ocr_idx - Math.max(Math.floor((this.GetSaveDC(mon_id) - data.saveforcr[ocr_idx]) / 2), Math.floor((this.GetAttackBonus(mon_id) - data.atkforcr[ocr_idx]) / 2));
      // average
      return Math.max(Math.min(Math.round((ocr_idx + dcr_idx) / 2), 33),0);
    },

    GetCR: function() {
      let cr_idx = this.GetCRdx(mon);
      return data.crlist[cr_idx] + " (" + data.xpforcr[cr_idx] + " XP)";
    },

    GetMdCR: function() {
      if ($("#cr-input").prop('checked')) return '> - **CR** ' + this.GetCR() + '<br>';
      return "";
    },

    GetThreat: function(threat_check,show_num) {
      let threat_num = "";
      if (show_num) threat_num =  " (" + threat_check + ")";
      if (threat_check > 3) return "extreme" + threat_num;
      if (threat_check > 1) return "high" + threat_num;
      if (threat_check > -2) return "medium" + threat_num;
      if (threat_check > -4) return "low" + threat_num;
      return "negligible" + threat_num;
    },

    GetSpeed: function() {
        if (mon.customSpeed)
            return mon.speedDesc;
        let speedsDisplayArr = [mon.speed + " ft."];
        if (mon.burrowSpeed > 0) speedsDisplayArr.push("burrow " + mon.burrowSpeed + " ft.");
        if (mon.climbSpeed > 0) speedsDisplayArr.push("climb " + mon.climbSpeed + " ft.");
        if (mon.flySpeed > 0) speedsDisplayArr.push("fly " + mon.flySpeed + " ft." + (mon.hover ? " (hover)" : ""));
        if (mon.swimSpeed > 0) speedsDisplayArr.push("swim " + mon.swimSpeed + " ft.");
        return speedsDisplayArr.join(", ")
    },

    GetSenses: function(mon_id) {
        let sensesDisplayArr = [];
        if (mon_id.blindsight > 0) sensesDisplayArr.push("blindsight " + mon_id.blindsight + " ft." + (mon_id.blind ? " (blind beyond this radius)" : ""));
        if (mon_id.darkvision > 0) sensesDisplayArr.push("darkvision " + mon_id.darkvision + " ft.");
        if (mon_id.tremorsense > 0) sensesDisplayArr.push("tremorsense " + mon_id.tremorsense + " ft.");
        if (mon_id.truesight > 0) sensesDisplayArr.push("truesight " + mon_id.truesight + " ft.");

        // Passive Perception
        let ppData = ArrayFunctions.FindInList(mon_id.skills, "Perception"),
            pp = 10 + MathFunctions.PointsToBonus(mon_id.wisPoints);
        if (ppData != null)
            pp += data.tiers[mon_id.tier].prof * (ppData.hasOwnProperty("note") ? 2 : 1);
        sensesDisplayArr.push("passive Perception " + pp);
        return sensesDisplayArr.join(", ");
    },

    GetPropertiesDisplayArr: function(mon_id) {
        // Properties
        let propertiesDisplayArr = [],
            sthrowsDisplayArr = [],
            skillsDisplayArr = [],
            conditionsDisplayArr = [],
            sensesDisplayArr = [],
            languageDisplayArr = [],
            vulnerableDisplayString = "",
            resistantDisplayString = "",
            immuneDisplayString = "";

        // Saving Throws
        for (let index = 0; index < mon_id.sthrows.length; index++)
            sthrowsDisplayArr.push(StringFunctions.StringCapitalize(mon_id.sthrows[index].name) + " " +
                StringFunctions.BonusFormat((MathFunctions.PointsToBonus(mon_id[mon_id.sthrows[index].name + "Points"]) + data.tiers[mon_id.tier].prof)));

        // Skills
        for (let index = 0; index < mon_id.skills.length; index++) {
            let skillData = mon_id.skills[index];
            skillsDisplayArr.push(StringFunctions.StringCapitalize(skillData.name) + " " +
                StringFunctions.BonusFormat(MathFunctions.PointsToBonus(mon_id[skillData.stat + "Points"]) + data.tiers[mon_id.tier].prof * (skillData.hasOwnProperty("note") ? 2 : 1)));
        }

        // Damage Types (It's not pretty but it does its job)
        let vulnerableDisplayArr = [],
            resistantDisplayArr = [],
            immuneDisplayArr = [],
            absorbDisplayArr = [],
            vulnerableDisplayArrSpecial = [],
            resistantDisplayArrSpecial = [],
            immuneDisplayArrSpecial = [],
            absorbDisplayArrSpecial = [];
        for (let index = 0; index < mon_id.damagetypes.length; index++) {
            let typeId = mon_id.damagetypes[index].type;
            (typeId == "v" ? vulnerableDisplayArr : typeId == "i" ? immuneDisplayArr : typeId == "a" ? absorbDisplayArr : resistantDisplayArr).push(mon_id.damagetypes[index].name)
        }
        for (let index = 0; index < mon_id.specialdamage.length; index++) {
            let typeId = mon_id.specialdamage[index].type,
                arr = typeId == "v" ? vulnerableDisplayArrSpecial : typeId == "i" ? immuneDisplayArrSpecial : typeId == "a" ? absorbDisplayArrSpecial : resistantDisplayArrSpecial;
            arr.push(mon_id.specialdamage[index].name)
        }
        vulnerableDisplayString = StringFunctions.ConcatUnlessEmpty(vulnerableDisplayArr.join(", "), vulnerableDisplayArrSpecial.join("; "), "; ").toLowerCase();
        resistantDisplayString = StringFunctions.ConcatUnlessEmpty(resistantDisplayArr.join(", "), resistantDisplayArrSpecial.join("; "), "; ").toLowerCase();
        immuneDisplayString = StringFunctions.ConcatUnlessEmpty(immuneDisplayArr.join(", "), immuneDisplayArrSpecial.join("; "), "; ").toLowerCase();
        absorbDisplayString = StringFunctions.ConcatUnlessEmpty(absorbDisplayArr.join(", "), absorbDisplayArrSpecial.join("; "), "; ").toLowerCase();

        // Condition Immunities
        for (let index = 0; index < mon_id.conditions.length; index++)
            conditionsDisplayArr.push(mon_id.conditions[index].name.toLowerCase());

        // Senses
        sensesDisplayString = StringFunctions.GetSenses(mon_id);

        // Languages
        for (let index = 0; index < mon_id.languages.length; index++)
            languageDisplayArr.push(mon_id.languages[index].name);
        if (mon_id.telepathy > 0)
            languageDisplayArr.push("telepathy " + mon_id.telepathy + " ft.");
        else if (languageDisplayArr.length == 0)
            languageDisplayArr.push("&mdash;");

        // Add all that to the array
        let pushArr = (name, arr) => {
            if (arr.length > 0) propertiesDisplayArr.push({
                "name": name,
                "arr": arr
            })
        };
        pushArr("Saving Throws", sthrowsDisplayArr);
        pushArr("Skills", skillsDisplayArr);
        pushArr("Damage Vulnerabilities", vulnerableDisplayString);
        pushArr("Damage Resistances", resistantDisplayString);
        pushArr("Damage Immunities", immuneDisplayString);
        pushArr("Damage Absorption", absorbDisplayString);
        pushArr("Condition Immunities", conditionsDisplayArr);
        pushArr("Senses", sensesDisplayString);
        pushArr("Languages", languageDisplayArr);

        return propertiesDisplayArr;
    },

    // Add italics, indents, and newlines
    FormatString: function(string, isBlock) {
        if (typeof string != "string")
            return string;

        // Complicated regex stuff to add indents
        if (isBlock) {
            let execArr, newlineArr = [],
                regExp = new RegExp("(\r\n|\r|\n)+", "g");
            while ((execArr = regExp.exec(string)) !== null)
                newlineArr.push(execArr);
            let index = newlineArr.length - 1;
            while (index >= 0) {
                let newlineString = newlineArr[index],
                    reverseIndent = (string[newlineString.index + newlineString[0].length] == ">");

                string = this.StringSplice(string, newlineString.index, newlineString[0].length + (reverseIndent ? 1 : 0),
                    "</div>" + (newlineString[0].length > 1 ? "<br>" : "") + (reverseIndent ? "<div class='reverse-indent'>" : "<div class='indent'>"));

                index--;
            }
        }

        // Italics and bold
        string = this.FormatStringHelper(string, "_", "<i>", "</i>")
        string = this.FormatStringHelper(string, "**", "<b>", "</b>")
        return string;
    },

    // FormatString helper function
    FormatStringHelper: function(string, target, startTag, endTag) {
        while (string.includes(target)) {
            let startIndex = string.indexOf(target);
            string = this.StringSplice(string, startIndex, target.length, startTag);
            let endIndex = string.indexOf(target, startIndex + target.length);
            if (endIndex < 0)
                return string + endTag;
            string = this.StringSplice(string, endIndex, target.length, endTag);
        }
        return string;
    },

    // HTML strings

    MakePropertyHTML: function(property, firstLine) {
        if (property.arr.length == 0) return "";
        let htmlClass = firstLine ? "property-line first" : "property-line",
            arr = Array.isArray(property.arr) ? property.arr.join(", ") : property.arr;
        return "<div class=\"" + htmlClass + "\"><div><h4>" + property.name + "</h4> <p>" + this.FormatString(arr, false) + "</p></div></div><!-- property line -->"
    },

    MakeTraitHTML: function(name, description) {
        return "<div class=\"property-block\"><div><h4>" + name + ".</h4><p> " + this.FormatString(description, true) + "</p></div></div> <!-- property block -->";
    },

    MakeTraitHTMLLegendary: function(name, description) {
        return "<div class=\"property-block reverse-indent legendary\"><div><h4>" + name + ".</h4><p> " + this.FormatString(description, true) + "</p></div></div> <!-- property block -->";
    },

    // General string operations

    ConcatUnlessEmpty(item1, item2, joinString = ", ") {
        return item1.length > 0 ?
            item2.length > 0 ? item1 + joinString + item2 :
            item1 : item2.length > 0 ? item2 : "";
    },

    StringSplice: (string, index, remove, insert = "") => string.slice(0, index) + insert + string.slice(index + remove),

    StringReplaceAll: (string, find, replacement) => string.split(find).join(replacement),

    StringCapitalize: (string) => string[0].toUpperCase() + string.substr(1),

    GetNumbersOnly: (string) => parseInt(string.replace(/\D/g, '')),
}

// Math functions
var MathFunctions = {
    Clamp: (num, min, max) => Math.min(Math.max(num, min), max),

    // Compute ability bonuses based on ability scores
    PointsToBonus: (points) => Math.floor(points / 2) - 5,
}

// Array functions
var ArrayFunctions = {
    ArrayInsert: function(arr, element, alphabetSort) {
        let lowercaseElement = element.name.toLowerCase();
        for (let index = 0; index < arr.length; index++) {
            let lowercaseIndex = arr[index].name.toLowerCase();
            if (alphabetSort && lowercaseIndex > lowercaseElement) {
                arr.splice(index, 0, element)
                return;
            }
            if (lowercaseIndex == lowercaseElement) {
                arr.splice(index, 1, element)
                return;
            }
        }
        arr.push(element);
    },

    FindInList: function(arr, name) {
        let lowercaseName = name.toLowerCase();
        for (let index = 0; index < arr.length; index++) {
            if (arr[index].name.toLowerCase() == lowercaseName)
                return arr[index];
        }
        return null;
    },

    // Take a string representing an array from a preset and turn it into a normal array
    FixPresetArray: function(string) {
        let arr = string.split(","),
            returnArr = [];
        for (let index = 0; index < arr.length; index++) {
            let name = arr[index].trim();
            if (name.length > 0)
                returnArr.push(name);
        }
        return returnArr;
    }
}

// Document ready function
$(function() {
    // Load the preset monster names
    $.getJSON("https://api.open5e.com/monsters/?format=json&fields=slug,name&limit=1000&document__slug=wotc-srd", function(srdArr) {
			let monsterSelect = $("#monster-select");
			monsterSelect.append("<option value=''></option>");
			monsterSelect.append("<option value=''>-5e SRD-</option>");
            $.each(srdArr.results, function(index, value) {
                monsterSelect.append("<option value='" + value.slug + "'>" + value.name + "</option>");
            })
			$.getJSON("https://api.open5e.com/monsters/?format=json&fields=slug,name&limit=1000&document__slug=tob", function(tobArr) {
				monsterSelect.append("<option value=''></option>");
				monsterSelect.append("<option value=''>-Tome of Beasts (Kobold Press)-</option>");
				$.each(tobArr.results, function(index, value) {
					monsterSelect.append("<option value='" + value.slug + "'>" + value.name + "</option>");
				})
			})
			.fail(function() {
				$("#monster-select-form").html("Unable to load Tome of Beasts monster presets.")
			});
        })
        .fail(function() {
            $("#monster-select-form").html("Unable to load monster presets.")
        });

    // Load the json data
    $.getJSON("js/JSON/statblockdata.json?version=5.0", function(json) {
        data = json;

        // Set the default monster in case there isn't one saved
        GetVariablesFunctions.SetPreset(data.defaultPreset);

        // Load saved data
        SavedData.RetrieveFromLocalStorage();
        ListData.RetrieveFromLocalStorage();
        EncounterData.RetrieveFromLocalStorage();

        Populate();
    });

    FormFunctions.ShowHideFormatHelper();
});

function Populate() {
    FormFunctions.SetLegendaryDescriptionForm();
    FormFunctions.SetCommonAbilitiesDropdown();

    // Populate the stat block
    FormFunctions.SetForms();
    UpdateStatblock();
}
