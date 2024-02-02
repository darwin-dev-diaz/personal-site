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
  console.log(sortedArr);
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

  console.log(arr);
  const subtitle = document.querySelector("#post-subtitle");
  subtitle.textContent = arr.shift().match(/(?<=\[SUBTITLE\]:)(.*)/g);
}


function createContentNodes(arr) {
  const nodeList = [];
  const dateNodeObj = {
    regex: new RegExp("(?<=[DATE]:)(.*)", ""),
    elementType: 'div',
    classList: ['tag','mon-red-background'],
  };
  
  const dateRegex = new RegExp("(?<=[DATE]:)(.*)", "");
  const titleRegex = new RegExp("(?<=[TITLE]:)(.*)", "");
  const subTitleRegex = new RegExp("(?<=[SUBTITLE]:)(.*)", "");
  const h2Regex = new RegExp("(?<=h2)(.*)(?=h2)", "g");
  // you dont need a regex for a the uls because they will be in lists
  // if an entry doesn't match any of those regular expressions, then you know its a paragraph

  for (element of arr) {
    if(typeof element === 'string'){
      // run each regular expression
      // if a regular expression returns true, write the entry as the appropriate node
      const testElement = document.createElement('div');
      // if the regular expressions all return fasle, write the entry as a paragraph node

    } else {
      
    }
  }
}
