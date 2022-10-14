function getCurrentTime() {
    let date = new Date();
    let now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
        date.getUTCDate(), date.getUTCHours(),
        date.getUTCMinutes(), date.getUTCSeconds());
    let current = date.toISOString();
    current = current.substring(0, current.indexOf(".")).replace("T", " ");
    return current;
}

function setTreeData(arg){
    let data = [...arg];
        //[...arg] is using a spread syntax to spread elements of data - used for when all elements of data need to be included in a new array or object or should be applied one by one in a function calls arguments list 
    let tree = data.filter(function (parent){
        const branchArr = data.filter(function(child){
            if(parent.id == child.parent_comment_id) {
                child._hasParent = true;
            }
            return parent.id == child.parent_comment_id;
        });
        if(branchArr.length > 0){
            parent.children = branchArr;
        }
        return !parent._hasParent;
    });

    tree = tree.filter(function(item){
        return !item._hasParent;
    });
    return tree;
}

function convertCommentsToTree(data){
    const jsonStr = JSON.stringify(setTreeData(data));
    const json = JSON.parse(jsonStr);
    return json;
}

module.exports = {
    getCurrentTime,
    convertCommentsToTree
}
