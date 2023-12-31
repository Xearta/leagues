import React, { useState, useEffect } from "react";
import "./App.css";
import TaskTableHeader from "./TaskTableHeader";
import tasks from "./tasks";
// Import tasks from localStorage if available, otherwise use the default tasks
import { loadTasks, saveTasks, exportTasks, importTasks } from "./taskStorage";

function App() {
  const [taskList, setTaskList] = useState(loadTasks().tasks || tasks);
  const [hideCompleted, setHideCompleted] = useState(true);
  const [filterArea, setFilterArea] = useState("All");
  const [filterRequirements, setFilterRequirements] = useState("All");
  const [sortBy, setSortBy] = useState({ field: "points", ascending: true });
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  const [totalPoints, setTotalPoints] = useState(0);
  const [checkedAreas, setCheckedAreas] = useState(loadTasks().selectedAreas); // Define checkedAreas state

  // Define point requirements for each area
  const areaPointRequirements = [
    0, 0, 2000, 4000, 7000, 11000, 15000, 22000, 35000, 50000, 75000,
  ];

  const unlockedAreasCount = areaPointRequirements.filter(
    (points) => totalPoints >= points
  ).length;
  const lockedAreas = areaPointRequirements.length - unlockedAreasCount;
  const nextUnlockIndex = unlockedAreasCount;
  const pointsNeededForNextUnlock =
    lockedAreas > 0
      ? Math.max(0, areaPointRequirements[nextUnlockIndex] - totalPoints)
      : 0;

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

  // Function to handle exporting tasks
  const handleExport = () => {
    exportTasks(taskList);
  };

  // Function to handle importing tasks
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importTasks(file)
        .then((importedTasks) => {
          setTaskList(importedTasks);
          saveTasks(importedTasks, checkedAreas);
        })
        .catch((error) => {
          // Handle import error
        });
    }
  };

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
        imageSrc = process.env.PUBLIC_URL + "/assets/Easy_Badge.webp";
        altText = "Easy";
        break;
      case 40:
        imageSrc = process.env.PUBLIC_URL + "/assets/Medium_Badge.webp";
        altText = "Medium";
        break;
      case 80:
        imageSrc = process.env.PUBLIC_URL + "/assets/Hard_Badge.webp";
        altText = "Hard";
        break;
      case 200:
        imageSrc = process.env.PUBLIC_URL + "/assets/Elite_Badge.webp";
        altText = "Elite";
        break;
      case 400:
        imageSrc = process.env.PUBLIC_URL + "/assets/Master_Badge.webp";
        altText = "Master";
        break;
      default:
        return points; // Display points as text if no match
    }

    return (
      <span style={{ display: "flex", alignItems: "center" }}>
        <img src={imageSrc} alt={altText} style={{ marginRight: "5px" }} />
        {points}
      </span>
    );
  };

  return (
    <div className="container">
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
      <div className="total-points">
        <span>Total Points: </span>
        {totalPoints}
        <span>/145,610</span>
        {lockedAreas > 0 && (
          <>
            <span> ({pointsNeededForNextUnlock} Points for next area)</span>
          </>
        )}
      </div>
      {/* Display unlockable areas information */}
      <div className="unlock-info">
        <p>
          Available Areas: {unlockedAreasCount} / {areaPointRequirements.length}
        </p>
      </div>

      {/* Add filter and sorting controls here */}
      <div className="controls">
        <div className="column">
          {/* Top left: Hide 'x' completed tasks */}
          <label>
            <input
              type="checkbox"
              checked={!hideCompleted}
              onChange={() => setHideCompleted(!hideCompleted)}
            />
            Hide {completedTasksCount} completed tasks
          </label>

          {/* Bottom left: 'x' tasks are being shown */}
          <div className="task-count">
            {checkedAreas.length > 0
              ? sortedTasks.length === 1
                ? "1 task is being shown"
                : `${sortedTasks.length} tasks are being shown`
              : "No area selected. Please select at least one area."}
          </div>
        </div>

        <div className="column column-right">
          {/* Top right: Export tasks */}
          <button className="export-button" onClick={handleExport}>
            Export Tasks
          </button>

          {/* Bottom right: Import button */}
          <div className="import-container">
            <input
              id="file-input"
              className="import-button"
              type="file"
              onChange={handleImport}
            />
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar-input"
        />
      </div>
      {checkedAreas.length > 0 && (
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
              const isNARequirement = task.requirements === "N/A";
              const taskStyles = {
                backgroundColor: isCompletedTask ? "lightgreen" : "",
              };
              const requirementStyles = {
                backgroundColor: isCompletedTask
                  ? "lightgreen"
                  : isNARequirement
                  ? "#E8F6DC"
                  : "",
                textAlign: isNARequirement ? "center" : "left",
                color: isNARequirement ? "#8A8C88" : "",
                fontWeight: isNARequirement ? 200 : 400,
                fontSize: isNARequirement ? "0.8em" : "1em",
              };

              return (
                <tr
                  key={task.id}
                  className={taskClassName}
                  onClick={() => completeTask(task.id)}
                  style={taskStyles}
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
                  <td style={requirementStyles}> {task.requirements}</td>{" "}
                  <td>{pointsToImage(task.points)}</td>
                  <td>{task.completion}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
