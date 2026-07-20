//import goals from assets/images/goals
const goalImages = import.meta.glob(
  "../assets/images/goals/*.png",
  {
    eager: true,
    import: "default",
  }
);

console.log("goalImages", goalImages);
// Base Game Goals (1-16)
// Europe Goals (17-26)
// Oceania Goals (27-34)
// Americas Goals (35-44)

export const goals = Object.entries(goalImages).map(
  ([path, image]) => {
    const fileName =
      path.split("/").pop().replace(".png", "");
    
    const expansion = fileName.split("-")[0]; // Extract the expansion from the filename

    return {
      id: fileName,
      image: image,
      expansion: expansion
    };
  }
);

export default goals;
