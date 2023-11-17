import React, { useState, useEffect } from "react";
import "./App.css";
import TaskTableHeader from "./TaskTableHeader";
import tasks from "./tasks";
// Import tasks from localStorage if available, otherwise use the default tasks
import { loadTasks, saveTasks } from "./taskStorage";

function App() {
  const [taskList, setTaskList] = useState(loadTasks().tasks || tasks);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [filterArea, setFilterArea] = useState("All");
  const [filterRequirements, setFilterRequirements] = useState("All");
  const [sortBy, setSortBy] = useState({ field: "points", ascending: true });
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  const [totalPoints, setTotalPoints] = useState(0);
  const [checkedAreas, setCheckedAreas] = useState(loadTasks().selectedAreas); // Define checkedAreas state

  useEffect(() => {
    const { tasks: tasks, selectedAreas: selectedAreas } = loadTasks();

    setTaskList(tasks);
    setCheckedAreas(selectedAreas);
  }, []);

  useEffect(() => {
    // Calculate the total points whenever the taskList changes
    const completedTasks = taskList.filter((task) => task.completed);
    const completedPoints = completedTasks.reduce(
      (sum, task) => sum + task.points,
      0
    );
    setTotalPoints(completedPoints);

    // Save tasks to localStorage whenever the taskList changes
    saveTasks(taskList, checkedAreas);
  }, [taskList, checkedAreas]);

  const completedTasksCount = taskList.filter((task) => task.completed).length;

  const completeTask = (taskId) => {
    setTaskList((prevTaskList) => {
      const updatedTasks = prevTaskList.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      return updatedTasks;
    });
  };

  const filteredTasks = taskList
    .filter((task) => hideCompleted || !task.completed)
    .filter((task) => filterArea === "All" || task.area === filterArea)
    .filter(
      (task) => checkedAreas.length === 0 || checkedAreas.includes(task.area)
    )
    .filter(
      (task) =>
        searchTerm === "" ||
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.requirements.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSort = (field) => {
    setSortBy((prevSort) => ({
      field,
      ascending: prevSort.field === field ? !prevSort.ascending : true,
    }));
  };

  const sortedTasks = filteredTasks
    .filter(
      (task) =>
        (hideCompleted || !task.completed) &&
        (filterArea === "All" || task.area === filterArea)
    )
    .sort((a, b) => {
      const fieldA = a[sortBy.field];
      const fieldB = b[sortBy.field];

      if (sortBy.field === "completion") {
        // For completion percentage, convert to numbers for comparison
        return sortBy.ascending ? fieldA - fieldB : fieldB - fieldA;
      } else {
        // For other fields, compare as numbers
        return sortBy.ascending ? fieldA - fieldB : fieldB - fieldA;
      }
    });

  const pointsToImage = (points) => {
    let imageSrc, altText;

    switch (points) {
      case 10:
        imageSrc = "./assets/Easy_Badge.webp";
        altText = "Easy";
        break;
      case 40:
        imageSrc = "./assets/Medium_Badge.webp";
        altText = "Medium";
        break;
      case 80:
        imageSrc = "./assets/Hard_Badge.webp";
        altText = "Hard";
        break;
      case 200:
        imageSrc = "./assets/Elite_Badge.webp";
        altText = "Elite";
        break;
      case 400:
        imageSrc = "./assets/Master_Badge.webp";
        altText = "Master";
        break;
      default:
        return points; // Display points as text if no match
    }

    return (
      <span>
        <img src={imageSrc} alt={altText} style={{ marginRight: "5px" }} />
        {points}
      </span>
    );
  };

  return (
    <div className="App">
      <TaskTableHeader
        initialCheckedRows={checkedAreas.reduce(
          (checkedRows, area) => ({ ...checkedRows, [area]: true }),
          {}
        )}
        onCheckboxChange={(area) => {
          setCheckedAreas((prevCheckedAreas) => {
            if (prevCheckedAreas.includes(area)) {
              return prevCheckedAreas.filter(
                (checkedArea) => checkedArea !== area
              );
            } else {
              return [...prevCheckedAreas, area];
            }
          });
        }}
      />

      {/* Add filter and sorting controls here */}
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={!hideCompleted}
            onChange={() => setHideCompleted(!hideCompleted)}
          />
          Hide {completedTasksCount} completed tasks
        </label>
      </div>

      {/* Display the number of tasks being shown */}
      <div className="task-count">
        {sortedTasks.length === 1
          ? "1 task is being shown"
          : `${sortedTasks.length} tasks are being shown`}
      </div>

      <div className="total-points">
        <span>Total Points: </span>
        {totalPoints}
        <span>/145,610</span>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead className="task-table-header">
          <tr>
            <th onClick={() => handleSort("area")}>Area</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("description")}>Task</th>
            <th onClick={() => handleSort("requirements")}>Requirements</th>
            <th onClick={() => handleSort("points")}>Points</th>
            <th onClick={() => handleSort("completion")}>Comp%</th>
          </tr>
        </thead>

        <tbody>
          {/* Your task list will be dynamically generated here */}
          {sortedTasks.map((task) => {
            const isCompletedTask = task.completed;
            const taskClassName = `task ${
              isCompletedTask ? "completed-task" : ""
            }`;

            return (
              <tr
                key={task.id}
                className={taskClassName}
                onClick={() => completeTask(task.id)}
              >
                <td>
                  <img
                    src={process.env.PUBLIC_URL + task.logoUrl}
                    alt={`${task.area} Logo`}
                  />{" "}
                  {/* Use logo image from URL */}
                </td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.requirements}</td>
                <td>{pointsToImage(task.points)}</td>
                <td>{task.completion}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
