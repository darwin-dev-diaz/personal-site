const fs = require("fs");
const { JSDOM } = require("jsdom");

//jsdom instance
const dom = new JSDOM();
const document = dom.window.document;

fs.readFile("toHTML.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let dataArr = data.split("\n").filter((entry) => entry.trim());
  let sortedArr = reduceUls(dataArr);
  const postNum = sortedArr.shift();

  const postHeader = populateHeader(sortedArr.slice(0,4));
  const postContent = populatePostContent(sortedArr.slice(4));

  const output = fillHTMLBoilerPlate(postHeader, postContent);

  fs.writeFile(`${postNum}.html`, output, (err)=>{
    if (err) {
      console.error(err);
    } else {
      console.log('File written successfully.');
    }
  });
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

function populateHeader(arr) {
  const postHeader = document.createElement('div');
  postHeader.classList.add('post-header');

  const tags = document.createElement('div');
  tags.classList.add('tags');

  const h3One = document.createElement('h3');
  const tagOne = document.createElement('div');
  tagOne.classList.add('tag', 'mon-red-background');
  h3One.textContent = arr[0].match(/(?<=\[POSTNUM\]:)(.*)/g);
  tagOne.appendChild(h3One);

  const h3Two = document.createElement('h3');
  const tagTwo = document.createElement('div');
  tagTwo.classList.add('tag', 'mon-red-background');
  h3Two.textContent = arr[1].match(/(?<=\[DATE\]:)(.*)/g);
  tagTwo.appendChild(h3Two);

  tags.appendChild(tagOne);
  tags.appendChild(tagTwo);

  const postTitle = document.createElement('h1');
  postTitle.classList.add('post-title');
  postTitle.textContent = arr[2].match(/(?<=\[TITLE\]:)(.*)/g);

  const postSubTitle = document.createElement('h2');
  postSubTitle.classList.add('post-subtitle','mon-red-text');
  postSubTitle.textContent = arr[3].match(/(?<=\[SUBTITLE\]:)(.*)/g);

  postHeader.appendChild(tags);
  postHeader.appendChild(postTitle);
  postHeader.appendChild(postSubTitle);

  return postHeader;
}

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

function fillHTMLBoilerPlate(postHeader, postContent){
  const finalHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="../style.css" />
      <link
        href="https://fonts.googleapis.com/css?family=Inconsolata:400,600"
        rel="stylesheet"
      />
      <title>Darwin Diaz</title>
    </head>
    <body>
      <!-- HEADER -->
      <div class="header-left"></div>
      <div class="header">
        <a class="logo" href="../index.html">Darwin Diaz</a>
        <div class="links">
          <a class="daily-link" href="../daily/daily-home.html">Daily</a>
          <a class="books-link" href="../books/books-home.html">Books</a>
          <a class="plan-link" href="../plans/plans-home.html">Plan</a>
        </div>
      </div>
      <div class="header-right"></div>
  
      <!-- CONTENT -->
      <div class="main-content">
      ${postHeader.outerHTML}
      ${postContent.outerHTML}
      </div>
    </body>
  </html>
  `;

  return finalHTML;
}

