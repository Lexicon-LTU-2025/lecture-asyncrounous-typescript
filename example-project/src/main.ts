// ############ XMLHttpRequest - Basic example ##########

// const xhr = new XMLHttpRequest();
// xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);

// xhr.addEventListener('readystatechange', () => {
//   if (xhr.readyState === 4) {
//     if (xhr.status === 200) {
//       // const result = JSON.parse(xhr.responseText);
//       // console.log(result);
//     } else {
//       console.error('Error:', xhr.status);
//     }
//   }
// });

// xhr.send();

// ############ XMLHttpRequest with typing - Quick, unsafe cast ##########
// It gets typed but we need to trust that the payload is correct.

interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

// const xhr1 = new XMLHttpRequest();
// xhr1.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);

// xhr1.addEventListener('readystatechange', () => {
//   if (xhr.readyState === 4) {
//     if (xhr.status === 200) {
//       const todos = JSON.parse(xhr.responseText) as ITodo[];
//       console.log(todos[0].title);
//     } else {
//       console.error('Error:', xhr.status);
//     }
//   }
// });

// xhr1.send();

// ############ XMLHttpRequest with typing - Runtime-checked with type guards ##########
// This is overkill but it will make the expected todos strongly typed, and we can use it safetly.

const isTodo = (x: unknown): x is ITodo => {
  const obj = x as Record<string, unknown>;

  return (
    !!obj &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.completed === 'boolean'
  );
};

const isTodoArray = (x: unknown): x is ITodo[] => {
  return Array.isArray(x) && x.every(isTodo);
};

/**
 * 'x is ITodo[]', or with any other type is a TypeScript-only feature called a type predicate,
 * and it disappears completely when the code is compiled to JavaScript. It tells the compiler:
 * 'If this function returns true, you can treat x as an ITodo inside the calling scope'
 */

// const xhr2 = new XMLHttpRequest();
// xhr2.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);

// xhr2.addEventListener('readystatechange', () => {
//   if (xhr2.readyState === 4) {
//     if (xhr2.status === 200) {
//       const parsedData: unknown = JSON.parse(xhr2.responseText);
//       console.log(parsedData);

//       if (!isTodoArray(parsedData)) {
//         throw new Error('Invalid response structure');
//       }

//       console.log(parsedData[5].title);
//     } else {
//       console.error('Error:', xhr2.status);
//     }
//   }
// });

// xhr2.send();

// ############ Fetch API ##########

// BOM - Browser Objcect Model
// Accessible via the window object. But we don't need to explicitly use widow. Fetch exists on the window object among many other things.

// fetch('https://jsonplaceholder.typicode.com/todos')
//   .then((res) => {
//     // console.log(res);
//     return res.json() as unknown as ITodo[]; // Unsafe cast
//   })
//   .then((data) => {
//     // console.log(data.slice(0, 5));
//     // Data is now accessible and we can do stuff.
//   });

// fetch('https://jsonplaceholder.typicode.com/todos')
//   .then((res) => {
//     // console.log(res);
//     return res.json() as unknown;
//   })
//   .then((data) => {
//     // Data is now accessible and we can do stuff.
//     if (!isTodoArray(data)) { // Safe typing
//       throw new Error('Invalid response shape');
//     }

//     console.log(data);
//   });

// ########## Async/Await with fetch ############

// Arrow function
// const fetchTodos = async (): ITodo[] => {};

// Regular function with keyword
async function fetchTodos(): Promise<ITodo[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');

  if (res.ok) {
    /* Do something */
  }

  const data = (await res.json()) as unknown;

  if (!isTodoArray(data)) {
    // Safe typing
    throw new Error('Invalid response shape');
  }

  return data;
}

const todos = fetchTodos();
console.log(todos); // This will be a promise since this code will run along without wating for the fetchTodos to be completed.

// In order to properly wiat for the todos we need to use .then.
fetchTodos().then((todos) => {
  console.log(todos);
});

console.log("This is still running")
