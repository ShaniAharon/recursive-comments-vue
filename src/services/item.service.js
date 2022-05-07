import {storageService} from './async-storage.service.js'
import {utilService} from './util.service.js'

const KEY = 'commentDB'
var gItemsTree
;(() => {
  gItemsTree = getInitialItemTree()
  // _toggleNodesParent()
  _createComments()
})()

window.test = {
  addItem,
  getLeafCount,
  getItem,
  _toggleNodesParent,
  getInitialItemTree,
  subCommentsDeepCount,
  nestedLoop,
  goDeep,
}

export const itemService = {
  addItem,
  getLeafCount,
  updateComment,
  addComment,
  subCommentsCount,
  getInitialItemTree,
  flatIt,
  query,
  getById,
  save,
  goDeep,
  addCommentToRoot,
}

//find an item from the tree and return it
async function getItem(id) {
  const foundItem = await getById(id)
  return foundItem
}

//add or remove parent node prop to all the childs
function _toggleNodesParent(shouldSetParent = true) {
  //no need for all this stuff restore it to the original logic
  const withs = []
  function setParentPropToNode(parentNode) {
    if (!parentNode._id) parentNode._id = Math.random().toString().slice(2, 9)

    for (let i = 0; i < parentNode.children.length; i++) {
      const child = parentNode.children[i]
      if (!withs.includes(child.key)) {
        if (!parentNode._id) {
          // parentNode._id = Math.random().toString().slice(2, 9)
        }

        if (shouldSetParent) {
          child.parent = parentNode._id
          child.parentKey = parentNode.key
        } else delete child.parent
        withs.push(child.key)
      }
      setParentPropToNode(child)
    }
  }
  _traverse(gItemsTree, setParentPropToNode)
}

function _traverse(node, visitFn) {
  visitFn(node)
  node.children.forEach((childNode) => {
    _traverse(childNode, visitFn)
  })
}

function addItem(key, item) {
  function isKeyFound(node) {
    if (node.key === key) {
      node.children.push(item)
    }
  }
  _traverse(gItemsTree, isKeyFound)
}

function getLeafCount() {
  let c = 0
  let p = 0
  function count(node) {
    // if (node === null) return 0

    if (!node.children.length) {
      c++
      if (node.picked) p++
      // return 1
    }
  }
  _traverse(gItemsTree, count)

  // setTimeout(() => {
  //   _traverse(gItemsTree, count)

  //
  //
  // }, 2000)
}

function updateComment(key, txt) {
  let item = getItem(key)
  item.commentText = txt
}

async function addComment(id, txt) {
  if (!txt) return // plaster try without it, because the recursion cmp preview fire 3 times
  let item = await getItem(id) //change ger item to work with local storage data
  const comment = {
    key: txt,
    picked: false,
    commentText: txt,
    children: [],
    createdAt: Date.now(),
    userName: utilService.generateRandomName(),
    imgUrl: utilService.generateRandomImg(),
    _id: Math.random().toString().slice(2, 9),
  }
  item.children.push(comment)
  return save(item, comment) // it overwrite the rest of the tree fix it
}

async function addCommentToRoot(txt) {
  const comment = {
    key: txt,
    picked: false,
    commentText: txt,
    createdAt: Date.now(),
    userName: utilService.generateRandomName(),
    imgUrl: utilService.generateRandomImg(),
    children: [],
  }
  // localStorage.setItem(KEY, JSON.stringify(await query()))
  // debugger
  return save(comment) // it overwrite the rest of the tree fix it
  // const cms = await query()
  // storageService.put(KEY, {...item})
  // const updated = await save(structuredClone(item))
  // item.picked = true // can disable the input after comment
  //
}

//count the number of direct childs, sub comments
function subCommentsCount(key) {
  let item = getItem(key)
  return item.children.length
}

//count the number of all the childs, sub comments
function subCommentsDeepCount(key) {
  let item = getItem(key)
  let count = 0
  function countChilds(node) {
    count += node.children.length
  }
  _traverse(item, countChilds)
  return count
}

//go into each node and flat all the children into one array
function goDeep() {
  const res = []
  const gTree = gItemsTree //getInitialItemTree()
  function inside(item) {
    item._id = Math.random().toString().slice(2, 9)
    if (item.children.length && !res.includes(item)) {
      res.push(...item.children)
    }
  }
  _traverse(gTree, inside)

  return [...new Set(res)].slice(0, 2) //Plaster try without the slice , you got 4 items 2 vegpuki1 vegmuki1
}

