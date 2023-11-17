export const loadTasks = () => {
  try {
    const serializedData = localStorage.getItem("tasksData");
    if (serializedData === null) {
      return { tasks: [], selectedAreas: [] }; // If no data is saved, return default values
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
