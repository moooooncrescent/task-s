import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_BOOK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
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

const TaskShowPage = () => {
  let { taskId } = useParams();
  const [task, setTask] = useState();

  const { loading, error } = useQuery(GET_BOOK, {
    variables: {
      id: taskId,
    },
    fetchPolicy: "no-cache",
    onCompleted: (data) => setTask(data.task),
  });

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="/task/list">Назад</Link>
          </li>
          <li>
            <Link to={`${taskId}/edit`}>Редактировать</Link>
          </li>
        </ul>
      </div>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <td>{task?.id}</td>
          </tr>
          <tr>
            <th>Title</th>
            <td>{task?.title}</td>
          </tr>
          <tr>
            <th>TaskType</th>
            <td>{task?.taskType?.name}</td>
          </tr>
          <tr>
            <th>Executor</th>
          <td>{task?.executor?.name}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaskShowPage;
