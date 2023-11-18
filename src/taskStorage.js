import tasksData from "./tasks"; // Use a different name to avoid conflicts with the loadTasks function

export const loadTasks = () => {
  try {
    const serializedData = localStorage.getItem("tasksData");
    if (serializedData === null) {
      return { tasks: tasksData, selectedAreas: ["General", "Misthalin"] }; // Use default tasks from tasks.js and set default areas
    }
    const { tasks, selectedAreas } = JSON.parse(serializedData);
    return { tasks: tasks || [], selectedAreas: selectedAreas || [] };
  } catch (err) {
    console.error("Error loading data from localStorage:", err);
    return { tasks: [], selectedAreas: [] }; // Return default values in case of an error
  }
};

export const saveTasks = (tasks, selectedAreas) => {
  try {
    const dataToSave = {
      tasks,
      selectedAreas,
    };
    const serializedData = JSON.stringify(dataToSave);
    localStorage.setItem("tasksData", serializedData);
  } catch (err) {
    console.error("Error saving data to localStorage:", err);
  }
};

// Function to export tasks
export const exportTasks = (tasks) => {
  try {
    const serializedTasks = JSON.stringify(tasks);
    const blob = new Blob([serializedTasks], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.txt";
    a.click();

    // Clean up the URL object to free up resources
    URL.revokeObjectURL(url);

    console.log("Tasks exported successfully.");
  } catch (error) {
    console.error("Error exporting tasks:", error);
  }
};

// Function to import tasks
export const importTasks = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        const tasks = JSON.parse(event.target.result);
        console.log("Tasks imported successfully:", tasks);
        resolve(tasks);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(error);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error importing tasks:", error);
      reject(error);
    }
  });
};