function getInitialItemTree() {
  const itemsTree = {
    key: 'all',
    picked: false,
    commentText: '',
    children: [
      {
        key: 'humor',
        picked: false,
        commentText: `This are the type of persons you want to hire. Hard worker, Fun and
        Creative, Eager to learn, Not afraid of failure, Imagination on top`,
        createdAt: Date.now() + Math.random() * 999999,
        userName: utilService.generateRandomName(),
        imgUrl: utilService.generateRandomImg(),
        children: [
          {
            key: 'joke1',
            picked: false,
            commentText: 'That’s exactly what I was thinking.',
            createdAt: Date.now() + Math.random() * 999999,
            userName: utilService.generateRandomName(),
            imgUrl: utilService.generateRandomImg(),
            children: [],
          },
          {
            key: 'joke2',
            picked: false,
            commentText:
              'Agreed. But please don’t be the guy that posts this on your LinkedIn page.',
            createdAt: Date.now() + Math.random() * 999999,
            userName: utilService.generateRandomName(),
            imgUrl: utilService.generateRandomImg(),
            children: [],
          },
        ],
      },
      {
        key: 'veg',
        picked: false,
        commentText:
          'They are definitely creative but the title of this video is misleading. It says it took them a year but this video is only two minutes long.',
        createdAt: Date.now() + Math.random() * 999999,
        userName: utilService.generateRandomName(),
        imgUrl: utilService.generateRandomImg(),
        children: [
          {
            key: 'veg1',
            picked: false,
            commentText:
              'Also did you see how fast that kid was moving? In a year he could have built like ten cars!',
            createdAt: Date.now() + Math.random() * 999999,
            userName: utilService.generateRandomName(),
            imgUrl: utilService.generateRandomImg(),
            children: [
              {
                key: 'veg1-puk',
                picked: false,
                commentText: 'sad buggati noises',
                createdAt: Date.now() + Math.random() * 999999,
                userName: utilService.generateRandomName(),
                imgUrl: utilService.generateRandomImg(),
                children: [],
              },
              {
                key: 'veg1-muk',
                picked: false,
                commentText: 'Hahahahahah',
                createdAt: Date.now() + Math.random() * 999999,
                userName: utilService.generateRandomName(),
                imgUrl: utilService.generateRandomImg(),
                children: [],
              },
            ],
          },
          {
            key: 'veg2',
            picked: false,
            commentText: 'You had me in the first half, I love it!',
            createdAt: Date.now() + Math.random() * 999999,
            userName: utilService.generateRandomName(),
            imgUrl: utilService.generateRandomImg(),
            children: [],
          },
        ],
      },
    ],
  }
  return itemsTree
}

function _createComments() {
  var comments = JSON.parse(localStorage.getItem(KEY))
  if (!comments || !comments.length) {
    comments = goDeep() //flatIt()
    localStorage.setItem(KEY, JSON.stringify(comments))
  }
}

function query() {
  return storageService.query(KEY)
}

function getById(id) {
  return storageService.getItem(KEY, id)
}

function save(item, comment) {
  const savedProject = item._id
    ? storageService.putItem(KEY, item, comment)
    : storageService.post(KEY, item)
  return savedProject
}

window.gItemsTree = gItemsTree

//test flatten to array with objs
function flatIt() {
  const comments = []
  const gTree = getInitialItemTree()
  function flatChildren(node) {
    node._id = Math.random().toString().slice(2, 9)

    if (node.children.length) {
      comments.push(...flatten(node.children))
    }
  }
  _traverse(gTree, flatChildren)
  //
  return [...new Set(comments)]
}

function flatten(values) {
  return values.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    []
  )
}

function nestedLoop(obj) {
  const res = []
  function recurse(obj, current) {
    for (const key in obj) {
      let value = obj[key]
      if (value != undefined) {
        if (Array.isArray(value)) {
          res.push(...value)
          recurse(value)
          // value.map((item) => {
          //   item.id = utilService.makeId()
        }
      } else if (value && typeof value === 'object') {
        recurse(value, key)
      } else {
        // Do your stuff here to var value
        // res[key] = value
        res.push(value)
      }
    }
  }
  recurse(obj)

  return res
}

function simpleStringify(object) {
  var simpleObject = {}
  for (var prop in object) {
    if (!object.hasOwnProperty(prop)) {
      continue
    }
    if (typeof object[prop] == 'object') {
      continue
    }
    if (typeof object[prop] == 'function') {
      continue
    }
    simpleObject[prop] = object[prop]
  }
  return JSON.parse(JSON.stringify(simpleObject)) // returns cleaned up JSON
}
