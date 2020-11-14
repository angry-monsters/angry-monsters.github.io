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
  $.getJSON("js/JSON/statblockdata.json?version=5.5", function(json) {
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
