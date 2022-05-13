import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const KEY = 'commentDB'
var gItemsTree
  ; (() => {
    gItemsTree = getInitialItemTree()
    _createComments()
  })()

window.test = {
  addItem,
  getItem,
  getInitialItemTree,
  goDeep,
}

export const itemService = {
  addItem,
  updateComment,
  addComment,
  getInitialItemTree,
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


function updateComment(key, txt) {
  let item = getItem(key)
  item.commentText = txt
}

async function addComment(id, txt) {
  if (!txt) return
  let item = await getItem(id)
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
  return save(item, comment)
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
  return save(comment)
}

//go into each node and add id , return an array with main childs soo we can run on it
function goDeep() {
  const res = []
  const gTree = gItemsTree //getInitialItemTree()
  function inside(item) {
    item._id = Math.random().toString().slice(2, 9)
    //check maybe no need for this
    if (item.children.length && !res.includes(item)) {
      res.push(...item.children)
    }
  }
  _traverse(gTree, inside)
  // console.log(gTree.children);
  // console.log('test', [...new Set(res)].slice(0, 2));
  return gTree.children
  // return [...new Set(res)].slice(0, 2) //Plaster try without the slice , you got 4 items 2 vegpuki1 vegmuki1
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


