import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import AsyncSelect from "react-select/async";
import styled from "styled-components";

const Form = styled.div`
  padding: 25px;
  width: 300px;

  input {
    width: 100%;
  }
`;

const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      executor {
        id
        name
      }
      taskType {
        id
        name
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers($name: String) {
    users(name: $name ) {
      id
      name
    }
  }
`

const GET_TYPES = gql`
  query GetTaskTypes($name: String) {
    taskTypes(name: $name) {
      id
      name
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput) {
    updateTask(id: $id, input: $input) {
      id
      title
      taskType {
        id
        name
      }
      executor {
        id
        name
      }
    }
  }
`;

const TaskEditPage = () => {
  let history = useHistory();
  let { taskId } = useParams();

  const [task, setTask] = useState({
    id: null,
    title: "",
    taskType: null,
    executor: null,
  });

  const [getTaskTypes, { data: taskTypesData }] = useLazyQuery(GET_TYPES);
  const [getUsers, {data: usersData}] = useLazyQuery(GET_USERS);
  const { loading, error } = useQuery(GET_TASK, {
    variables: {
      id: taskId,
    },
    fetchPolicy: "no-cache",
    onCompleted: (data) =>
      setTask({
        id: data.task?.id,
        title: data.task?.title,
        executor: {
          value: parseInt(data.task?.executor?.id),
          label: data.task?.executor?.name,
        },
        taskType: {
          value: parseInt(data.task?.taskType?.id),
          label: data.task?.taskType?.name,
        },
      }),
  });
  const [updateTask] = useMutation(UPDATE_TASK, {
    variables: {
      id: task.id,
      input: { title: task.title, taskTypeId: task.taskType?.value, executorId: task.executor?.value },
    },
  });
  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;
    console.log(task.executor)
  return (
    <Form>
      <div>
        <label>
          <div>Название задачи</div>
          <input
            type="text"
            value={task.title}
            onChange={(event) =>
              setTask({ ...task, title: event.target.value })
            }
          />
        </label>
      </div>
      <div>
        <label>
          <div>Тип задачи</div>
          <AsyncSelect
            cacheOptions
            defaultOptions
            value={task.taskType}
            onChange={(taskType) => {
              setTask({
                ...task,
                taskType: taskType,
              });
            }}
            loadOptions={(inputValue) =>
              new Promise((resolve) => {
                getTaskTypes({
                  variables: {
                    name: inputValue,
                  },
                });

                const options = taskTypesData.taskTypes.map((taskType) => ({
                  value: parseInt(taskType.id),
                  label: taskType.name,
                }));

                resolve(options);
              })
            }
          />
        </label>
        <div>Исполнитель</div>
          <AsyncSelect
            cacheOptions
            defaultOptions
            value={task.executor}
            onChange={(executor) => {
              setTask({
                ...task,
                executor: executor,
              });
            }}
            loadOptions={(inputValue) =>
              new Promise((resolve) => {
                getUsers({
                  variables: {
                    name: inputValue,
                  },
                });

                const options = usersData.users.map((user) => ({
                  value: parseInt(user.id),
                  label: user.name,
                }));

                resolve(options);
              })
            }
          />
      </div>
      <div>Описание</div>

      <div>
        <button
          onClick={() => {
            updateTask()
              .then((task) => {
                history.push(`/task/${task.data.updateTask.id}`);
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          Сохранить
        </button>
      </div>

    
    </Form>
  );
          
};

export default TaskEditPage;
