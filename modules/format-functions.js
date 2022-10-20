const fs = require("fs");
const jimp = require("jimp");

function getCurrentTime() {
  let date = new Date();
  let now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  let current = date.toISOString();
  current = current.substring(0, current.indexOf(".")).replace("T", " ");
  return current;
}

function setTreeData(arg) {
  let data = [...arg];
  let tree = data.filter(function (parent) {
    const branchArr = data.filter(function (child) {
      if (parent.id == child.parent_comment_id) {
        child._hasParent = true;
      }
      return parent.id == child.parent_comment_id;
    });
    if (branchArr.length > 0) {
      parent.children = branchArr;
    }
    return !parent._hasParent;
  });

  tree = tree.filter(function (item) {
    return !item._hasParent;
  });
  return tree;
}

function convertCommentsToTree(data) {
  const jsonStr = JSON.stringify(setTreeData(data));
  const json = JSON.parse(jsonStr);
  return json;
}

async function formatImage(fileInfo) {
  if (fileInfo) {
    const oldFileName = fileInfo.path;
    const newFileName = `./public/images/${fileInfo.originalname}`;
    fs.renameSync(oldFileName, newFileName);
    const thumbnail = await jimp.read(newFileName);
    thumbnail.resize(320, jimp.AUTO);
    thumbnail.crop(0, thumbnail.bitmap.height / 2 - 100, 320, 200);
    await thumbnail.write(
      `./public/images/thumbnails/${fileInfo.originalname}`
    );

    const articleThumb = await jimp.read(newFileName);
    articleThumb.resize(1000, jimp.AUTO);
    articleThumb.crop(0, articleThumb.bitmap.height / 2 - 300, 1000, 600);
    await articleThumb.write(
      `./public/images/articleThumb/${fileInfo.originalname}`
    );

    return fileInfo.originalname;
  } else {
    return null;
  }
}

module.exports = {
  getCurrentTime,
  convertCommentsToTree,
  formatImage
};
