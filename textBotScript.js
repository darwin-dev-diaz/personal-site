const fs = require("fs");
const { start } = require("repl");

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  //break up data by line breaks
  let dataArr = data.split("\n").filter((entry) => entry.trim());
  let sortedArr = reduceUls(dataArr);

  populateHeader(sortedArr);
});

function pairUnorderedList(arr) {
  const list = [];
  let ulFound = false;
  let ulStart = null;
  let ulEnd = null;

  for (const [i, element] of arr.entries()) {
    if (typeof element === "string") {
      if (element.trim().toLowerCase() === "ul" && !ulFound) {
        ulFound = true;
        ulStart = i;
      } else if (element.trim().toLowerCase() === "ul" && ulFound) {
        ulFound = false;
        ulEnd = i;
        break;
      }

      if (ulFound && element.trim().toLowerCase() !== "ul") {
        list.push(element);
      }
    }
  }

  if (list.length === 0) return null;
  else if (list) return [ulStart, ulEnd, list];
}

function reduceUls(arr) {
  let newArr = arr;
  while (pairUnorderedList(newArr)) {
    [firstIndex, secondIndex, list] = pairUnorderedList(newArr);
    newArr.splice(firstIndex, secondIndex - firstIndex + 1, list);
  }
  return newArr;
}

function populateHeader(arr){
  const tagList = document.querySelectorAll(".tag.mon-red-background>h3");
  tagList[0].textContent = arr.shift().match(/(?<=\[POSTNUM\]:)(.*)/g);
  tagList[1].textContent = arr.shift().match(/(?<=\[DATE\]:)(.*)/g);

  const title = document.querySelector(".post-title");
  title.textContent = arr.shift().match(/(?<=\[TITLE\]:)(.*)/g);

  const subtitle = document.querySelector("#post-subtitle");
  subtitle.textContent = arr.shift().match(/(?<=\[SUBTITLE\]:)(.*)/g);
}

// at this point the arr only has relevant content
function populatePostContent(arr) {
  const nodeList = [];
  const h2Regex = new RegExp("(?<=h2)(.*)(?=h2)", "g");

  let startSection = document.createElement('div');
  startSection.classList.add("post-section");
  for (element of arr) {
    // if element.match h2. create new section
    let newNode = document.createElement('p'); 
    newNode.classList.add('bt');
    newNode.textContent = element;
    startSection.appendChild(newNode);
    //  looping through the elements appending the created element to the startSection
  }
}
