const views = require("./src/applicationviews");

function main() {
    views.main_menu(new Map());
  }
  
  if (require.main === module) {
    main();
  }