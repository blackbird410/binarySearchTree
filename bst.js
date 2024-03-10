class Queue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  enqueue(item) {
    this.items[this.tailIndex] = item;
    this.tailIndex += 1;
  }

  dequeue() {
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex += 1;
    return item;
  }

  get head() {
    return this.items[this.headIndex];
  }

  get tail() {
    return this.items[this.tailIndex];
  }

  get length() {
    return this.tailIndex - this.headIndex;
  }

  display() {
    let displayString = "";
    for (let i = this.headIndex; i < this.tailIndex - 1; i++) {
      displayString += `${this.items[i]} -> `;
    }
    displayString += `${this.items[this.tailIndex - 1]}`;
    console.log(displayString);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }
  
  buildTree(array) {
    if (!array.length) return null;

    array = mergeSort(removeDuplicates(array));
    const mid = Math.floor(array.length / 2);
    const root = new Node(array[mid]);
    const [left, right] = [
      array.slice(0, Math.floor(array.length / 2)),
      array.slice(Math.floor(array.length / 2) + 1),
    ];
    root.left = this.buildTree(left);
    root.right = this.buildTree(right);

    return root;
  }

  insert(value, root = this.root) {
    if (value === root.value) return null;
    else if (value < root.value) {
      if (!root.left) root.left = new Node(value);
      else this.insert(value, root.left);
    } else {
      if (!root.right) root.right = new Node(value);
      else this.insert(value, root.right);
    }
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  deleteNode(root, value) {
    if (root === null) return root;

    if (value < root.value) root.left = this.deleteNode(root.left, value);
    else if (value > root.value) root.right = this.deleteNode(root.right, value);
    else {
      if (!root.left && !root.right) return null;
      else if (!root.left) return root.right;
      else if (!root.right) return root.left;

      root.value = this.findLeftmostLeaf(root.right).value;
      root.right = this.deleteNode(root.right, root.value);
      return root;
    }
    return root;
  }

  find(value) {
    return this.findNode(this.root, value);
  }

  findNode(root, value) {
    if (!root) return null;
    if (value < root.value) return this.findNode(root.left, value);
    else if(value > root.value) return this.findNode(root.right, value);
    return root;
  }
  
  findLeftmostLeaf(root) {
    if (!root.left) return root;
    return this.findLeftmostLeaf(root.left);
  }

  print(node) {
    console.log(node.value);
  } 

  levelOrder(callback = this.print) {
    let q = new Queue();
    q.enqueue(this.root);

    while (q.length) {
      callback(q.head);

      if (q.head.left) q.enqueue(q.head.left);
      if (q.head.right) q.enqueue(q.head.right);
      q.dequeue();
    }
  } 

  preOrder(callback) {
    return this.preOrderTree(this.root, callback);
  }

  preOrderTree(root, callback) {
    if (!root) return null;

    if (callback) {
      callback(root);
      this.preOrderTree(root.left, callback);
      this.preOrderTree(root.right, callback);
    } else {
      let array = [root.value];
      let left = this.preOrderTree(root.left, callback);
      if (left) array = array.concat(left);
      let right = this.preOrderTree(root.right, callback);
      if (right) array = array.concat(right);
      return array;
    }
  }

  inOrder(callback) {
    return this.inOrderTree(this.root, callback);
  }

  inOrderTree(root, callback) {
    if (!root) return null;

    if (callback) {
      this.inOrderTree(root.left, callback);
      callback(root);
      this.inOrderTree(root.right, callback);
    }  else {
      let array = [];
      let left = this.inOrderTree(root.left, callback);
      if (left) array = array.concat(left);
      array.push(root.value);
      let right = this.inOrderTree(root.right, callback);
      if (right) array = array.concat(right);
      return array;
    }
  }
  
  postOrder(callback) {
    return this.postOrderTree(this.root, callback);
  }

  postOrderTree(root, callback) {
    if (!root) return null;

    if (callback) {
      this.postOrderTree(root.left, callback);
      this.postOrderTree(root.right, callback);
      callback(root); 
    } else {
      let array = [];
      let left = this.postOrderTree(root.left, callback);
      if (left) array = array.concat(left);
      let right = this.postOrderTree(root.right, callback);
      if (right) array = array.concat(right);
      array.push(root.value)
      return array;
    }
  }

  height(node) {
    if (!node) return 0;
    let leftPath = this.height(node.left);
    let rightPath = this.height(node.right);
    return (leftPath > rightPath) ? leftPath + 1 : rightPath + 1; 
  }

  depth(node) {
    if (node && this.find(node.value)) return this.depthNode(this.root, node);
    return null;
  }

  depthNode(root, node) {
    if (root.value === node.value) return 0;
    if (node.value < root.value) return this.depthNode(root.left, node) + 1;
    return this.depthNode(root.right, node) + 1;
  }
  
  isBalanced() {
    return this.isBalancedNode(this.root);
  }

  isBalancedNode(node) {
    if (!node) return true;
    if (Math.abs(this.height(node.left) - this.height(node.right)) > 1) return  false;
    return (this.isBalancedNode(node.left) && this.isBalancedNode(node.right));
  }

  rebalance() {
    let data = this.inOrder();
    this.root = this.buildTree(data);
  }
}

const merge = (left, right) => {
  let i = 0,
    j = 0;
  let sorted = [];

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      sorted.push(left[i]);
      i += 1;
    } else {
      sorted.push(right[j]);
      j += 1;
    }
  }

  if (i < left.length) sorted = sorted.concat(left.slice(i));
  else if (j < right.length) sorted = sorted.concat(right.slice(j));

  return sorted;
};

const mergeSort = (arr) => {
  if (arr.length == 1) return arr;

  let left = mergeSort(arr.slice(0, Math.floor(arr.length / 2)));
  let right = mergeSort(arr.slice(Math.floor(arr.length / 2)));

  return merge(left, right);
};

const removeDuplicates = (array) => {
  let cleaned = [];

  array.forEach((item) => {
    if (!cleaned.includes(item)) cleaned.push(item);
  });

  return cleaned;
};

const randomArray = (size, upperBound) => {
  let arr = [];
  for (let i = 0; i < size ; i += 1) arr.push(Math.floor(Math.random() * upperBound  + 1)); 
  return arr;
}

const displayTreeOrder = (tree) => {
  console.log("LevelOrder Traversal\n-------------------");
  tree.levelOrder();
  console.log(`PreOrder Traversal\n-------------------\n${tree.preOrder().join(" -> ")}`);
  console.log(`InOrder Traversal\n-------------------\n${tree.inOrder().join(" -> ")}`);
  console.log(`PostOrder Traversal\n-------------------\n${tree.postOrder().join(" -> ")}`);
}

const istheTreeBalanced = (tree) => {
  if (tree.isBalanced()) console.log("==========Tree balanced==========\n");
  else console.log("==========Tree unbalanced==========\n");
}

const addNumbers = (tree, n, lowerBound) => {
  for (let i = 0; i < n; i += 1) tree.insert(Math.floor(Math.random() * lowerBound + 1) + lowerBound);
} 

let tree = new Tree(randomArray(20, 100));
prettyPrint(tree.root);
istheTreeBalanced(tree);
displayTreeOrder(tree);
addNumbers(tree, 10, 100);
prettyPrint(tree.root);
istheTreeBalanced(tree);
tree.rebalance();
prettyPrint(tree.root);
istheTreeBalanced(tree);
displayTreeOrder(tree);
