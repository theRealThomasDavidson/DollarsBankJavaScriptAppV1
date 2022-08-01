const views = require("./src/applicationviews");

function main() {
    views.account();
  }
  
  if (require.main === module) {
    main();
  }