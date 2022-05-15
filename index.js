var PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
//allows us to fetch from covid API
const cors = require('cors');
app.use(
    cors({
        origin: 'https://api.covid19tracker.ca/summary/split',
    }
    )
)
app.listen(PORT, () => console.log("listening at 3000"));
app.use(express.static('public'))