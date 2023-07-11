var data = {
  data1: { desc: "Name", value: "Alfitra Fadjri" },
  data2: { desc: "Date Of Birthday", value: "23 Juli 2001" },
  data3: { desc: "Gender", value: "Male" },
  data4: { desc: "Domisily", value: "Tambun, Bekasi Regency, West Java" },
};

var Biodata = document.getElementById("biodata");

for (var key in data) {
  if (data.hasOwnProperty(key)) {
    var row = Biodata.insertRow();
    var r1 = row.insertCell(0);
    var r2 = row.insertCell(1);
    r1.innerHTML = data[key].desc;
    r2.innerHTML = data[key].value;
  }
}
