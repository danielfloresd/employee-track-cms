// Import express package
const app = require("./app");
const PORT = process.env.PORT || 3001;

// Listener
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});