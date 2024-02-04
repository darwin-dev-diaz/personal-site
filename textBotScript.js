const fs = require("fs");
const { JSDOM } = require("jsdom");

//jsdom instance
const dom = new JSDOM();
const document = dom.window.document;

fs.readFile("justH2andPARA.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  //break up data by line breaks
  let dataArr = data.split("\n").filter((entry) => entry.trim());
  let sortedArr = reduceUls(dataArr);

  // populateHeader(sortedArr);

  // console.log(sortedArr);
  // const postHeader = populatePostContent(sortedArr.slice(0,4));
  const postContent = populatePostContent(sortedArr.slice(4));
  console.log(postContent.outerHTML);
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

// have this one return an outerHTML thing like the other one
function populateHeader(arr) {
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
  const h2Regex = new RegExp("(?<=h2)(.*)(?=h2)", "g");

  const postContent = document.createElement("div");
  postContent.classList.add("post-content");

  let currentPostSection = document.createElement("div");
  currentPostSection.classList.add("post-section");

  for (element of arr) {
    if (typeof element === "object") {
      let newUL = document.createElement("ul");
      newUL.classList.add("bt");

      for (const li of element) {
        let newLI = document.createElement("li");
        newLI.textContent = li;
        newUL.appendChild(newLI);
      }

      currentPostSection.appendChild(newUL);
    } else if (element.match(h2Regex)) {
      postContent.appendChild(currentPostSection);
      currentPostSection = document.createElement("div");
      currentPostSection.classList.add("post-section");

      let newH2 = document.createElement("h2");
      newH2.classList.add("mon-red-text");
      newH2.textContent = element.match(h2Regex)[0];
      currentPostSection.appendChild(newH2);
    } else {
      let newPara = document.createElement("p");
      newPara.classList.add("bt");
      newPara.textContent = element;

      currentPostSection.appendChild(newPara);
    }
  }

  postContent.appendChild(currentPostSection);
  return postContent;
}
