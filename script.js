const connToken = "90934751|-31949209064953076|90955896";
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";
const baseUrl = "http://api.login2explore.com:5577";
const irl = "/api/irl";
const iml = "/api/iml";

$(document).ready(() => {
  resetForm();

  $("#rollNo").on("blur", () => {
    const roll = $("#rollNo").val().trim();
    if (roll !== "") checkRollExists(roll);
  });

  $("#saveBtn").click(saveData);
  $("#updateBtn").click(updateData);
  $("#resetBtn").click(resetForm);
});

function resetForm() {
  $("#studentForm")[0].reset();
  $("#rollNo").prop("disabled", false).focus();
  $("#fullName, #stdClass, #birthDate, #address, #enrollDate").prop("disabled", true);
  $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);
}

function checkRollExists(roll) {
  const getReq = {
    token: connToken,
    dbName: dbName,
    rel: relName,
    cmd: "GET",
    jsonStr: { id: roll }
  };

  $.post({
    url: baseUrl + irl,
    data: JSON.stringify(getReq),
    contentType: "application/json",
    success: res => {
      if (res.status === 200) {
        const record = JSON.parse(res.data).record;
        populateForm(record);
        $("#rollNo").prop("disabled", true);
        enableFields();
        $("#updateBtn, #resetBtn").prop("disabled", false);
      } else {
        enableFields();
        $("#saveBtn, #resetBtn").prop("disabled", false);
      }
    },
    error: () => {
      enableFields();
      $("#saveBtn, #resetBtn").prop("disabled", false);
    }
  });
}

function populateForm(data) {
  $("#fullName").val(data.name);
  $("#stdClass").val(data.class);
  $("#birthDate").val(data.birth);
  $("#address").val(data.address);
  $("#enrollDate").val(data.enroll);
}

function enableFields() {
  $("#fullName, #stdClass, #birthDate, #address, #enrollDate").prop("disabled", false);
  $("#fullName").focus();
}

function validateForm() {
  let isValid = true;
  $("input:enabled, textarea:enabled").each(function () {
    if ($(this).val().trim() === "") isValid = false;
  });
  return isValid;
}

function collectData() {
  return {
    id: $("#rollNo").val().trim(),
    name: $("#fullName").val().trim(),
    class: $("#stdClass").val().trim(),
    birth: $("#birthDate").val().trim(),
    address: $("#address").val().trim(),
    enroll: $("#enrollDate").val().trim()
  };
}

function saveData() {
  if (!validateForm()) {
    alert("Please fill all fields.");
    return;
  }

  const data = collectData();
  const putReq = {
    token: connToken,
    dbName: dbName,
    rel: relName,
    cmd: "PUT",
    jsonStr: data
  };

  $.post({
    url: baseUrl + iml,
    data: JSON.stringify(putReq),
    contentType: "application/json",
    success: () => {
      alert("Student enrolled successfully!");
      resetForm();
    },
    error: () => alert("Error saving data.")
  });
}

function updateData() {
  if (!validateForm()) {
    alert("Please fill all fields.");
    return;
  }

  const data = collectData();
  const updateReq = {
    token: connToken,
    dbName: dbName,
    rel: relName,
    cmd: "UPDATE",
    jsonStr: { id: data.id },
    updatedJsonStr: data
  };

  $.post({
    url: baseUrl + iml,
    data: JSON.stringify(updateReq),
    contentType: "application/json",
    success: () => {
      alert("Student record updated!");
      resetForm();
    },
    error: () => alert("Error updating record.")
  });
}
