require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/webhooked', (req, res) => {
    res.send('<h1>Welcome to the  Page!</h1><p>This is a simple page.</p>');
});
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.post('/webhooked', async (req, res) => {
    console.log('Received webhook:', req.body);

    if (req.body.Entity.AssignedTo === 657) {
    const apiUrl = 'https://api.planadoapp.com/v2/jobs';
    const bearerToken = process.env.BEARER_TOKEN;  // env variables

    const postData = {
      //  client: {
        //    organization: true, 
        //    organization_name: req.body.Entity.Company  
     //   },
        template: {
            name: 'IR'  // Add the template name here
        },
        description: req.body.Entity.Summary    
    };
    
    try {
        const response = await axios.post(apiUrl, postData, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Data sent to external API:', response.data);
        res.status(200).json({
            message: 'Webhook received and processed!',
            jobUuid: response.data.job_uuid
        });
    } catch (error) {
        console.error('Error sending data to external API:', error);
        res.status(500).json({
            message: 'Error processing webhook',
            error: error.message
        });
    }
}   
else {
    // If UDF_section is not 2, do not process the webhook for external API
    res.status(200).json({
        message: 'Webhook received but not processed due to UDF_section condition'
    });
}
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
