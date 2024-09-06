function mergeColors(colors) {
    // Convert the hex values to RGB values and add them up
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    for (let i = 0; i < colors.length; i++) {
      let r = parseInt(colors[i].substring(1, 3), 16);
      let g = parseInt(colors[i].substring(3, 5), 16);
      let b = parseInt(colors[i].substring(5, 7), 16);
      totalR += r;
      totalG += g;
      totalB += b;
    }
  
    // Calculate the merged RGB values
    let avgR = Math.floor(totalR / colors.length);
    let avgG = Math.floor(totalG / colors.length);
    let avgB = Math.floor(totalB / colors.length);
  
    // Convert the merged RGB values back to hex
    let mergedColor = "#" + avgR.toString(16).padStart(2, '0') + avgG.toString(16).padStart(2, '0') + avgB.toString(16).padStart(2, '0');
  
    return mergedColor;
  }
  
//   // Example usage
//   // let colors = ['#FFE4C4', '#FFA07A', '#008080', '#B8860B'];// Result: "#A5896C"
//   let colors = ['#FFE4C4', '#FFE4C4', '#FFE4C4', '#FFE4C4']; // Result: "##ffe4c4"
//   let mergedColor = mergeColors(colors);
//   console.log( mergedColor)
  