const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Task {
    id: ID
    title: String
    taskType: TaskType
    executor: User
    description: String
  }

  input TaskInput {
    title: String!
    taskTypeId: ID!
    executorId: ID!
    description: String!
  }

  input TaskUpdateInput {
    title: String
    taskTypeId: Int
    executorId: Int
    description: String
  }

  type TaskType {
    id: ID
    name: String
  }

  type Query {
    tasks(name: String): [Task]
    task(id: ID!): Task
    taskTypes(name: String): [TaskType]
    users(name: String): [User]
  }

  type Mutation {
    addTask(input: TaskInput): Task
    updateTask(id: ID!, input: TaskUpdateInput): Task
  }

  type User {
    id: ID
    name: String 

  }
`;

const taskTypes = [
  {
    id: 1,
    name: "Рабочая",
  },
  {
    id: 2,
    name: "Регулярная",
  },
];

const tasks = [
  {
    id: 1,
    title: "Задача 1",
    taskTypeId: 1,
    executorId: 1,
  },
  {
    id: 2,
    title: "Задача 2",
    taskTypeId: 2,
    executorId: 2,
  },
];
const users = [
  {
    id: 1,
    name: 'Виталий',
  },
  {
    id: 2,
    name:'не Ярiк',
  }
];


const resolvers = {
  Query: {
    tasks: (_, { name }) =>
      name !== undefined && name !== ""
        ? tasks.filter((task) => task.title.search(name) !== -1)
        : tasks,
    task: (_, { id }) => tasks.find((task) => task.id === parseInt(id)),
    taskTypes: (_, { name }) =>
      name !== undefined && name !== ""
        ? taskTypes.filter((taskType) => taskType.name.search(name) !== -1)
        : taskTypes,
    users: (_, { name }) =>
        name !== undefined && name !== ""
          ? users.filter((user) => user.name.search(user) !== -1)
          : users,
    
  },
  Mutation: {
    addTask: (_, { input }) => {
      const newTask = {
        id: tasks.length + 1,
        title: input.title,
        taskTypeId: parseInt(input.taskTypeId),
        description: input.description,
      };

      tasks.push(newTask);

      return tasks.find((task) => task.id === tasks.length);
    },
    updateTask: (_, { id, input }) => {
      const task = tasks.find((task) => task.id === parseInt(id));

      if (task) {
        const newList = tasks.filter((task) => task.id === parseInt(id));
        const newTask = Object.assign(task, { ...input });
        newList.push(newTask);

        return newTask;
      }

      return null;
    },
  },
  Task: {
    taskType: (task) => {
      return taskTypes.find((taskType) => taskType.id === task.taskTypeId);
    },
    executor: (task) => {
      return users.find((user) => user.id === task.executorId);
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
