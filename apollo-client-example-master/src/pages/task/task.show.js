import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_BOOK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      taskType {
        id
        name
      }
      executor {
        id
        name
      }
      important
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

  if (loading) return <p>Загрузка...</p>;

  if (error) return <p>Ошибка :(</p>;

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
      <table className="table">
        <tbody>
          <tr>
            <th>Номер задачи</th>
            <td>{task?.id}</td>
          </tr>
          <tr>
            <th>Название</th>
            <td>{task?.title}</td>
          </tr>
          <tr>
            <th>Тип</th>
            <td>{task?.taskType?.name}</td>
          </tr>
          <tr>
            <th>Исполнитель</th>
            <td>{task?.executor?.name}</td>
          </tr>
          <tr>
            <th>Описание</th>
            <td>{task?.description}</td>
          </tr>
          <tr>
            <th>Важное</th>
            <td>{task?.important ? "Да" : "Нет"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TaskShowPage;
