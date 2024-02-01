const fs = require("fs");

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  //break up data by line breaks
  let dataArr = data.split("\n").filter((entry) => entry.trim());
  console.log(pairUnorderedList(dataArr));

//   TODO: splice dataArr and replace the uls with the list from pairUnorderedList
});

function pairUnorderedList(arr) {
  const list = [];
  let ulFound = false;
  let ulStart = null;
  let ulEnd = null;

  for (const [i, element] of arr.entries()) {
    if (element.trim().toLowerCase() === "ul" && !ulFound) {
      ulFound = true;
      ulStart = i;
    } else if (element.trim().toLowerCase() === "ul" && ulFound) {
      ulFound = false;
      ulEnd = i;
    }

    if (ulFound && element.trim().toLowerCase() !== "ul") {
      list.push(element);
    }
  }

  if (list.length === 0) return null;
  else if(list) return [ ulStart, ulEnd, list ];
}
