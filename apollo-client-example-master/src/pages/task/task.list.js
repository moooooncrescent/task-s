import React, { useState } from "react";
import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const List = styled.table`
  padding: 25px;
`;

const GET_BOOKS = gql`
  query GetTasks($name: String) {
    tasks(name: $name) {
      id
      title
      taskType {
        id
        name
      }
    }
  }
`;

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);

  const { loading, error } = useQuery(GET_BOOKS, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => setTasks(data.tasks),
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div>
        <h1>Задачи</h1>
        <Link to="/task/create">Добавить задачу</Link>
      </div>
      <List>
        <table className="table text-center">
          <thead>
            <tr>
              <th>Название задачи</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={`task-${task.id}`}>
                <td>
                  <Link to={`/task/${task.id}`}>{task.title}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </List>
    </div>
  );
};

export default TaskListPage;
