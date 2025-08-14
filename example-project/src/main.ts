interface ITodo {
  id: number;
  title: string;
  completed: boolean;
}

// ########## XMLHttpRequest ##########

const xhr1 = new XMLHttpRequest();
// console.log('readyState:', xhr1.readyState);

xhr1.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);
// console.log('readyState:', xhr1.readyState);

xhr1.addEventListener('readystatechange', () => {
  const { responseText, readyState, status } = xhr1;

  if (xhr1.readyState === 4) {
    if (status === 200) {
      // console.log('readyState:', readyState);
      const result = JSON.parse(responseText);
      // console.log(result);
    } else {
      console.error('Error:', status);
    }
  }
});

xhr1.send();

// ########## XMLHttpRequest with typing - Quick, unsafe cast ##########
// It gets type but we need to trust that the payload is correct

const xhr2 = new XMLHttpRequest();
xhr2.open('GET', 'https://jsonplaceholder.typicode.com/todos', true);

xhr2.addEventListener('readystatechange', () => {
  const { responseText, readyState, status } = xhr2;

  if (xhr2.readyState === 4) {
    if (status === 200) {
      // console.log('readyState:', readyState);
      const todos = JSON.parse(responseText) as ITodo[];
    } else {
      console.error('Error:', status);
    }
  }
});

xhr2.send();

// ########## XMLHttpRequest with typing - Runtime-checked with type guards ##########
// This is overkill but it will make the expected todos strongly typed, and we can use it safetly

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

const xhr3: XMLHttpRequest = new XMLHttpRequest();
xhr3.open('GET', 'https://jsonplaceholder.typicode.com/todos');
xhr3.addEventListener('load', () => {
  try {
    const parsedData: unknown = JSON.parse(xhr3.responseText);

    if (!isTodoArray(parsedData)) {
      throw new Error('Invalid response shape');
    }

    const todos = parsedData;
    // console.log('Todos loaded:', todos);
  } catch (err) {
    console.error('Failed to process response:', err);
  }
});

xhr3.send();

// ########## Fetch API ##########

async function getTodos() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos');

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: unknown = await res.json();

  if (!isTodoArray(data)) {
    throw new Error('Invalid response shape');
  }

  return data;
}

getTodos()
  .then((todos) => console.log(todos.slice(0, 5)))
  .catch(console.error);
